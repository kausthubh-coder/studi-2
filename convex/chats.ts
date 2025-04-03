import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

/**
 * Helper function to extract the clean Clerk ID
 */
function getCleanClerkId(subject: string): string {
  return subject.includes("|") ? subject.split("|")[1] : subject;
}

// Create a new chat
export const createChat = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: Please sign in to create a chat");
    }
    
    // Extract clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);
    console.log("Using Clerk ID:", clerkId);

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Create a new chat
    const chatId = await ctx.db.insert("chats", {
      userId: user._id,
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return chatId;
  },
});

// Get all chats for the current user
export const getChats = query({
  handler: async (ctx) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: Please sign in to view your chats");
    }
    
    // Extract clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);
    console.log("Getting chats for Clerk ID:", clerkId);

    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Get all chats for this user
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return chats;
  },
});

// Get a specific chat by ID
export const getChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in to view this chat");
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the chat
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Verify that the user has access to this chat
    if (chat.userId !== user._id) {
      throw new Error("Unauthorized: You don't have access to this chat");
    }

    return chat;
  },
});

// Delete a chat
export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the chat
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Check if the user owns this chat
    if (chat.userId !== user._id) {
      throw new Error("Unauthorized: You don't have permission to delete this chat");
    }

    // Delete all messages in this chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the chat
    await ctx.db.delete(args.chatId);

    return { success: true };
  },
});

// Update a chat
export const updateChat = mutation({
  args: {
    id: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the chat
    const chat = await ctx.db.get(args.id);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Check if the user owns this chat
    if (chat.userId !== user._id) {
      throw new Error("Unauthorized: You don't have permission to update this chat");
    }

    // Update the chat
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get all messages for a specific chat
export const getChatMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: Please sign in to view chat messages");
    }
    
    // Extract clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);

    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Get the chat
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new ConvexError("Chat not found");
    }

    // Verify the user owns this chat
    if (chat.userId !== user._id) {
      throw new ConvexError("Unauthorized: You do not have access to this chat");
    }

    // Get all messages for this chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    return messages;
  },
}); 