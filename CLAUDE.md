# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Studi is a Canvas LMS AI Assistant built with Next.js 15, Convex for backend/database, and Clerk for authentication. The application helps students manage their academic workload by integrating with Canvas LMS and providing AI-powered assistance through a new **Convex Agent-based chat system**.

## Development Commands

- **Development**: `npm run dev` (uses Next.js with Turbopack)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Linting**: `npm run lint`
- **Convex Development**: `npx convex dev` (for backend development)
- **Convex Deploy**: `npx convex deploy`

## Architecture Overview

### Frontend Structure
- **Next.js 15 App Router** with TypeScript
- **Authentication**: Clerk for user management with custom onboarding flow
- **UI Components**: Custom components with Tailwind CSS and Framer Motion
- **State Management**: Convex React hooks for real-time data

### Backend (Convex)
- **Database**: Convex with users table (simplified schema using Agent component)
- **Authentication**: Clerk integration with Convex auth
- **AI Integration**: **Convex Agent Component** (`@convex-dev/agent`) with OpenAI integration
- **Agent Implementation**: Placeholder agent in `convex/studyAgent.ts` (ready for full Agent component implementation)
- **Canvas Tools**: Canvas LMS integration tools in `convex/canvasTools.ts`

### Key Directories
- `src/app/` - Next.js app router pages and layouts
- `src/app/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `convex/` - Backend functions, schema, and configuration
- `convex/_generated/` - Auto-generated Convex types and API

### Authentication Flow
The app uses a three-tier authentication system:
1. **Clerk** for session management and user authentication
2. **Next.js Middleware** for server-side route protection
3. **Convex Functions** with built-in authorization using `ctx.auth.getUserIdentity()`

### Database Schema (Updated)
- **users**: Stores user data, Canvas integration settings, subscription info, and onboarding status
- **Agent Tables**: Thread/message management handled by Convex Agent component

### Canvas LMS Integration
- Canvas integration functions available as tools for the Agent
- 10+ Canvas API functions (courses, assignments, grades, announcements, etc.)
- Canvas credentials stored securely in user profiles
- Server-side Canvas API calls through Convex internal actions

## Important Implementation Notes

### New Agent-Based Architecture (Current Implementation)
- **Migration Status**: Successfully migrated from custom chat system to Convex Agent foundation
- **Current State**: Placeholder Agent implementation with basic thread/message structure
- **Next Steps**: Full Agent component integration with Canvas tools and advanced AI capabilities

### Agent System Features
- **Thread Management**: Agent-managed conversation threads
- **Canvas Tools**: Pre-built Canvas LMS integration tools ready for Agent use
- **Placeholder Functions**: Basic CRUD operations for threads/messages while Agent component is set up

### Canvas Tools Available
Located in `convex/canvasTools.ts`:
- `getCourses` - Get user's active courses
- `getAssignments` - Get assignments for specific courses
- `getUpcomingEvents` - Get upcoming assignments/events
- `getCourseGrades` - Get grades for course assignments
- `getEnrollmentGrades` - Get overall course grades
- `getAnnouncements` - Get course announcements
- `getModules` - Get course modules/structure
- `getDiscussions` - Get discussion topics
- `getCalendarEvents` - Get calendar events
- `getUserProfile` - Get user profile from Canvas

### Authentication State Management
- Uses `useAuthRedirect` hook for client-side auth flow management
- AuthCheck component syncs Clerk users with Convex database
- All protected Convex functions use `ctx.auth.getUserIdentity()` for authorization

### Styling and UI
- Tailwind CSS with custom design system
- Framer Motion for animations
- Responsive design with mobile-first approach
- Custom fonts: Poppins (sans) and Playfair Display (serif)

## Environment Variables Required
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY` (in Convex environment)

## Recent Changes (Agent Migration)
- **Removed**: Custom chat/message/agent implementation files
- **Added**: Convex Agent component foundation with Canvas tools
- **Updated**: Frontend to use thread-based messaging instead of chat-based
- **Simplified**: Database schema to leverage Agent component's built-in capabilities
- **Maintained**: All Canvas LMS integration functionality through Agent tools

## Next Development Steps
1. Complete Agent component integration with full OpenAI + Canvas tools
2. Implement proper thread management using Agent APIs
3. Add Canvas tool calling capabilities to the Agent
4. Enhance Agent instructions and context management
5. Implement advanced Agent workflows for academic assistance

## Development Ignore Patterns
- dont look at convex generated code _generated in /convex

## Workflow Guidance
- When you need docs or context use contect7 or localdocs like @convex_agent_docs.md