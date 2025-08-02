import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store user data and subscription information
  users: defineTable({
    // Canvas integration
    canvasAccessToken: v.optional(v.string()),
    canvasEnabled: v.optional(v.boolean()),
    canvasUrl: v.optional(v.string()),
    
    // Auth data
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    
    // Onboarding data
    onboardingCompleted: v.optional(v.boolean()),
    institution: v.optional(v.string()),
    institutionType: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    
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
}); 