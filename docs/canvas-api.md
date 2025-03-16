# Canvas API Integration Documentation

This document describes the Canvas LMS API functions implemented in our chatbot application using Convex and OpenAI function calling.

## Overview

Our application integrates with the Canvas Learning Management System API to provide users with access to their educational data. This enables the AI chatbot to respond to queries about courses, assignments, grades, and other educational resources directly from Canvas.

## Authentication

All Canvas API calls require authentication using a Canvas API token. Users must provide:

1. A Canvas API access token
2. The URL of their Canvas instance (e.g., `https://canvas.instructure.com`)

These credentials are stored securely in the user document in the database and used for all subsequent API calls.

## Available Functions

### Courses

#### `getCourses`
- **Description**: Retrieves a list of courses in which the user is enrolled
- **Args**: `userId`
- **Returns**: List of course objects with details such as name, ID, code, and start/end dates

### Assignments

#### `getAssignments`
- **Description**: Retrieves assignments for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of assignment objects with details such as name, description, due dates, and submission status

### Announcements

#### `getAnnouncements`
- **Description**: Retrieves announcements for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of announcement objects with details such as title, message, and post date

### Modules

#### `getModules`
- **Description**: Retrieves modules for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of module objects with details such as name, position, and unlock date

#### `getModuleItems`
- **Description**: Retrieves items within a specific module
- **Args**: `userId`, `courseId`, `moduleId`
- **Returns**: List of module item objects with details such as title, type, URL, and content

### Files

#### `getFiles`
- **Description**: Retrieves files for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of file objects with details such as name, size, type, and creation date

#### `getFileDownloadUrl`
- **Description**: Retrieves a download URL for a specific file
- **Args**: `userId`, `fileId`
- **Returns**: String URL that can be used to download the file

### Grades

#### `getCourseGrades`
- **Description**: Retrieves assignment grades for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of assignment objects with submission and grade information

#### `getEnrollmentGrades`
- **Description**: Retrieves overall grades for all enrolled courses
- **Args**: `userId`
- **Returns**: List of enrollment objects with course grade information

### Discussions

#### `getDiscussions`
- **Description**: Retrieves discussion topics for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of discussion topic objects with details such as title, message, and replies count

#### `getDiscussionDetails`
- **Description**: Retrieves details for a specific discussion topic including entries and replies
- **Args**: `userId`, `courseId`, `discussionId`
- **Returns**: Discussion topic object with entries and replies

### User Information

#### `getUserProfile`
- **Description**: Retrieves the user's profile information
- **Args**: `userId`
- **Returns**: User profile object with details such as name, email, and bio

#### `getUserEnrollments`
- **Description**: Retrieves the user's enrollments (courses with roles)
- **Args**: `userId`
- **Returns**: List of enrollment objects with course and role information

### Calendar & Events

#### `getCalendarEvents`
- **Description**: Retrieves calendar events for the user
- **Args**: `userId`, `startDate` (optional), `endDate` (optional)
- **Returns**: List of calendar event objects with details such as title, description, and dates

#### `getUpcomingEvents`
- **Description**: Retrieves upcoming events and assignments with due dates
- **Args**: `userId`
- **Returns**: List of upcoming event objects with details such as title, type, and due date

### Quizzes & Surveys

#### `getQuizzes`
- **Description**: Retrieves quizzes for a specific course
- **Args**: `userId`, `courseId`
- **Returns**: List of quiz objects with details such as title, description, and availability dates

#### `getQuizDetails`
- **Description**: Retrieves details for a specific quiz including questions
- **Args**: `userId`, `courseId`, `quizId`
- **Returns**: Quiz object with details and questions

## Error Handling

All Canvas API functions include consistent error handling:

1. User validation - Ensures the user exists and has Canvas credentials
2. API request errors - Handles HTTP errors from the Canvas API
3. General error handling - Catches and logs any unexpected errors

All functions return a standardized `CanvasResponse` object with the following structure:
```typescript
{
  success: boolean;      // Whether the request was successful
  data?: T;              // The data returned (when success is true)
  error?: string;        // Error message (when success is false)
}
```

## Integration with OpenAI Function Calling

The Canvas API functions are integrated with OpenAI's function calling capabilities through the `openai.ts` file. Each Canvas function is registered as an available tool that OpenAI can call when appropriate for responding to user queries.

The functions are described to the AI with clear parameter information, allowing it to choose the right function and parameters based on the user's query.

## Example Usage

When a user asks a question like "What assignments do I have in my Physics course?", the following process occurs:

1. The AI recognizes this as a request for assignments in a specific course
2. The AI first calls `getCourses` to find the user's courses
3. It identifies the Physics course and gets its ID
4. It then calls `getAssignments` with the Physics course ID
5. Finally, it formats and presents the assignment information to the user

## Documentation Resources

For more information about the Canvas API, refer to the official Canvas LMS API documentation:
- [Canvas LMS API Documentation](https://canvas.instructure.com/doc/api/index.html)
- [Canvas API Authentication](https://canvas.instructure.com/doc/api/file.oauth.html) 