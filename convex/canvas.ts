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

// Fetch Canvas courses for the user
export const getCourses = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      // Get user information
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      // Construct API URL
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses?enrollment_state=active`;
      
      // Make API request to Canvas
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const courses = await response.json();
      return { success: true, data: courses };
    } catch (error) {
      console.error("Error fetching Canvas courses:", error);
      return { success: false, error: `Failed to fetch courses: ${error}` };
    }
  },
});

// Fetch assignments for a specific course
export const getAssignments = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      // Get user information
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      // Construct API URL
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/assignments`;
      
      // Make API request to Canvas
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const assignments = await response.json();
      return { success: true, data: assignments };
    } catch (error) {
      console.error("Error fetching Canvas assignments:", error);
      return { success: false, error: `Failed to fetch assignments: ${error}` };
    }
  },
});

// Fetch announcements for a specific course
export const getAnnouncements = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      // Get user information
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      // Construct API URL
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/discussion_topics?only_announcements=true`;
      
      // Make API request to Canvas
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const announcements = await response.json();
      return { success: true, data: announcements };
    } catch (error) {
      console.error("Error fetching Canvas announcements:", error);
      return { success: false, error: `Failed to fetch announcements: ${error}` };
    }
  },
});

// Fetch modules for a specific course
export const getModules = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      // Get user information
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      // Construct API URL
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/modules`;
      
      // Make API request to Canvas
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const modules = await response.json();
      return { success: true, data: modules };
    } catch (error) {
      console.error("Error fetching Canvas modules:", error);
      return { success: false, error: `Failed to fetch modules: ${error}` };
    }
  },
}); 