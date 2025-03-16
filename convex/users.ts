import { ConvexError, v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get the current authenticated user
export const getUser = query({
  args: {},
  handler: async (ctx) => {
    // Get the user's identity from Clerk
    const identity = await ctx.auth.getUserIdentity();
    
    // If not authenticated, return null
    if (!identity) {
      return null;
    }

    // Find the user in our database using their Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    return user;
  },
});

// Create a new user or update an existing one
export const createOrUpdateUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the user's identity from Clerk
    const identity = await ctx.auth.getUserIdentity();
    
    // If not authenticated, throw an error
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // Check if the user already exists in our database
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    // If the user exists, return their ID
    if (existingUser) {
      // Optionally update user information if needed
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // If the user doesn't exist, create a new one
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: args.name || "Anonymous",
      email: args.email,
      imageUrl: args.imageUrl,
      plan: "free", // Default to free plan
      credits: 10, // Start with some free credits
      usageTokens: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Update Canvas settings for a user
export const updateCanvasSettings = mutation({
  args: {
    canvasEnabled: v.boolean(),
    canvasUrl: v.optional(v.string()),
    canvasAccessToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the user's identity from Clerk
    const identity = await ctx.auth.getUserIdentity();
    
    // If not authenticated, throw an error
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    // Find the user in our database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!user) {
      throw new ConvexError("User not found");
    }

    // Prepare update object
    const updateData: any = {
      canvasEnabled: args.canvasEnabled,
      updatedAt: Date.now(),
    };

    // Only include URL and token if enabled or if they're provided
    if (args.canvasEnabled) {
      if (!args.canvasUrl || !args.canvasAccessToken) {
        throw new ConvexError("Canvas URL and access token are required when Canvas is enabled");
      }
      updateData.canvasUrl = args.canvasUrl;
      updateData.canvasAccessToken = args.canvasAccessToken;
    }

    // Update the Canvas settings
    await ctx.db.patch(user._id, updateData);

    return user._id;
  },
});

// Get a user by ID (internal function)
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get a user by their Clerk ID (internal function)
export const getUserByClerkId = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
}); 