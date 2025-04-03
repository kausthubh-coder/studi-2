"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { logger } from "../../../utils/logger";

export const AuthCheck = () => {
  const { isSignedIn, user } = useUser();
  const convex = useConvex();
  const convexUser = useQuery(api.users.getUser);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // When a user signs in with Clerk, create or update the user in Convex
  useEffect(() => {
    // Skip this effect during SSR or before client hydration
    if (!isClient) return;

    if (isSignedIn && user && !convexUser) {
      // Create or update the user in Convex
      const createUser = async () => {
        logger.info("Creating/updating user in Convex", { userId: user.id }, "auth");
        try {
          await convex.mutation(api.users.createOrUpdateUser, {
            email: user.emailAddresses[0]?.emailAddress || "",
            name: user.fullName || "",
            imageUrl: user.imageUrl || "",
          });
          logger.info("User created/updated successfully", null, "auth");
        } catch (error) {
          logger.error("Failed to create/update user", { error }, "auth");
        }
      };
      createUser();
    }
  }, [isSignedIn, user, convexUser, convex, isClient]);

  return null; // This component doesn't render anything
}; 