# Canvas Function Calling

## Overview

The Canvas function calling feature allows the Studi AI chatbot to interact with the Canvas LMS API on behalf of the user. This enables the chatbot to retrieve course information, assignments, announcements, and other educational data directly from Canvas.

## Features

- Retrieve courses from Canvas
- Get assignments for specific courses
- View course announcements
- Access module information
- Seamless integration with the chat interface

## Technical Implementation

### Function Calling Architecture

The Canvas function calling feature uses OpenAI's function calling capability to:

1. Detect when a user's query requires Canvas data
2. Call the appropriate Canvas API endpoint
3. Process the data and present it in a user-friendly format
4. Continue the conversation with context from the Canvas data

### Canvas API Integration

The integration uses the Canvas REST API with the following endpoints:

- `/api/v1/courses` - Get user's courses
- `/api/v1/courses/:id/assignments` - Get assignments for a course
- `/api/v1/courses/:id/announcements` - Get announcements for a course
- `/api/v1/courses/:id/modules` - Get modules for a course

### Security Considerations

- Canvas API tokens are stored securely in the database
- All API requests are made server-side
- Function calls are logged for audit purposes
- Users can revoke access at any time by disabling Canvas integration

## User Guide

### Prerequisites

Before using Canvas function calling:

1. Enable Canvas integration in Settings
2. Configure your Canvas URL
3. Add your Canvas API access token

### Example Queries

Users can ask questions like:

- "What courses am I enrolled in?"
- "Show me assignments for my Biology course"
- "What are the recent announcements in my Math class?"
- "List the modules in my History course"

### Interpreting Results

The chatbot will display Canvas data in a structured format within the chat interface, making it easy to browse and understand the information.

## Troubleshooting

### Common Issues

1. **"Canvas integration not configured"** - Ensure Canvas integration is enabled in Settings
2. **"Unable to access Canvas API"** - Verify your Canvas URL and access token
3. **"Course not found"** - Check that you're using the correct course ID or name

### Support

If you encounter issues with Canvas function calling, please contact support at support@studiapp.com. 