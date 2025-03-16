# Logger Utility Documentation

## Overview

The logger utility provides a structured logging system for the application. It supports different log levels and context tagging to help organize and filter logs based on their importance and source.

## Features

- **Multiple Log Levels**: Supports 'debug', 'info', 'warn', and 'error' log levels
- **Context Tagging**: Allows categorizing logs by context (app, api, chat, ui, canvas, auth, etc.)
- **Environment-Aware**: Automatically adjusts log level based on the environment (development vs. production)
- **Formatted Output**: Includes timestamps and context tags for better readability
- **Flexible API**: Supports both string and object data logging

## Usage

### Basic Usage

```typescript
import { logger } from "../utils/logger";

// Basic logging with default context ('app')
logger.debug("Debug message");
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message");
```

### Logging with Context

```typescript
// Logging with specific context
logger.debug("User authentication attempt", { context: 'auth' });
logger.info("API request received", { context: 'api' });
logger.warn("Rate limit approaching", { context: 'api' });
logger.error("Database connection failed", { context: 'db' });
```

### Logging Objects

```typescript
// Logging objects
logger.info("User data", { 
  context: 'auth',
  data: { userId: '123', email: 'user@example.com' } 
});

// Error with additional data
logger.error("Request failed", { 
  context: 'api',
  error: new Error('Network error'),
  request: { url: '/api/data', method: 'GET' }
});
```

### Direct Use of Log Function

```typescript
import { log } from "../utils/logger";

// Using the core log function directly
log('Custom message', { 
  level: 'info',
  context: 'custom',
  timestamp: new Date().toISOString(),
  data: { custom: 'data' }
});
```

## Configuration

The logger automatically sets the appropriate log level based on the environment:

- In production (`NODE_ENV === 'production'`): Only logs with level 'info' and above are displayed
- In development: All logs including 'debug' level are displayed

## Log Level Priorities

Log levels are prioritized as follows (from lowest to highest):

1. debug
2. info
3. warn
4. error

Logs with a priority lower than the current environment's log level will not be displayed.

## Implementation Details

The logger is implemented in `src/utils/logger.ts` and uses the browser's console methods for output. Each log level corresponds to a specific console method:

- debug → console.debug
- info → console.info
- warn → console.warn
- error → console.error

## Best Practices

1. Use the appropriate log level based on the message's importance
2. Include relevant context to make filtering easier
3. For errors, include the error object and any relevant request data
4. Use structured data (objects) for complex information rather than string concatenation
5. Avoid logging sensitive information (passwords, tokens, etc.) 