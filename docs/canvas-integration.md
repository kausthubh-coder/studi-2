# Canvas LMS Integration

This document describes the Canvas Learning Management System (LMS) integration with our chat application.

## Overview

The Canvas integration allows users to interact with their Canvas LMS data through the chat interface. Users can ask questions about their courses, assignments, announcements, and modules, and the application will fetch the relevant data from Canvas via its API.

## Components

The Canvas integration consists of the following components:

1. **Canvas API Client**: A set of functions that handle communication with the Canvas API.
2. **Function Calling**: Integration with OpenAI's function calling capabilities to detect when to access Canvas data.
3. **User Settings**: User-specific Canvas settings (access token and URL).

## Canvas API Functions

The following functions are available to fetch data from Canvas:

### `getCourses(userId)`

Fetches a list of active courses for the user.

**Parameters:**
- `userId`: The ID of the user

**Returns:**
- Success response: `{ success: true, data: courses }`
- Error response: `{ success: false, error: errorMessage }`

### `getAssignments(userId, courseId)`

Fetches assignments for a specific course.

**Parameters:**
- `userId`: The ID of the user
- `courseId`: The Canvas course ID

**Returns:**
- Success response: `{ success: true, data: assignments }`
- Error response: `{ success: false, error: errorMessage }`

### `getAnnouncements(userId, courseId)`

Fetches announcements for a specific course.

**Parameters:**
- `userId`: The ID of the user
- `courseId`: The Canvas course ID

**Returns:**
- Success response: `{ success: true, data: announcements }`
- Error response: `{ success: false, error: errorMessage }`

### `getModules(userId, courseId)`

Fetches modules for a specific course.

**Parameters:**
- `userId`: The ID of the user
- `courseId`: The Canvas course ID

**Returns:**
- Success response: `{ success: true, data: modules }`
- Error response: `{ success: false, error: errorMessage }`

## OpenAI Function Integration

The Canvas functions are exposed to OpenAI's GPT-4o model through function definitions in the chat completion API. When the model detects that a user's question requires Canvas data, it can call the appropriate function.

The function definitions are:

```javascript
const canvasFunctions = [
  {
    name: "get_courses",
    description: "Get the user's courses from Canvas LMS",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_assignments",
    description: "Get assignments for a specific course from Canvas LMS",
    parameters: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          description: "The Canvas course ID"
        }
      },
      required: ["course_id"]
    }
  },
  {
    name: "get_announcements",
    description: "Get announcements for a specific course from Canvas LMS",
    parameters: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          description: "The Canvas course ID"
        }
      },
      required: ["course_id"]
    }
  },
  {
    name: "get_modules",
    description: "Get modules for a specific course from Canvas LMS",
    parameters: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          description: "The Canvas course ID"
        }
      },
      required: ["course_id"]
    }
  }
];
```

## User Settings

Users can enable or disable Canvas integration and configure their Canvas settings through the application. The following settings are available:

- `canvasEnabled`: Whether Canvas integration is enabled for the user
- `canvasAccessToken`: The user's Canvas API access token
- `canvasUrl`: The URL of the user's Canvas instance

These settings are stored in the user's document in the database.

## Flow of Data

1. User sends a message asking about Canvas data (e.g., "What courses am I taking?")
2. The message is sent to OpenAI's API with Canvas function definitions
3. If the model decides to call a Canvas function, it returns a function call
4. The application executes the function, fetching data from Canvas
5. The data is formatted and sent back to OpenAI's API
6. The model generates a human-readable response based on the Canvas data
7. The response is displayed to the user

## Error Handling

The Canvas integration includes robust error handling:

- Checks if Canvas integration is enabled for the user
- Verifies that the user has provided valid Canvas credentials
- Handles API errors from Canvas
- Provides clear error messages to the user

## Security

To ensure security:

- Canvas access tokens are stored securely in the database
- All API requests to Canvas use HTTPS
- Canvas function calls are only made when the user's question explicitly requires Canvas data
- Users can disable Canvas integration at any time

## Future Improvements

Potential future improvements to the Canvas integration:

1. Support for more Canvas API endpoints (e.g., calendar events, grades, etc.)
2. Caching of Canvas data to reduce API calls
3. Improved error handling and retry mechanisms
4. Better formatting of Canvas data in responses
5. Support for file uploads and downloads from Canvas 