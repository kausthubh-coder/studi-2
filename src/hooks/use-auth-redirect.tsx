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

    const handleNavigation = async () => {
      try {
        // Handle authenticated users
        if (isAuthenticated) {
          // Redirect from auth pages
          if (pathname === '/sign-in' || pathname === '/sign-up') {
            if (user && !user.onboardingCompleted) {
              await router.push('/onboarding');
            } else {
              await router.push('/dashboard');
            }
            return;
          }
          
          // Force onboarding completion
          if (user && !user.onboardingCompleted && pathname !== '/onboarding') {
            await router.push('/onboarding');
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
            await router.push('/sign-in');
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


