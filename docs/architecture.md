# Frontend Architecture

## Overview

The frontend of the Canvas Manus application is built using Next.js 14, leveraging the app router for server components and routing. The application uses Convex as a backend, providing real-time data synchronization and a document-based database.

## Key Technologies

- **Next.js 14**: React framework for server-side rendering and client components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Clerk**: Authentication provider
- **Convex**: Backend and database
- **Framer Motion**: Animation library for UI interactions
- **Lucide React**: Icon library for UI elements

## Directory Structure

- `/src`: Main source code directory
  - `/app`: Next.js app directory (app router)
    - `/(auth)`: Authentication pages
    - `/(dashboard)`: Dashboard and authenticated user experience
      - `/dashboard`: Main dashboard page
      - `/chat`: Chat listing and creation page
      - `/chat/[id]`: Individual chat page
    - `/components`: Reusable React components
      - `/auth`: Authentication-related components
      - `/chat`: Chat-related components
      - `/navigation`: Navigation components
    - `/globals.css`: Global styles
  - `/types`: TypeScript type definitions
- `/convex`: Convex backend code
  - `/schema.ts`: Database schema
  - `/users.ts`: User-related functions
  - `/chats.ts`: Chat-related functions
  - `/messages.ts`: Message-related functions
  - `/openai.ts`: OpenAI integration
- `/public`: Static assets

## UI Architecture

The UI is designed with a modern, clean aesthetic featuring a white background with black borders. The interface is built to be responsive, with different layouts for mobile and desktop views.

### Dashboard Layout

The dashboard layout includes:

1. **Sidebar**:
   - Logo and branding
   - New chat button
   - Navigation links (Dashboard, Settings)
   - List of recent chats
   - User profile section with Clerk UserButton

2. **Main Content Area**:
   - Dynamic content based on the current route
   - Responsive padding and layout
   - Subtle animations for page transitions using Framer Motion

### Dashboard Page

The dashboard page displays:

- Welcome section with user's name
- Recent chats in a card layout
- Account information (email, plan, credits)
- Usage statistics (tokens used, chats created)

### Chat Pages

1. **Chat Listing Page**:
   - New conversation button
   - Example conversation starters
   - Recent conversations list
   - Animated micro-interactions for better UX

2. **Chat Detail Page**:
   - Message list with user and AI messages
   - Message input with emoji support
   - Chat title and functionality
   - Animations for new messages and loading states

## Component Architecture

Components are organized by feature and follow a composition pattern. Most UI components leverage Tailwind CSS for styling, with minimal CSS-in-JS. Animation is provided via Framer Motion for enhanced user experience.

### Key Components

- **Navigation**: Main navigation and sidebar
- **ChatContainer**: Container for the chat UI
- **MessageList**: List of messages in a chat
- **Message**: Individual message component
- **MessageInput**: Input for new messages

## State Management

State is primarily managed through:

1. **Convex Queries and Mutations**: For data fetching and updates
2. **React State**: For local UI state
3. **URL Parameters**: For navigation and routing

## Authentication Flow

Authentication is handled by Clerk, with the following flow:

1. User signs in via Clerk UI
2. On successful authentication, user data is synchronized with Convex
3. User is redirected to the dashboard
4. Authentication state is checked on protected routes

## Styling Approach

The styling approach uses:

1. **Tailwind CSS**: For most UI styling
2. **CSS Variables**: For theme colors and repeated values
3. **Framer Motion**: For animations and transitions

## Micro-interactions

The UI includes several micro-interactions to enhance user experience:

- Hover states on buttons and interactive elements
- Subtle scale animations on cards and buttons
- Loading states with custom animations
- Transition animations between pages
- Subtle feedback on user actions

## Responsive Design

The UI is fully responsive with:

- Mobile-first design approach
- Sidebar that collapses on smaller screens
- Responsive grid layouts that adjust based on viewport size
- Touch-friendly targets on mobile devices 