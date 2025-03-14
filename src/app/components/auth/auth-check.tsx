"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect } from "react";
import { useConvex } from "convex/react";

export const AuthCheck = () => {
  const { isSignedIn, user } = useUser();
  const convex = useConvex();
  const convexUser = useQuery(api.users.getUser);

  // When a user signs in with Clerk, create or update the user in Convex
  useEffect(() => {
    if (isSignedIn && user && !convexUser) {
      // Create or update the user in Convex
      const createUser = async () => {
        await convex.mutation(api.users.createOrUpdateUser);
      };
      createUser();
    }
  }, [isSignedIn, user, convexUser, convex]);

  return null; // This component doesn't render anything
}; 