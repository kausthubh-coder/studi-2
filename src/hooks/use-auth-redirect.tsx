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
      console.error("Authentication state mismatch between Clerk and Convex");
      return;
    }

    const handleNavigation = async () => {
      try {
        // Handle authenticated users
        if (isAuthenticated) {
          // Check if user exists in Convex
          if (!user) return;

          // Handle auth pages redirects
          if (pathname === '/sign-in' || pathname === '/sign-up') {
            router.push(user.onboardingCompleted ? '/dashboard' : '/onboarding');
            return;
          }
          
          // Force onboarding completion
          if (!user.onboardingCompleted && pathname !== '/onboarding') {
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
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    handleNavigation();
  }, [isAuthenticated, isSignedIn, isLoading, isClerkLoaded, pathname, router, user]);
} 


