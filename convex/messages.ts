import { v } from "convex/values";
import { mutation, query, internalMutation, action } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Get all messages for a chat
export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    // Optional: Check if the user has access to this chat
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get messages for this chat, sorted by oldest first
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    return messages;
  },
});

// Save a message to the database (internal function used by OpenAI completion)
export const saveMessage = internalMutation({
  args: {
    chatId: v.id("chats"),
    userId: v.id("users"),
    content: v.string(),
    role: v.string(),
    tokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Insert the message
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content,
      role: args.role,
      tokens: args.tokens || 0,
      createdAt: Date.now(),
    });

    // Update the chat's updatedAt timestamp
    await ctx.db.patch(args.chatId, {
      updatedAt: Date.now(),
    });

    // If this is the first message, update the chat title to match first few words
    const chat = await ctx.db.get(args.chatId);
    if (chat && chat.title === "New Chat" && args.role === "user") {
      const title = args.content.slice(0, 40) + (args.content.length > 40 ? "..." : "");
      await ctx.db.patch(args.chatId, { title });
    }

    // If we have token info, update the user's usage
    if (args.tokens && args.role === "assistant") {
      // Get current usage
      const user = await ctx.db.get(args.userId);
      if (user) {
        // Update usage stats
        await ctx.db.patch(args.userId, {
          usageTokens: (user.usageTokens || 0) + args.tokens,
        });
      }
    }

    return messageId;
  },
});

// Send a message and get a response from the AI
export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in to send messages");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify the chat exists and the user has access
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    if (chat.userId !== user._id) {
      throw new Error("Unauthorized: You don't have access to this chat");
    }

    // Create the user's message
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content,
      role: "user",
      createdAt: Date.now(),
    });

    // Get previous messages for context (last 10 messages)
    const previousMessages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .take(10);

    // Format messages for OpenAI
    const formattedMessages = previousMessages
      .sort((a, b) => a.createdAt - b.createdAt) // Sort chronologically
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    // Add the latest message
    formattedMessages.push({
      role: "user",
      content: args.content,
    });

    console.log("Sending messages to OpenAI:", formattedMessages);

    // Get AI response using scheduler to run an action
    await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
      messages: formattedMessages,
      chatId: args.chatId,
      userId: user._id,
    });

    return {
      messageId,
      success: true,
    };
  },
}); 