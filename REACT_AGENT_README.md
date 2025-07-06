# ReAct Agent Implementation

## Overview

This implementation transforms your basic chatbot into a sophisticated **ReAct (Reasoning and Acting) Agent** that can perform multi-step reasoning, execute sequential function calls, and maintain memory across interactions.

## Key Features

### 🧠 **Multi-Step Reasoning**
- **Thought**: Agent analyzes the situation and plans next steps
- **Action**: Executes specific functions or provides final answers
- **Observation**: Analyzes results and determines next steps
- **Repeat**: Continues until task completion

### 🔄 **Sequential Function Calling**
- Can call multiple Canvas LMS functions in sequence
- Each call informs the next decision
- Builds comprehensive understanding through multiple data sources

### 🧩 **Memory & Context Management**
- Maintains conversation history
- Tracks completed tasks and gathered information
- Prevents repetitive actions with loop detection

### 🎯 **Intelligent Mode Selection**
- **Agent Mode**: Advanced reasoning with multiple steps
- **Simple Mode**: Quick responses with single function calls
- Smart auto-detection based on query complexity

## Architecture

### Backend Components

#### 1. **ReAct Agent Core** (`convex/react-agent.ts`)
```typescript
// Main agent loop with reasoning steps
export const runReActAgent = action({
  args: {
    query: v.string(),
    chatId: v.id("chats"),
    userId: v.id("users"),
    maxSteps: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<AgentResponse> => {
    // Multi-step reasoning loop
    while (currentStep < maxSteps && !completed) {
      // 1. Think: Analyze situation
      // 2. Act: Execute function or provide answer
      // 3. Observe: Process results
      // 4. Continue or complete
    }
  }
});
```

#### 2. **Enhanced Message Handler** (`convex/messages.ts`)
```typescript
// Chooses between simple and agent modes
export const sendEnhancedMessage = mutation({
  args: {
    mode: v.optional(v.union(v.literal("simple"), v.literal("agent"))),
    maxSteps: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (mode === "agent") {
      // Use ReAct agent for complex reasoning
      await ctx.scheduler.runAfter(0, internal.reactAgent.runReActAgent, {
        query: args.content,
        chatId: args.chatId,
        userId: user._id,
        maxSteps: args.maxSteps || 8,
      });
    } else {
      // Use simple OpenAI function calling
      await ctx.scheduler.runAfter(0, api.openai.generateChatCompletion, {
        messages: formattedMessages,
        chatId: args.chatId,
        userId: user._id,
      });
    }
  }
});
```

### Frontend Components

#### 1. **Agent Reasoning Display** (`src/app/components/chat/AgentThinking.tsx`)
- Animated step-by-step reasoning visualization
- Collapsible thought process details
- Real-time progress indicators

#### 2. **Enhanced Message Component** (`src/app/components/chat/Message.tsx`)
- Displays agent reasoning steps
- Shows function calls and results
- Expandable details for complex interactions

#### 3. **Smart Chat Interface** (`src/app/components/chat/ChatContainer.tsx`)
- Mode toggle (Agent/Simple)
- Context-aware input placeholders
- Visual mode indicators

## Usage Examples

### Example 1: Academic Analysis
```
User: "Analyze my performance across all courses and suggest improvements"

Agent Process:
Step 1: Think: "I need to gather comprehensive academic data"
        Action: get_enrollment_grades
        Observation: "Found grades for 4 courses..."

Step 2: Think: "Let me get detailed course information"
        Action: get_courses
        Observation: "Retrieved course details..."

Step 3: Think: "I should check upcoming assignments"
        Action: get_upcoming_events
        Observation: "Found 7 upcoming assignments..."

Step 4: Think: "Now I can provide comprehensive analysis"
        Action: Final Answer
        Result: "Based on your academic data across 4 courses..."
```

