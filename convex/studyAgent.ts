import { v } from "convex/values";
import { action, query, internalAction, mutation, ActionCtx, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { Agent, createTool, listMessages, extractText, vStreamArgs, syncStreams } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";
import { z } from "zod";

// Helper function to extract clean Clerk ID
function getCleanClerkId(subject: string): string {
  return subject.includes("|") ? subject.split("|")[1] : subject;
}

// Get authenticated user helper
async function getAuthenticatedUser(ctx: ActionCtx | QueryCtx): Promise<{
  _id: Id<"users">;
  clerkId: string;
  email: string;
  name?: string;
  canvasUrl?: string;
  canvasAccessToken?: string;
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const clerkId = getCleanClerkId(identity.subject);
  const user = await ctx.runQuery(internal.users.getUserByClerkId, { clerkId });
  
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Studi AI Agent - Canvas LMS Integration Assistant
 * 
 * This agent helps students manage their academic workload by integrating with Canvas LMS
 * and providing AI-powered assistance for courses, assignments, grades, and schedule management.
 */

// Canvas Tools for the Agent
const getCourses = createTool({
  description: "Get the user's active courses from Canvas LMS. Use this to understand what courses the student is enrolled in and get course IDs for further analysis.",
  args: z.object({}).describe("No arguments required"),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getCourses, { userId: ctx.userId as Id<"users"> });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get courses: ${error}` };
    }
  },
});

const getAssignments = createTool({
  description: "Get assignments for a specific course from Canvas LMS. Use this to analyze workload, due dates, and assignment details for planning and prioritization.",
  args: z.object({
    courseId: z.string().describe("Canvas course ID"),
  }),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getAssignments, { 
        userId: ctx.userId as Id<"users">, 
        courseId: args.courseId 
      });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get assignments: ${error}` };
    }
  },
});

const getUpcomingEvents = createTool({
  description: "Get upcoming events/assignments with due dates from Canvas LMS. Use this to help with schedule planning and identifying urgent tasks.",
  args: z.object({}).describe("No arguments required"),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getUpcomingEvents, { userId: ctx.userId as Id<"users"> });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get upcoming events: ${error}` };
    }
  },
});

const getCourseGrades = createTool({
  description: "Get grades for assignments in a specific course from Canvas LMS. Use this to analyze academic performance and identify areas needing improvement.",
  args: z.object({
    courseId: z.string().describe("Canvas course ID"),
  }),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getCourseGrades, { 
        userId: ctx.userId as Id<"users">, 
        courseId: args.courseId 
      });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get course grades: ${error}` };
    }
  },
});

const getEnrollmentGrades = createTool({
  description: "Get overall grades for all enrolled courses from Canvas LMS. Use this for comprehensive academic performance analysis.",
  args: z.object({}).describe("No arguments required"),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getEnrollmentGrades, { userId: ctx.userId as Id<"users"> });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get enrollment grades: ${error}` };
    }
  },
});

const getAnnouncements = createTool({
  description: "Get announcements for a specific course from Canvas LMS. Use this to stay informed about course updates and important information.",
  args: z.object({
    courseId: z.string().describe("Canvas course ID"),
  }),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getAnnouncements, { 
        userId: ctx.userId as Id<"users">, 
        courseId: args.courseId 
      });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get announcements: ${error}` };
    }
  },
});

const getModules = createTool({
  description: "Get modules for a specific course from Canvas LMS. Use this to understand course structure and learning progression.",
  args: z.object({
    courseId: z.string().describe("Canvas course ID"),
  }),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getModules, { 
        userId: ctx.userId as Id<"users">, 
        courseId: args.courseId 
      });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get modules: ${error}` };
    }
  },
});

const getDiscussions = createTool({
  description: "Get discussion topics for a specific course from Canvas LMS. Use this to understand class participation and discussion topics.",
  args: z.object({
    courseId: z.string().describe("Canvas course ID"),
  }),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getDiscussions, { 
        userId: ctx.userId as Id<"users">, 
        courseId: args.courseId 
      });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get discussions: ${error}` };
    }
  },
});

