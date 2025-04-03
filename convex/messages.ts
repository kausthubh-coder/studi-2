import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal, api } from "./_generated/api";
import { ConvexError } from "convex/values";

/**
 * Helper function to extract the clean Clerk ID
 */
function getCleanClerkId(subject: string): string {
  return subject.includes("|") ? subject.split("|")[1] : subject;
}

// Type definition for better type safety
type Message = {
  _id?: Id<"messages">;
  chatId: Id<"chats">;
  userId: Id<"users">;
  content: string;
  role: string;
  tokens?: number;
  functionCall?: string;
  createdAt: number; // Not optional
};

// Get all messages for a specific chat
export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized: Please sign in to view messages");
    }

    // Extract clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Verify that the chat belongs to this user
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== user._id) {
      throw new ConvexError("Unauthorized: You don't have access to this chat");
    }

    // Return the messages
    return await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

// Save a new message to the database (internal function for OpenAI completion)
export const saveMessage = internalMutation({
  args: {
    chatId: v.id("chats"),
    userId: v.id("users"),
    content: v.string(),
    role: v.string(),
    tokens: v.optional(v.number()),
    functionCall: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Saving message:", {
      chatId: args.chatId,
      role: args.role,
      contentLength: args.content.length,
      hasTokens: !!args.tokens,
      hasFunctionCall: !!args.functionCall
    });
    
    const messageData: Message = {
      chatId: args.chatId,
      userId: args.userId,
      content: args.content,
      role: args.role,
      tokens: args.tokens,
      functionCall: args.functionCall,
      createdAt: Date.now(),
    };
    
    return await ctx.db.insert("messages", messageData);
  },
});

// Send a message and get a response from the AI
export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Starting sendMessage with args:", args);
    
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    console.log("User identity:", identity ? "authenticated" : "not authenticated");
    
    if (!identity) {
      throw new ConvexError("Not authenticated - please sign in to send messages");
    }
    
    // Extract clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);
    console.log("Using clean Clerk ID:", clerkId);
    
    // Get user from database using identity
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => 
        q.eq("clerkId", clerkId)
      )
      .first();
    
    console.log("User lookup result:", user ? "found" : "not found");
    
    if (!user) {
      throw new ConvexError("User not found - please refresh the page or sign in again");
    }
    
    // Save the user's message
    console.log("Inserting user message to chat:", args.chatId);
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: user._id,
      content: args.content,
      role: "user",
      createdAt: Date.now(),
    });
    
    // Get all messages in the chat to provide context
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    
    console.log("Found", messages.length, "messages in chat history");
    
    // Format messages for OpenAI
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    
    try {
      console.log("Scheduling OpenAI response generation");
      // Call OpenAI to generate a response using our Canvas-enabled function
      await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
        messages: formattedMessages,
        chatId: args.chatId,
        userId: user._id,
      });
      
      console.log("Message sent successfully with ID:", messageId);
      return messageId;
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Save error message
      await ctx.db.insert("messages", {
        chatId: args.chatId,
        userId: user._id,
        content: `Error: ${error}`,
        role: "assistant",
        createdAt: Date.now(),
      });
      
      return messageId;
    }
  },
}); 