// Main API exports for the Convex app
// This file re-exports functions from various modules to make them available to clients

// OpenAI integration - Only export the public functions
export { generateChatCompletion } from "./openai";

// Canvas integration - Create public wrappers for internal functions
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

/**
 * Helper function to extract the clean Clerk ID
 */
function getCleanClerkId(subject: string): string {
  return subject.includes("|") ? subject.split("|")[1] : subject;
}

// Type for Canvas API response
type CanvasResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Public wrapper for getCourses
export const getCourses = action({
  args: {},
  handler: async (ctx): Promise<CanvasResponse<any[]>> => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      // Get the user ID first
      const userId = await getUserId(ctx, identity.subject);
      if (!userId) {
        return { success: false, error: "User not found" };
      }
      
      // Call the internal Canvas function
      const response = await ctx.runAction(internal.canvas.getCourses, { 
        userId: userId
      });
      return response;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return { success: false, error: `Failed to fetch courses: ${error}` };
    }
  },
});

// Public wrapper for getAssignments
export const getAssignments = action({
  args: {
    courseId: v.string()
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      // Get the user ID first
      const userId = await getUserId(ctx, identity.subject);
      if (!userId) {
        return { success: false, error: "User not found" };
      }
      
      // Call the internal Canvas function
      const response = await ctx.runAction(internal.canvas.getAssignments, { 
        userId: userId,
        courseId: args.courseId
      });
      return response;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return { success: false, error: `Failed to fetch assignments: ${error}` };
    }
  },
});

// Public wrapper for getAnnouncements
export const getAnnouncements = action({
  args: {
    courseId: v.string()
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      // Get the user ID first
      const userId = await getUserId(ctx, identity.subject);
      if (!userId) {
        return { success: false, error: "User not found" };
      }
      
      // Call the internal Canvas function
      const response = await ctx.runAction(internal.canvas.getAnnouncements, { 
        userId: userId,
        courseId: args.courseId
      });
      return response;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return { success: false, error: `Failed to fetch announcements: ${error}` };
    }
  },
});

// Public wrapper for getModules
export const getModules = action({
  args: {
    courseId: v.string()
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, error: "Not authenticated" };
    }
    
    try {
      // Get the user ID first
      const userId = await getUserId(ctx, identity.subject);
      if (!userId) {
        return { success: false, error: "User not found" };
      }
      
      // Call the internal Canvas function
      const response = await ctx.runAction(internal.canvas.getModules, { 
        userId: userId,
        courseId: args.courseId
      });
      return response;
    } catch (error) {
      console.error("Error fetching modules:", error);
      return { success: false, error: `Failed to fetch modules: ${error}` };
    }
  },
});

// Helper function to get user ID from Clerk subject ID
async function getUserId(ctx: any, clerkSubject: string): Promise<Id<"users"> | null> {
  // Extract clean Clerk ID
  const clerkId = getCleanClerkId(clerkSubject);
  console.log("Looking up user with clean Clerk ID:", clerkId);
  
  // Use the exported getUserByClerkId query
  const user = await ctx.runQuery("users:getUserByClerkId", { 
    clerkId: clerkId 
  });
  
  if (!user) {
    return null;
  }
  
  return user._id;
}

// User management
export { getMe, getUser, createOrUpdateUser, updateOnboardingStatus } from "./users";

// Message handling
export { getMessages, sendMessage, sendEnhancedMessage } from "./messages";

// Chat handling
export { createChat, getChats, getChat, deleteChat, updateChat, getChatMessages } from "./chats";

// ReAct agent
export { runReActAgent } from "./react-agent"; 