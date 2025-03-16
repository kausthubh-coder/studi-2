# Application Architecture

## Overview

Studi is a Next.js application designed to help students interact with their Canvas LMS data through a chat interface. The application uses a combination of client-side and server-side components, with Convex as the backend database and API layer.

## Tech Stack

- **Frontend**: Next.js 14 with React and TypeScript
- **Backend**: Convex for database and serverless functions
- **Authentication**: Clerk for user authentication
- **AI Integration**: OpenAI API for chat completions
- **Canvas Integration**: Canvas LMS API for educational data
- **Styling**: Tailwind CSS with shadcn/ui components

## Core Components

### Frontend Architecture

The frontend is organized into several key areas:

1. **Pages and Layouts**
   - App router-based structure with nested layouts
   - Main pages: Home, Chat, Dashboard, Settings

2. **Components**
   - UI components (buttons, inputs, etc.) from shadcn/ui
   - Custom components for specific features (ChatContainer, Message, etc.)
   - Layout components for page structure

3. **Hooks and Utilities**
   - Custom React hooks for state management
   - Utility functions for common operations
   - Logger for debugging and monitoring

### Backend Architecture (Convex)

The Convex backend handles:

1. **Database**
   - Users, chats, and messages storage
   - Relationships between entities

2. **API Endpoints**
   - Mutations for creating and updating data
   - Queries for retrieving data
   - Actions for external API calls (OpenAI, Canvas)

3. **Authentication**
   - Integration with Clerk for user authentication
   - User session management

### Data Flow

1. **User Authentication**
   - User signs in via Clerk
   - Authentication state is managed client-side
   - User data is stored in Convex

2. **Chat Interaction**
   - User sends a message via the UI
   - Message is stored in Convex
   - OpenAI API is called to generate a response
   - Response is stored and displayed to the user

3. **Canvas Integration**
   - User connects their Canvas account
   - Access token is securely stored
   - AI can request Canvas data via function calls
   - Data is fetched and presented to the user

## Key Files and Directories

```
studi/
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (dashboard)/      # Dashboard pages
│   │   ├── api/              # API routes
│   │   ├── components/       # React components
│   │   │   ├── chat/         # Chat-related components
│   │   │   ├── ui/           # UI components
│   │   ├── lib/              # Utility libraries
│   │   └── types/            # TypeScript type definitions
│   ├── utils/                # Utility functions
│   │   └── logger.ts         # Logging utility
├── convex/                   # Convex backend
│   ├── _generated/           # Generated Convex files
│   ├── schema.ts             # Database schema
│   ├── users.ts              # User-related functions
│   ├── messages.ts           # Message-related functions
│   ├── chats.ts              # Chat-related functions
│   ├── canvas.ts             # Canvas integration
│   └── openai.ts             # OpenAI integration
├── public/                   # Static assets
└── docs/                     # Documentation
```

## Authentication Flow

1. User visits the application
2. If not authenticated, redirected to sign-in page
3. User signs in or creates an account via Clerk
4. On successful authentication:
   - Clerk provides a JWT token
   - Token is used to authenticate Convex requests
   - User data is created or retrieved from the database

## Chat System Architecture

The chat system consists of:

1. **ChatContainer Component**
   - Manages the UI for the chat interface
   - Handles message input and submission

2. **Message Component**
   - Renders individual messages
   - Supports different message types (user, assistant, system, function)

3. **Convex Backend**
   - `messages.ts`: Stores and retrieves messages
   - `openai.ts`: Handles AI message generation
   - `canvas.ts`: Processes Canvas-related function calls

4. **OpenAI Integration**
   - Processes user messages
   - Generates assistant responses
   - Handles function calling for Canvas data

## Canvas Integration

The Canvas integration allows:

1. **Authentication**
   - User connects their Canvas account via OAuth
   - Access token is securely stored in the database

2. **Data Access**
   - AI can request specific Canvas data via function calls
   - Available functions: get_courses, get_assignments, get_announcements, get_modules

3. **Data Presentation**
   - Canvas data is formatted and presented to the user
   - AI provides context and explanations for the data

## Logging System

The application uses a custom logger that:

1. Provides different log levels (debug, info, warn, error)
2. Supports context tagging for better organization
3. Formats logs with timestamps and additional metadata
4. Adjusts verbosity based on the environment

## Future Architecture Considerations

1. **Scalability**
   - Implement caching for frequently accessed data
   - Optimize database queries for performance

2. **Security**
   - Regular security audits
   - Implement rate limiting
   - Enhanced data encryption

3. **Features**
   - File upload and management
   - Real-time collaboration
   - Advanced Canvas integration features 