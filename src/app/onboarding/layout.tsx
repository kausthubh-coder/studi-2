"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

// Create a special layout for the onboarding page
export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const currentUser = useQuery(api.users.getUser);
  
  // Redirect if user has already completed onboarding
  useEffect(() => {
    if (currentUser && currentUser.onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
} 


