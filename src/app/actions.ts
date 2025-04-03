'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Updates a user's publicMetadata to mark onboarding as complete
 * This is a server action that can be called from client components
 */
export async function setUserOnboardingComplete() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  try {
    // Update the user's publicMetadata to mark onboarding as complete
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { 
        onboardingComplete: true 
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update user metadata:", error);
    throw new Error("Failed to update user metadata");
  }
} 