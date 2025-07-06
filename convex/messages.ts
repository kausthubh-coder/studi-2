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

// Send a message using the ReAct agent
export const sendAgentMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    useAgent: v.optional(v.boolean()),
    maxSteps: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("Starting sendAgentMessage with args:", args);
    
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
    
    // Add a temporary "thinking" message to show the agent is working
    const thinkingMessageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: user._id,
      content: "🤔 **Agent is thinking and analyzing...**\n\nI'm using the ReAct (Reasoning and Acting) approach to provide you with a comprehensive response. This may take a few moments as I gather and analyze information step by step.",
      role: "assistant",
      createdAt: Date.now(),
      isLoading: true,
    });
    
    try {
      console.log("Scheduling ReAct agent response generation");
      
      // Use the ReAct agent if requested or if the query seems complex
      const shouldUseAgent = args.useAgent !== false && (
        args.useAgent === true ||
        args.content.length > 50 ||
        args.content.includes("analyze") ||
        args.content.includes("compare") ||
        args.content.includes("plan") ||
        args.content.includes("schedule") ||
        args.content.includes("grade") ||
        args.content.includes("assignment") ||
        args.content.includes("course")
      );
      
             if (shouldUseAgent) {
         // TODO: Re-enable ReAct agent once Convex API is regenerated
         // Temporarily use enhanced OpenAI mode
         const messages = await ctx.db
           .query("messages")
           .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
           .order("asc")
           .collect();
         
         const formattedMessages = messages
           .filter(msg => !msg.isLoading) // Exclude loading messages
           .map(msg => ({
             role: msg.role,
             content: msg.content,
           }));
         
         await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
           messages: formattedMessages,
           chatId: args.chatId,
           userId: user._id,
         });
       } else {
        // Use original OpenAI function
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
          .order("asc")
          .collect();
        
        const formattedMessages = messages
          .filter(msg => !msg.isLoading) // Exclude loading messages
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));
        
        await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
          messages: formattedMessages,
          chatId: args.chatId,
          userId: user._id,
        });
      }
      
      // Remove the thinking message after scheduling
      await ctx.db.delete(thinkingMessageId);
      
      console.log("Message sent successfully with ID:", messageId);
      return messageId;
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove the thinking message
      await ctx.db.delete(thinkingMessageId);
      
      // Save error message
      await ctx.db.insert("messages", {
        chatId: args.chatId,
        userId: user._id,
        content: `❌ **Error**: ${error}\n\nI encountered an error while processing your request. Please try again.`,
        role: "assistant",
        createdAt: Date.now(),
        isError: true,
      });
      
      return messageId;
    }
  },
});

// Enhanced version of the original sendMessage that can choose between modes
export const sendEnhancedMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    mode: v.optional(v.union(v.literal("simple"), v.literal("agent"))),
    maxSteps: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("Starting sendEnhancedMessage with args:", args);
    
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new ConvexError("Not authenticated - please sign in to send messages");
    }
    
    // Extract clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);
    
    // Get user from database using identity
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => 
        q.eq("clerkId", clerkId)
      )
      .first();
    
    if (!user) {
      throw new ConvexError("User not found - please refresh the page or sign in again");
    }
    
    // Save the user's message
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: user._id,
      content: args.content,
      role: "user",
      createdAt: Date.now(),
    });
    
    // Determine which mode to use
    const mode = args.mode || "agent"; // Default to agent mode
    
    try {
             if (mode === "agent") {
         // TODO: Re-enable agent mode once Convex API is regenerated
         // Add thinking indicator
         const thinkingMessageId = await ctx.db.insert("messages", {
           chatId: args.chatId,
           userId: user._id,
           content: "🧠 **Agent Mode Active**\n\nAgent mode is currently being configured. Using enhanced mode for now...",
           role: "assistant",
           createdAt: Date.now(),
           isLoading: true,
         });
         
         // Temporarily use simple mode until agent is available
         const messages = await ctx.db
           .query("messages")
           .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
           .order("asc")
           .collect();
         
         const formattedMessages = messages.map(msg => ({
           role: msg.role,
           content: msg.content,
         }));
         
         await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
           messages: formattedMessages,
           chatId: args.chatId,
           userId: user._id,
         });
         
         // Remove thinking message
         await ctx.db.delete(thinkingMessageId);
       } else {
        // Use simple mode (original OpenAI)
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
          .order("asc")
          .collect();
        
        const formattedMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));
        
        await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
          messages: formattedMessages,
          chatId: args.chatId,
          userId: user._id,
        });
      }
      
      return messageId;
    } catch (error) {
      console.error("Error sending enhanced message:", error);
      
      // Save error message
      await ctx.db.insert("messages", {
        chatId: args.chatId,
        userId: user._id,
        content: `❌ **Error**: ${error}`,
        role: "assistant",
        createdAt: Date.now(),
        isError: true,
      });
      
      return messageId;
    }
  },
}); 