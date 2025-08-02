import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Type definitions for better type safety
type User = {
  _id: Id<"users">;
  canvasAccessToken?: string;
  canvasUrl?: string;
  [key: string]: any;
};

type CanvasResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/*
 * Canvas LMS Integration Tools for Convex Agent
 * These tools provide Canvas LMS integration capabilities for the AI agent.
 */

// Get Canvas courses for the user
export const getCourses = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found. Please connect your Canvas account in settings." };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses?enrollment_state=active`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status} ${response.statusText}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching Canvas courses:", error);
      return { success: false, error: `Failed to fetch courses: ${error}` };
    }
  },
});

// Get assignments for a specific course
export const getAssignments = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/assignments`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch assignments: ${error}` };
    }
  },
});

// Get upcoming events and assignments
export const getUpcomingEvents = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/users/self/upcoming_events`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch upcoming events: ${error}` };
    }
  },
});

// Get course grades
export const getCourseGrades = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/enrollments?user_id=self&include[]=grades`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch course grades: ${error}` };
    }
  },
});

// Get user's overall enrollment grades
export const getEnrollmentGrades = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/users/self/enrollments?include[]=grades`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch enrollment grades: ${error}` };
    }
  },
});

// Get announcements for a course
export const getAnnouncements = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/discussion_topics?only_announcements=true`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch announcements: ${error}` };
    }
  },
});

// Get modules for a course
export const getModules = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/modules`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch modules: ${error}` };
    }
  },
});

// Get discussions for a course
export const getDiscussions = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/discussion_topics`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch discussions: ${error}` };
    }
  },
});

// Get calendar events
export const getCalendarEvents = internalAction({
  args: {
    userId: v.id("users"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      let url = `${baseUrl}api/v1/calendar_events`;
      
      const params = new URLSearchParams();
      if (args.startDate) params.append('start_date', args.startDate);
      if (args.endDate) params.append('end_date', args.endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch calendar events: ${error}` };
    }
  },
});

// Get user profile
export const getUserProfile = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user || !user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/users/self/profile`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return { success: false, error: `Canvas API error: ${response.status}` };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `Failed to fetch user profile: ${error}` };
    }
  },
});