### Example 2: Schedule Planning
```
User: "Help me plan my study schedule for next week"

Agent Process:
Step 1: Think: "I need to see what assignments are coming up"
        Action: get_upcoming_events
        
Step 2: Think: "Let me check specific course modules"
        Action: get_modules (for each course)
        
Step 3: Think: "I should review current progress"
        Action: get_course_grades
        
Step 4: Action: Final Answer
        Result: "Here's your personalized study schedule..."
```

## Configuration

### Agent Settings
```typescript
const maxSteps = 10; // Maximum reasoning steps
const temperature = 0.3; // Lower for more focused reasoning
const model = "gpt-4o"; // Best for complex reasoning
```

### Loop Detection
- Monitors last 3 actions for repetition
- Automatically completes if stuck in loops
- Provides summary of gathered information

### Memory Management
```typescript
type AgentMemory = {
  steps: AgentStep[];
  currentGoal: string;
  completedTasks: string[];
  context: Record<string, any>;
};
```

## Canvas LMS Integration

### Available Functions
- `get_courses` - List enrolled courses
- `get_assignments` - Course assignments
- `get_upcoming_events` - Upcoming deadlines
- `get_course_grades` - Performance data
- `get_announcements` - Course updates
- `get_modules` - Course structure
- `get_discussions` - Class discussions
- `get_calendar_events` - Schedule data

### Function Descriptions
Each function includes detailed descriptions for the agent:
```typescript
{
  name: "get_assignments",
  description: "Get assignments for a specific course. Use this to analyze workload, due dates, and assignment details for planning and prioritization.",
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
```

## UI Features

### Mode Toggle
- **Agent Mode**: 🧠 Advanced reasoning with multiple steps
- **Simple Mode**: ⚡ Quick responses with single function calls
- Visual indicators and tooltips

### Reasoning Visualization
- Step-by-step thought process
- Action execution details
- Collapsible observations
- Progress indicators

### Smart Placeholders
- Agent Mode: "Ask me anything - I'll think through it step by step..."
- Simple Mode: "Type your message..."

## Error Handling

### Graceful Degradation
- Continues with available information if functions fail
- Provides partial results when appropriate
- Clear error messages for users

### Retry Logic
- Function call failures are logged and reported
- Agent can try alternative approaches
- Automatic fallback to simple mode if needed

## Performance Considerations

### Optimization
- Parallel function calls where possible
- Efficient memory usage
- Progressive result revelation
- Caching of expensive operations

### Monitoring
- Step execution time tracking
- Function call success rates
- User satisfaction metrics
- Agent completion rates

## Future Enhancements

### Planned Features
- **Custom Agent Personalities**: Different reasoning styles
- **Tool Learning**: Agent learns which tools work best
- **Collaborative Agents**: Multiple agents working together
- **Advanced Memory**: Long-term memory across sessions
- **Agent Training**: Fine-tuning based on user feedback

### Integration Possibilities
- **Google Calendar**: Schedule management
- **Email Integration**: Communication assistance
- **File Processing**: Document analysis
- **Web Search**: Real-time information gathering

## Troubleshooting

### Common Issues
1. **Agent gets stuck in loops**: Check loop detection settings
2. **Functions fail**: Verify Canvas API credentials
3. **Long response times**: Adjust maxSteps parameter
4. **Memory issues**: Clear context periodically

### Debug Mode
Enable detailed logging in development:
```typescript
console.log(`[ReAct Agent] Step ${currentStep} - Thought: "${agentStep.thought}"`);
console.log(`[ReAct Agent] Step ${currentStep} - Action: "${agentStep.action}"`);
```

## Conclusion

The ReAct agent transforms your application from a simple chatbot into a sophisticated AI assistant capable of:
- **Complex reasoning** across multiple steps
- **Sequential tool usage** for comprehensive analysis
- **Memory management** for context-aware responses
- **Intelligent mode selection** based on query complexity

This implementation provides a solid foundation for building more advanced AI agents while maintaining usability and performance.