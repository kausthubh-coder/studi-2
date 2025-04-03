"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const pathname = usePathname();
  const router = useRouter();
  const user = useQuery(api.users.getUser);
  
  useEffect(() => {
    if (!isLoading) {
      // If the user is authenticated and on the login or signup page, redirect
      if (isAuthenticated && (pathname === '/sign-in' || pathname === '/sign-up')) {
        // Check if user has completed onboarding
        if (user && !user.onboardingCompleted) {
          router.push('/onboarding');
        } else {
          router.push('/home');
        }
      }
      
      // If authenticated user hasn't completed onboarding and is not on onboarding page
      if (isAuthenticated && user && !user.onboardingCompleted && pathname !== '/onboarding') {
        router.push('/onboarding');
      }
      
      // If the user is not authenticated and trying to access protected routes
      if (!isAuthenticated && 
          pathname !== '/' && 
          pathname !== '/sign-in' && 
          pathname !== '/sign-up' && 
          !pathname.includes('/api/')) {
        router.push('/sign-in');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);
} 