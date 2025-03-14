import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
  args: {},
  handler: async (ctx) => {
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
        name: identity.name,
        email: identity.email!,
        imageUrl: identity.pictureUrl,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // If the user doesn't exist, create a new one
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name || "Anonymous",
      email: identity.email!,
      imageUrl: identity.pictureUrl,
      plan: "free", // Default to free plan
      credits: 10, // Start with some free credits
      usageTokens: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
}); 