const getCalendarEvents = createTool({
  description: "Get calendar events from Canvas LMS. Use this for comprehensive schedule management and planning.",
  args: z
    .object({
      startDate: z.string().optional().describe("ISO date string inclusive start"),
      endDate: z.string().optional().describe("ISO date string inclusive end"),
    })
    .describe("Optional date range"),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getCalendarEvents, { 
        userId: ctx.userId as Id<"users">, 
        startDate: args.startDate,
        endDate: args.endDate 
      });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get calendar events: ${error}` };
    }
  },
});

const getUserProfile = createTool({
  description: "Get the user's profile information from Canvas LMS. Use this to understand user context and personalize responses.",
  args: z.object({}).describe("No arguments required"),
  handler: async (ctx, args): Promise<unknown> => {
    try {
      if (!ctx.userId) {
        throw new Error("User ID not available in context");
      }
      const result = await ctx.runAction(internal.canvasTools.getUserProfile, { userId: ctx.userId as Id<"users"> });
      return result;
    } catch (error) {
      return { success: false, error: `Failed to get user profile: ${error}` };
    }
  },
});

// Create the main Studi agent
export const studyAgent = new Agent(components.agent as any, {
  name: "Studi",
  chat: openai.chat(process.env.OPENAI_MODEL ?? "gpt-5-thinking"),
  textEmbedding: openai.embedding("text-embedding-3-small"),
  instructions: `You are Studi, a sophisticated AI assistant specializing in educational support and Canvas LMS integration. Your primary purpose is to help students manage their academic workload, understand course materials, and excel in their studies.

## Core Capabilities:
- **Course Management**: Help students understand their courses, Help with assignments
- **Academic Planning**: Assist with study schedules, priority setting, and workload balance
- **Performance Analysis**: Analyze course material and Help for academic improvement  
- **Canvas Integration**: Access and interpret Canvas LMS data to provide contextual assistance
- **Educational Support**: Explain concepts, help with study strategies, and provide academic guidance

## Response Style:
- Format responses in clean, readable markdown with proper headings and structure
- Be informative yet conversational and supportive
- Organize complex information with clear bullet points and sections
- Always prioritize student success and well-being

## Canvas Integration Guidelines:
- Always check if Canvas integration is available before making Canvas-related suggestions
- When Canvas data is available, use it to provide specific, actionable insights
- If Canvas credentials are missing, guide users to connect their Canvas account
- Structure Canvas information in a readable, organized format
- Focus on practical applications of the data for student success

## Academic Support Guidelines:
- Encourage good study habits and time management
- Provide constructive feedback on academic performance
- Suggest specific action items and next steps
- Help students prioritize tasks based on urgency and importance
- Support student mental health and stress management

Remember: You are here to empower students to succeed academically while maintaining a healthy balance in their educational journey.`,

  tools: {
    getCourses,
    getAssignments,
    getUpcomingEvents,
    getCourseGrades,
    getEnrollmentGrades,
    getAnnouncements,
    getModules,
    getDiscussions,
    getCalendarEvents,
    getUserProfile,
  },
  maxSteps: 5,
});

// Mutation to save a user message and schedule AI response generation (async pattern)
export const sendMessage = mutation({
  args: {
    threadId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Authorize access to the thread
    const threadMeta = await ctx.runQuery(
      (components.agent as any).getThread,
      { threadId: args.threadId }
    );
    if (!threadMeta || threadMeta.userId !== (user._id as unknown as string)) {
      throw new Error("Unauthorized");
    }

    // Save the user message to the thread using agent's saveMessages method
    const { lastMessageId: messageId } = await studyAgent.saveMessages(ctx, {
      threadId: args.threadId,
      userId: user._id,
      messages: [{ role: "user", content: args.message }],
      // Saving in a mutation: let embeddings be generated lazily later
      skipEmbeddings: true,
    });

    // Schedule the AI response generation asynchronously
    await ctx.scheduler.runAfter(0, internal.studyAgent.generateResponseAsync, {
      threadId: args.threadId,
      promptMessageId: messageId,
      userId: user._id,
    });

    return { threadId: args.threadId, messageId };
  },
});

// Internal action to generate AI response asynchronously with streaming
export const generateResponseAsync = internalAction({
  args: {
    threadId: v.string(),
    promptMessageId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      // Continue the thread and generate streaming response with tools
      const { thread } = await studyAgent.continueThread(ctx, {
        threadId: args.threadId,
        userId: args.userId,
      });

      // Generate streaming response using the saved message as prompt
      const result = await thread.streamText(
        { promptMessageId: args.promptMessageId },
        { saveStreamDeltas: true }
      );

      // Consume the stream to completion
      await result.consumeStream();
    } catch (error) {
      console.error("Failed to generate AI response:", error);
      throw error;
    }
  },
});

// Query to get thread messages using proper Agent component API  
export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: v.optional(vStreamArgs),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    // Return mapped MessageDocs to simple shape + optional streams
    const paginated = await listMessages(ctx, components.agent as any, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
      excludeToolMessages: true,
    });

    const page = paginated.page.map((doc) => {
      const id = (doc as any)._id;
      const created = (doc as any)._creationTime;
      const role = (doc as any).message?.role ?? "assistant";
      const text = extractText((doc as any).message) ?? "";
      return {
        _id: id,
        key: id,
        _creationTime: created,
        role,
        content: text,
        text,
      } as any;
    });

    if (args.streamArgs) {
      const streams = await syncStreams(ctx, components.agent as any, {
        threadId: args.threadId,
        streamArgs: args.streamArgs,
      });
      return {
        page,
        isDone: paginated.isDone,
        continueCursor: paginated.continueCursor,
        streams,
      } as any;
    }

    return {
      page,
      isDone: paginated.isDone,
      continueCursor: paginated.continueCursor,
    } as any;
  },
});

// Action to create a new thread
export const createThread = action({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ id: string; threadId: string }> => {
    const user = await getAuthenticatedUser(ctx);

    // Create a new thread using the agent
    const { threadId } = await studyAgent.createThread(ctx, {
      userId: user._id,
      title: args.title || "New Chat",
    });

    return { id: threadId, threadId };
  },
});

// Query to get user's threads using proper Agent component API
export const listUserThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Use the Agent component API to get user threads
    const result = await ctx.runQuery(
      (components.agent as any).threads.listThreadsByUserId,
      {
        userId: user._id,
        paginationOpts: args.paginationOpts,
      }
    );

    return {
      page: (result as any).threads,
      isDone: (result as any).isDone,
      continueCursor: (result as any).continueCursor,
    } as any;
  },
});