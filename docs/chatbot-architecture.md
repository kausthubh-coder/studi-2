# AI Chatbot Architecture Documentation

This document provides an overview of the architecture and implementation details of the AI chatbot feature in our application.

## System Overview

The AI chatbot is implemented using a combination of:

- **Next.js** for the frontend UI
- **Tailwind CSS** for styling
- **Convex** for the backend and database
- **OpenAI** for the AI chat completion
- **Clerk** for authentication and user management

## Data Model

### Schema

The chatbot functionality relies on three main data tables:

1. **Users**
   - Stores user information and subscription details
   - Tracks usage tokens for billing and limits

2. **Chats**
   - Represents chat sessions created by users
   - Contains metadata like title and timestamps

3. **Messages**
   - Stores individual messages within chat sessions
   - Contains the content, role (user/assistant), and token usage

## Component Architecture

### Backend Components

1. **Convex Schema (`schema.ts`)**
   - Defines the database schema for users, chats, and messages
   - Sets up indexes for efficient queries

2. **OpenAI Integration (`openai.ts`)**
   - Handles communication with the OpenAI API
   - Manages prompt formatting and response processing

3. **Chat Management (`chats.ts`)**
   - Provides functions for creating, retrieving, and deleting chats
   - Enforces access control based on user authentication

4. **Message Management (`messages.ts`)**
   - Handles sending and retrieving messages
   - Tracks token usage for billing purposes

### Frontend Components

1. **Chat Container (`ChatContainer.tsx`)**
   - Serves as the main wrapper for the chat interface
   - Manages state and data flow between components

2. **Message List (`MessageList.tsx`)**
   - Displays the list of messages in a conversation
   - Handles auto-scrolling and loading states

3. **Message Component (`Message.tsx`)**
   - Renders individual messages with appropriate styling
   - Provides copy functionality for AI responses

4. **Message Input (`MessageInput.tsx`)**
   - Handles user input and message submission
   - Provides keyboard shortcuts and loading states

5. **Chat List (`ChatList.tsx`)**
   - Shows the list of user's chat conversations
   - Allows creating new chats and deleting existing ones

## Authentication and Authorization

- **Clerk Authentication** is used to secure all chat-related routes
- **Convex Auth** ensures users can only access their own data
- Each database query and mutation verifies user identity before proceeding

## OpenAI Integration

- The application uses the OpenAI Chat Completions API
- Messages are sent with proper context for conversational continuity
- System prompts establish the assistant's personality and capabilities
- Token usage is tracked for each request to manage billing and limits

## Performance Considerations

1. **Message Pagination**
   - Only the most recent messages are sent to OpenAI to stay within token limits
   - Older messages can be loaded on demand

2. **Real-time Updates**
   - Convex provides real-time data synchronization for immediate updates

3. **Token Management**
   - Token usage is tracked to prevent exceeding rate limits or quotas
   - Users on different subscription tiers have different usage limits

## Future Enhancements

1. **Streaming Responses**
   - Implement streaming for real-time display of AI responses

2. **File Attachments**
   - Allow users to upload and reference files in conversations

3. **Enhanced Context Management**
   - Implement more sophisticated context management for longer conversations

4. **Custom Instructions**
   - Allow users to set persistent custom instructions for their assistant

## Error Handling

- Robust error handling throughout the application
- Graceful degradation when API limits are reached
- Clear user feedback for all error states 