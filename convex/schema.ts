import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store user data and subscription information
  users: defineTable({
    // Canvas integration
    canvasAccessToken: v.optional(v.string()),
    canvasEnabled: v.optional(v.boolean()),
    canvasUniversityUrl: v.optional(v.string()),
    canvasUrl: v.optional(v.string()),
    
    // Auth data
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    
    // Subscription data
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    
    // Plan details
    plan: v.optional(v.string()), // "free", "basic", "premium"
    
    // Usage tracking
    credits: v.optional(v.number()),
    usageTokens: v.optional(v.number()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_clerkId", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_subscription", ["stripeSubscriptionId"]),

  // Chats table
  chats: defineTable({
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_userId", ["userId"]),

  

  // Messages table
  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    createdAt: v.float64(),
    role: v.string(),
    tokens: v.optional(v.float64()),
    isError: v.optional(v.boolean()),  // Add this field
    isLoading: v.optional(v.boolean()),
    userId: v.optional(v.id("users")),
  })
  .index("by_chatId", ["chatId"]),
}); 