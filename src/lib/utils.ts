import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";

/**
 * Gets the current user from Convex
 * This is a helper function that can be used in client components
 */
export async function getUserOnClientSide() {
  // This needs to be called within a component that has access to the Convex provider
  // For server components, use the Convex client directly
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await convex.query(api.users.getUser);
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Checks if the user has completed onboarding
 * Returns true if onboarding is complete, false otherwise
 */
export function useHasCompletedOnboarding() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getUser);
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return user.onboardingCompleted === true;
} 