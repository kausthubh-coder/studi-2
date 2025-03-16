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

// Fetch files for a specific course
export const getFiles = internalAction({
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
      const url = `${baseUrl}api/v1/courses/${args.courseId}/files`;
      
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
      
      const files = await response.json();
      return { success: true, data: files };
    } catch (error) {
      console.error("Error fetching Canvas files:", error);
      return { success: false, error: `Failed to fetch files: ${error}` };
    }
  },
});

// Download a specific file
export const getFileDownloadUrl = internalAction({
  args: {
    userId: v.id("users"),
    fileId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<string>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/files/${args.fileId}`;
      
      // First get the file info
      const infoResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!infoResponse.ok) {
        const errorText = await infoResponse.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const fileInfo = await infoResponse.json();
      
      // Get the download URL
      const downloadUrl = fileInfo.url;
      return { success: true, data: downloadUrl };
    } catch (error) {
      console.error("Error getting Canvas file download URL:", error);
      return { success: false, error: `Failed to get file download URL: ${error}` };
    }
  },
});

// Get grades for a user in a course
export const getCourseGrades = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/assignments?include[]=submission`;
      
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
      
      const grades = await response.json();
      return { success: true, data: grades };
    } catch (error) {
      console.error("Error fetching Canvas grades:", error);
      return { success: false, error: `Failed to fetch grades: ${error}` };
    }
  },
});

// Get the user's enrollment grades (overall course grades)
export const getEnrollmentGrades = internalAction({
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
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const enrollments = await response.json();
      return { success: true, data: enrollments };
    } catch (error) {
      console.error("Error fetching Canvas enrollment grades:", error);
      return { success: false, error: `Failed to fetch enrollment grades: ${error}` };
    }
  },
});

// Get all discussions for a course
export const getDiscussions = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
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
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const discussions = await response.json();
      return { success: true, data: discussions };
    } catch (error) {
      console.error("Error fetching Canvas discussions:", error);
      return { success: false, error: `Failed to fetch discussions: ${error}` };
    }
  },
});

// Get a specific discussion with entries/replies
export const getDiscussionDetails = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
    discussionId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/discussion_topics/${args.discussionId}`;
      
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
      
      const discussionDetails = await response.json();
      return { success: true, data: discussionDetails };
    } catch (error) {
      console.error("Error fetching Canvas discussion details:", error);
      return { success: false, error: `Failed to fetch discussion details: ${error}` };
    }
  },
});

// Get user profile information
export const getUserProfile = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
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
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const profile = await response.json();
      return { success: true, data: profile };
    } catch (error) {
      console.error("Error fetching Canvas user profile:", error);
      return { success: false, error: `Failed to fetch user profile: ${error}` };
    }
  },
});

// Get user enrollments (courses they're enrolled in with roles)
export const getUserEnrollments = internalAction({
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
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/users/self/enrollments`;
      
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
      
      const enrollments = await response.json();
      return { success: true, data: enrollments };
    } catch (error) {
      console.error("Error fetching Canvas user enrollments:", error);
      return { success: false, error: `Failed to fetch user enrollments: ${error}` };
    }
  },
});

// Get calendar events
export const getCalendarEvents = internalAction({
  args: {
    userId: v.id("users"),
    startDate: v.optional(v.string()), // Format: YYYY-MM-DD
    endDate: v.optional(v.string()),   // Format: YYYY-MM-DD
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      let url = `${baseUrl}api/v1/calendar_events`;
      
      // Add date parameters if provided
      const params = new URLSearchParams();
      if (args.startDate) params.append('start_date', args.startDate);
      if (args.endDate) params.append('end_date', args.endDate);
      if (params.toString()) url += `?${params.toString()}`;
      
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
      
      const events = await response.json();
      return { success: true, data: events };
    } catch (error) {
      console.error("Error fetching Canvas calendar events:", error);
      return { success: false, error: `Failed to fetch calendar events: ${error}` };
    }
  },
});

// Get upcoming events/assignments with due dates
export const getUpcomingEvents = internalAction({
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
        const errorText = await response.text();
        return { success: false, error: `Canvas API error: ${errorText}` };
      }
      
      const upcomingEvents = await response.json();
      return { success: true, data: upcomingEvents };
    } catch (error) {
      console.error("Error fetching Canvas upcoming events:", error);
      return { success: false, error: `Failed to fetch upcoming events: ${error}` };
    }
  },
});

// Get quizzes for a course
export const getQuizzes = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/quizzes`;
      
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
      
      const quizzes = await response.json();
      return { success: true, data: quizzes };
    } catch (error) {
      console.error("Error fetching Canvas quizzes:", error);
      return { success: false, error: `Failed to fetch quizzes: ${error}` };
    }
  },
});

// Get quiz details including questions
export const getQuizDetails = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
    quizId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/quizzes/${args.quizId}`;
      
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
      
      const quizDetails = await response.json();
      
      // Get quiz questions
      const questionsUrl = `${baseUrl}api/v1/courses/${args.courseId}/quizzes/${args.quizId}/questions`;
      
      const questionsResponse = await fetch(questionsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.canvasAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (questionsResponse.ok) {
        const questions = await questionsResponse.json();
        quizDetails.questions = questions;
      }
      
      return { success: true, data: quizDetails };
    } catch (error) {
      console.error("Error fetching Canvas quiz details:", error);
      return { success: false, error: `Failed to fetch quiz details: ${error}` };
    }
  },
});

// Get module items for a specific module
export const getModuleItems = internalAction({
  args: {
    userId: v.id("users"),
    courseId: v.string(),
    moduleId: v.string(),
  },
  handler: async (ctx, args): Promise<CanvasResponse<any[]>> => {
    try {
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
      
      if (!user.canvasAccessToken || !user.canvasUrl) {
        return { success: false, error: "Canvas credentials not found" };
      }
      
      const baseUrl = user.canvasUrl.endsWith('/') ? user.canvasUrl : `${user.canvasUrl}/`;
      const url = `${baseUrl}api/v1/courses/${args.courseId}/modules/${args.moduleId}/items`;
      
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
      
      const moduleItems = await response.json();
      return { success: true, data: moduleItems };
    } catch (error) {
      console.error("Error fetching Canvas module items:", error);
      return { success: false, error: `Failed to fetch module items: ${error}` };
    }
  },
}); 