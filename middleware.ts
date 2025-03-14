import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Create a route matcher for public routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhook', 
  '/pricing', 
  '/login', 
  '/sign-up',
  /^\/api(?:\/|$)/
]);

export default clerkMiddleware({
  // Return true for routes that don't require authentication
  publicRoutes: (req) => isPublicRoute(req)
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 