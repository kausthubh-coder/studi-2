"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const AuthCheck = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const createOrUpdateUserMutation = useMutation(api.users.createOrUpdateUser);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Private routes that require authentication
  const privateRoutes = [
    '/dashboard',
    '/chat',
    '/settings',
    '/onboarding'
  ];

  // // Public routes that don't require authentication 
  // const publicRoutes = [
  //   '/',
  //   '/sign-in',
  //   '/sign-up'
  // ];

  // Check if current path is a private route
  const isPrivateRoute = () => {
    return privateRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
  };

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication redirects
  useEffect(() => {
    if (!isClient || !isLoaded) return;

    if (!isSignedIn && isPrivateRoute()) {
      // Redirect to sign-in if user tries to access a private route without authentication
      router.push('/sign-in');
    }
  }, [isClient, isLoaded, isSignedIn, pathname, router, isPrivateRoute]);

  // When a user signs in with Clerk, create or update the user in Convex
  useEffect(() => {
    // Skip this effect during SSR or before client hydration
    if (!isClient || !isLoaded) return;

    if (isSignedIn && user) {
      // Create or update the user in Convex
      const syncUser = async () => {
        try {
          await createOrUpdateUserMutation({
            email: user.emailAddresses[0]?.emailAddress || "",
            name: user.fullName || "",
            imageUrl: user.imageUrl || "",
          });
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error("Failed to create/update user", error);
          setError("Failed to sync user data");
        }
      };
      syncUser();
    }
  }, [isSignedIn, user, createOrUpdateUserMutation, isClient, isLoaded]);

  // Error message component (could be shown if needed)
  if (error && isClient) {
    console.error("AuthCheck Error:", error);
    // You could return an error UI component here if needed
  }

  return null; // This component doesn't render anything visible
};

export default AuthCheck; 


