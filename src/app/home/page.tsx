"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const currentUser = useQuery(api.users.getUser);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    if (currentUser) {
      if (currentUser.onboardingCompleted === false) {
        router.push("/onboarding");
      } else {
        // Direct to dashboard in the dashboard route group
        router.push("/dashboard");
      }
    }
  }, [currentUser, isSignedIn, isLoaded, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
      </div>
    </div>
  );
} 