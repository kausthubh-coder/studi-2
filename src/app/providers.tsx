"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { clerkTheme } from "./theme";

// Initialize the Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      waitlistUrl="/waitlist"
      appearance={{
        baseTheme: clerkTheme.baseTheme,
        variables: clerkTheme.variables,
        elements: clerkTheme.elements,
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
} 


