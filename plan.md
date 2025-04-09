# Authentication Implementation Plan

## Overview
This plan addresses the authentication issue causing the "Unauthorized: Please sign in to view your chats" error on page reloads. The solution integrates Next.js, Convex, and Clerk to create a robust authentication system with three key components:

1. **Clerk Session Management**: Leveraging Clerk's built-in session handling for secure user authentication
2. **Next.js Middleware**: Implementing server-side protection for routes
3. **Convex Function Authorization**: Securing database queries and mutations

## Current Issues

The current implementation faces the following issues:
- Authentication state not persisting properly on page reloads
- Race conditions between client-side authentication checks and Convex queries
- Missing proper authorization in Convex functions
- Client-side only authentication that doesn't protect routes at the server level

## Detailed Approach

### 1. Clerk Session Management
Clerk provides robust session management with JWT tokens that can be passed to Convex for authenticated requests. This approach:

- Uses secure, HttpOnly cookies for session storage
- Provides automatic token refresh
- Maintains authentication state across page reloads
- Creates a seamless auth experience

### 2. Next.js Middleware
Adding server-side middleware will:

- Protect routes before they even begin rendering
- Redirect unauthenticated users to the login page
- Verify authentication tokens at the edge
- Improve security by preventing unauthorized access attempts

### 3. Convex Function Authorization
Securing Convex functions will:

- Validate authentication tokens before executing database operations
- Provide granular access control at the function level
- Return appropriate error messages for unauthorized requests
- Prevent unauthorized data access

## Implementation Plan

### Step 1: Update Convex Authorization

1. Create or update the authentication configuration in `convex/auth.config.js`:
```javascript
export default {
  providers: [
    {
      domain: "https://clerk.your-app.com",
      applicationID: "convex",
    },
  ],
};
```

2. Implement authorization in Convex queries/mutations:
```typescript
// Example for the chats:getChats query
export const getChats = query({
  args: {},
  handler: async (ctx) => {
    // Get the user's identity from the request
    const identity = await ctx.auth.getUserIdentity();
    
    // If no identity exists, the user isn't authenticated
    if (!identity) {
      throw new Error("Unauthorized: Please sign in to view your chats");
    }
    
    // Use the identity to get user-specific data
    const userId = identity.subject;
    
    // Now query for user's chats using their ID
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});
```

### Step 2: Implement Next.js Middleware

1. Create or update `middleware.ts` in the root directory:
```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook/clerk",
    "/api/(.*)"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Step 3: Update AuthCheck Component

1. Update `src/app/components/auth/auth-check.tsx` to handle authentication state and sync with Convex:
```typescript
"use client";

import { useUser } from "@clerk/nextjs";
import { useConvex, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";

export const AuthCheck = () => {
  const { isSignedIn, user, isLoaded } = useUser();
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
    if (!isClient || !isLoaded) return;

    if (isSignedIn && user && !convexUser) {
      // Create or update the user in Convex
      const createUser = async () => {
        try {
          await convex.mutation(api.users.createOrUpdateUser, {
            email: user.emailAddresses[0]?.emailAddress || "",
            name: user.fullName || "",
            imageUrl: user.imageUrl || "",
          });
        } catch (error) {
          console.error("Failed to create/update user", error);
        }
      };
      createUser();
    }
  }, [isSignedIn, user, convexUser, convex, isClient, isLoaded]);

  return null; // This component doesn't render anything
};

export default AuthCheck;
```

### Step 4: Update AuthCheckWrapper Component

1. Update `src/app/components/auth/auth-check-wrapper.tsx` to ensure it only runs on the client:
```typescript
'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react';

// Import the AuthCheck component with dynamic to disable SSR
const AuthCheck = dynamic(
  () => import('./auth-check').then((mod) => mod.default || mod.AuthCheck),
  { ssr: false }
);

export default function AuthCheckWrapper() {
  return (
    <Suspense fallback={null}>
      <AuthCheck />
    </Suspense>
  );
}
```

### Step 5: Update useAuthRedirect Hook

1. Update `src/hooks/use-auth-redirect.tsx` to better handle authentication state and transitions:
```typescript
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@clerk/nextjs';

export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const user = useQuery(api.users.getUser);
  
  useEffect(() => {
    // Wait for both Clerk and Convex to finish loading
    if (isLoading || !isClerkLoaded) return;
    
    // Verify authentication states are synchronized
    if (isSignedIn !== isAuthenticated) {
      console.warn("Authentication state mismatch between Clerk and Convex");
      return;
    }

    // Handle authenticated users
    if (isAuthenticated) {
      // Redirect from auth pages
      if (pathname === '/sign-in' || pathname === '/sign-up') {
        if (user && !user.onboardingCompleted) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
        return;
      }
      
      // Force onboarding completion
      if (user && !user.onboardingCompleted && pathname !== '/onboarding') {
        router.push('/onboarding');
        return;
      }
    } 
    // Handle unauthenticated users
    else {
      // Redirect from protected routes to sign-in
      if (pathname !== '/' && 
          pathname !== '/sign-in' && 
          pathname !== '/sign-up' && 
          !pathname.includes('/api/')) {
        router.push('/sign-in');
        return;
      }
    }
  }, [isAuthenticated, isSignedIn, isLoading, isClerkLoaded, pathname, router, user]);
}
```

### Step 6: Add ConvexClientProvider

1. Create or update `src/app/providers.tsx`:
```typescript
"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

2. Update `src/app/layout.tsx` to include the Providers component:
```typescript
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Add AuthCheckWrapper here if needed */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Step 7: Update Server-Side Components

1. For server components that need to access Convex data, add the following utility in `src/lib/auth.ts`:
```typescript
import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}
```

2. Use this utility with Convex's `preloadQuery` or `fetchQuery` in server components:
```typescript
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/auth";

export async function ServerComponent() {
  const token = await getAuthToken();
  const preloadedData = await preloadQuery(
    api.someFunction.getData,
    {},
    { token }
  );
  
  return <ClientComponent preloadedData={preloadedData} />;
}
```

## Testing the Implementation

1. Test authentication flow:
   - Sign in/sign up process
   - Session persistence across page reloads
   - Redirect behavior for protected routes
   
2. Test Convex queries:
   - Verify that authenticated queries work properly
   - Confirm that unauthorized access attempts are correctly blocked
   - Check that error messages are helpful and descriptive
   
3. Test edge cases:
   - Session expiration and renewal
   - Network interruptions
   - Multiple tabs/browsers

## Deployment Considerations

1. Ensure environment variables are set correctly in production:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   
2. Update Convex deployment with authentication changes:
   ```
   npx convex deploy
   ```

3. Verify that Clerk webhooks are properly configured if using them for user management.

This plan provides a comprehensive approach to fixing the authentication issues while improving the overall security and user experience of your application. 