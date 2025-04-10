import { ClerkMiddlewareAuth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhook',
  '/pricing',
  '/sign-up(.*)',
  '/sign-in(.*)',
  '/waitlist(.*)',
  '/api/:path*'
]);

// Define type for user metadata
type UserMetadata = {
  isBetaUser?: boolean
}

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes
  if (isPublicRoute(req)) {
    return;
  }

  // Protect all other routes
  const authObject = await auth.protect();
  
  // Check if user is in beta access group
  const { isBetaUser } = authObject.sessionClaims?.metadata as UserMetadata || {};
  
  // If user is authenticated but not a beta user, redirect to waitlist
  if (!isBetaUser) {
    return NextResponse.redirect(new URL('/waitlist', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 