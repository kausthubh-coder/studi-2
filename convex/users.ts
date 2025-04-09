import { v } from "convex/values";
import { action, mutation, query, internalQuery } from "./_generated/server";
import { ConvexError } from "convex/values";
/**
 * Helper function to extract the clean Clerk ID
 */
function getCleanClerkId(subject: string): string {
  return subject.includes("|") ? subject.split("|")[1] : subject;
}

// Get the current user
export const getMe = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkId = getCleanClerkId(identity.subject);
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
    
    return user;
  },
});

// Create or update a user
export const createOrUpdateUser = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    // Extract the clean Clerk ID
    const clerkId = getCleanClerkId(identity.subject);
    console.log("Using clean Clerk ID:", clerkId);

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        ...(args.email && { email: args.email }),
        ...(args.imageUrl && { imageUrl: args.imageUrl }),
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId,
      name: args.name,
      email: args.email || "",
      ...(args.imageUrl && { imageUrl: args.imageUrl }),
      plan: "free",
      credits: 10,
      usageTokens: 0,
      onboardingCompleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update user onboarding status
export const updateOnboardingStatus = mutation({
  args: {
    onboardingCompleted: v.boolean(),
    institution: v.optional(v.string()),
    institutionType: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    canvasEnabled: v.optional(v.boolean()),
    canvasUrl: v.optional(v.string()),
    canvasAccessToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const clerkId = getCleanClerkId(identity.subject);
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: args.onboardingCompleted,
      ...(args.institution && { institution: args.institution }),
      ...(args.institutionType && { institutionType: args.institutionType }),
      ...(args.referralSource && { referralSource: args.referralSource }),
      ...(args.canvasEnabled !== undefined && { canvasEnabled: args.canvasEnabled }),
      ...(args.canvasUrl && { canvasUrl: args.canvasUrl }),
      ...(args.canvasAccessToken && { canvasAccessToken: args.canvasAccessToken }),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get a user by their Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get a user by their ID - internal function
export const getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Alias for getMe to maintain backward compatibility
export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkId = getCleanClerkId(identity.subject);
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
    
    return user;
  },
}); 

export const updateCanvasSettings = mutation({
  args: {
    canvasAccessToken: v.optional(v.string()),
    canvasEnabled: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user's ID
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's canvas settings
    return await ctx.db.patch(user._id, {
      canvasAccessToken: args.canvasAccessToken,
      canvasEnabled: args.canvasEnabled,
      updatedAt: Date.now()
    });
  }
});