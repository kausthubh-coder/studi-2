# OpenAI Function Calling

This document explains how OpenAI function calling is implemented in our chat application to enable integration with Canvas LMS.

## Overview

OpenAI's function calling capability allows the AI model to request specific functions to be executed based on user input. Our implementation uses this feature to enable the chat AI to access Canvas LMS data when a user asks about their courses, assignments, or other educational resources.

## Implementation Details

### Function Definitions

Function definitions are structured according to OpenAI's requirements, specifying:
- Name of the function
- Description of what the function does
- Parameters the function accepts (in JSON Schema format)

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
  // Other function definitions...
];
```

### OpenAI API Integration

When a user sends a message that might require Canvas data, the application:

1. Formats previous messages and the new user message
2. Calls the OpenAI API with function definitions included
3. Checks if the model wants to call a function
4. If a function call is requested, executes the function
5. Sends the function result back to OpenAI
6. Returns the final response to the user

### Code Flow

The main chat completion function:

```typescript
export const generateChatCompletion = action({
  args: {
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    chatId: v.id("chats"),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<GenerateChatCompletionResponse> => {
    // Get OpenAI client
    const openai = await getOpenAIClient();
    
    try {
      // Get user to check if Canvas is enabled
      const user = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      // Prepare system message with Canvas capability if enabled
      const systemMessage = {
        role: "system",
        content: "You are a helpful AI assistant. " + 
                 (user?.canvasEnabled ? "You can access the user's Canvas LMS data." : "")
      };
      
      // Format messages for OpenAI
      const formattedMessages = [
        systemMessage,
        ...args.messages
      ];
      
      // Include Canvas functions if enabled
      const functions = user?.canvasEnabled ? canvasFunctions : [];
      
      // First API call
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: formattedMessages,
        functions: functions.length > 0 ? functions : undefined,
        function_call: functions.length > 0 ? "auto" : undefined,
      });
      
      // Check if model wants to call a function
      if (response.choices[0]?.message?.function_call) {
        // Execute function and get result
        const functionResult = await executeCanvasFunction(
          ctx, 
          args.userId, 
          response.choices[0].message.function_call
        );
        
        // Second API call with function result
        const secondResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            ...formattedMessages,
            {
              role: "assistant",
              content: null,
              function_call: response.choices[0].message.function_call
            },
            {
              role: "function",
              name: response.choices[0].message.function_call.name,
              content: JSON.stringify(functionResult)
            }
          ],
        });
        
        // Return final response
        return {
          message: secondResponse.choices[0]?.message?.content,
          functionCall: {
            name: response.choices[0].message.function_call.name,
            arguments: JSON.parse(response.choices[0].message.function_call.arguments),
            result: functionResult
          }
        };
      }
      
      // Return direct response if no function call
      return {
        message: response.choices[0]?.message?.content
      };
    } catch (error) {
      console.error("Error in generateChatCompletion:", error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  },
});
```

## Function Execution

When a function call is detected, the application:

1. Extracts the function name and arguments
2. Maps the function name to the appropriate Canvas API call
3. Executes the function with the provided arguments
4. Returns the result to be sent back to OpenAI

```typescript
// Example of function execution
switch (functionName) {
  case "get_courses":
    functionResult = await ctx.runAction(internal.canvas.getCourses, { 
      userId: args.userId 
    });
    break;
  case "get_assignments":
    functionResult = await ctx.runAction(internal.canvas.getAssignments, { 
      userId: args.userId,
      courseId: functionArgs.course_id
    });
    break;
  // Other functions...
}
```

## Message Storage

All messages, including function calls and their results, are stored in the database:

```typescript
// Save message with function call data
await ctx.runMutation(internal.messages.saveMessage, {
  chatId: args.chatId,
  userId: args.userId,
  content: finalMessage,
  role: "assistant",
  tokens: secondResponse.usage?.total_tokens || 0,
  functionCall: JSON.stringify({
    name: functionName,
    arguments: functionArgs,
    result: functionResult
  })
});
```

## Benefits of Function Calling

1. **Seamless Integration**: Users can ask about Canvas data naturally in conversation
2. **Context-Aware Responses**: The AI can access exactly the data needed to answer questions
3. **Structured Data Access**: Function calls provide a clear interface for accessing external data
4. **Reduced Hallucination**: The AI uses real data rather than making up answers

## Limitations and Considerations

1. **Rate Limiting**: Be aware of Canvas API rate limits when making frequent calls
2. **Error Handling**: Robust error handling is needed for API failures
3. **Authentication**: Ensure Canvas credentials are valid before attempting function calls
4. **Function Selection**: The AI may not always correctly identify when to use functions
5. **Response Formatting**: The AI needs to format technical data in a user-friendly way

## Future Improvements

1. **Additional Functions**: Add more Canvas API endpoints as functions
2. **Caching**: Implement caching for frequently accessed data
3. **Better Error Messages**: Improve user-facing error messages
4. **Stream Responses**: Use streaming for better user experience during API calls
5. **Function Parameters**: Enhance parameter validation and error handling 