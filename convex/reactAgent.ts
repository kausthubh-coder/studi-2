import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { OpenAI } from "openai";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Define types for the ReAct agent
type User = {
  _id: Id<"users">;
  canvasEnabled?: boolean;
  canvasAccessToken?: string;
  canvasUrl?: string;
  [key: string]: any;
};

type AgentStep = {
  thought: string;
  action: string;
  actionInput: any;
  observation: string;
  stepNumber: number;
  timestamp: number;
};

type AgentMemory = {
  steps: AgentStep[];
  currentGoal: string;
  completedTasks: string[];
  context: Record<string, any>;
};

type AgentResponse = {
  finalAnswer: string;
  reasoning: AgentStep[];
  usage?: any;
  completed: boolean;
};

// Enhanced Canvas function schemas with better descriptions for agent reasoning
const canvasFunctions = [
  {
    name: "get_courses",
    description: "Get the user's courses from Canvas LMS. Use this to understand what courses the student is enrolled in and get course IDs for further analysis.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_assignments",
    description: "Get assignments for a specific course from Canvas LMS. Use this to analyze workload, due dates, and assignment details for planning and prioritization.",
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
    name: "get_upcoming_events",
    description: "Get upcoming events/assignments with due dates from Canvas LMS. Use this to help with schedule planning and identifying urgent tasks.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_course_grades",
    description: "Get grades for assignments in a specific course from Canvas LMS. Use this to analyze academic performance and identify areas needing improvement.",
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
    name: "get_enrollment_grades",
    description: "Get overall grades for all enrolled courses from Canvas LMS. Use this for comprehensive academic performance analysis.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_announcements",
    description: "Get announcements for a specific course from Canvas LMS. Use this to stay informed about course updates and important information.",
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
    description: "Get modules for a specific course from Canvas LMS. Use this to understand course structure and learning progression.",
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
    name: "get_discussions",
    description: "Get discussion topics for a specific course from Canvas LMS. Use this to understand class participation and discussion topics.",
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
    name: "get_calendar_events",
    description: "Get calendar events from Canvas LMS. Use this for comprehensive schedule management and planning.",
    parameters: {
      type: "object",
      properties: {
        start_date: {
          type: "string",
          description: "The start date for calendar events (YYYY-MM-DD)"
        },
        end_date: {
          type: "string",
          description: "The end date for calendar events (YYYY-MM-DD)"
        }
      },
      required: []
    }
  },
  {
    name: "get_user_profile",
    description: "Get the user's profile information from Canvas LMS. Use this to understand user context and personalize responses.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// Initialize OpenAI client
async function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in environment variables");
  }
  
  return new OpenAI({
    apiKey,
  });
}

// Execute a single Canvas function
async function executeCanvasFunction(
  ctx: { runAction: (action: any, args: any) => Promise<any> },
  functionName: string,
  functionArgs: any,
  userId: Id<"users">
): Promise<any> {
  console.log(`[ReAct Agent] Executing function: ${functionName}`, { args: functionArgs });
  
  try {
    switch (functionName) {
      case "get_courses":
        return await ctx.runAction(internal.canvas.getCourses, { userId });
      case "get_assignments":
        return await ctx.runAction(internal.canvas.getAssignments, { 
          userId, courseId: functionArgs.course_id 
        });
      case "get_upcoming_events":
        return await ctx.runAction(internal.canvas.getUpcomingEvents, { userId });
      case "get_course_grades":
        return await ctx.runAction(internal.canvas.getCourseGrades, { 
          userId, courseId: functionArgs.course_id 
        });
      case "get_enrollment_grades":
        return await ctx.runAction(internal.canvas.getEnrollmentGrades, { userId });
      case "get_announcements":
        return await ctx.runAction(internal.canvas.getAnnouncements, { 
          userId, courseId: functionArgs.course_id 
        });
      case "get_modules":
        return await ctx.runAction(internal.canvas.getModules, { 
          userId, courseId: functionArgs.course_id 
        });
      case "get_discussions":
        return await ctx.runAction(internal.canvas.getDiscussions, { 
          userId, courseId: functionArgs.course_id 
        });
      case "get_calendar_events":
        return await ctx.runAction(internal.canvas.getCalendarEvents, { 
          userId, 
          startDate: functionArgs.start_date,
          endDate: functionArgs.end_date 
        });
      case "get_user_profile":
        return await ctx.runAction(internal.canvas.getUserProfile, { userId });
      default:
        return { error: `Unknown function: ${functionName}` };
    }
  } catch (error) {
    console.error(`[ReAct Agent] Error executing function ${functionName}:`, error);
    return { error: `Error executing function: ${error}` };
  }
}

// Main ReAct agent reasoning loop
export const runReActAgent = action({
  args: {
    query: v.string(),
    chatId: v.id("chats"),
    userId: v.id("users"),
    maxSteps: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<AgentResponse> => {
    const maxSteps = args.maxSteps || 10;
    const openai = await getOpenAIClient();
    
    // Get user to check Canvas capabilities
    const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    console.log(`[ReAct Agent] Starting agent for query: "${args.query}"`);
    console.log(`[ReAct Agent] Canvas enabled: ${user.canvasEnabled}, Max steps: ${maxSteps}`);
    
    // Initialize agent memory
    const memory: AgentMemory = {
      steps: [],
      currentGoal: args.query,
      completedTasks: [],
      context: {}
    };
    
    // ReAct system prompt
    const systemPrompt = `You are a sophisticated AI agent called "Studi" that helps students with their academic needs. You follow the ReAct (Reasoning and Acting) methodology:

1. **Think**: Analyze the user's request and plan your approach
2. **Act**: Take specific actions using available functions
3. **Observe**: Analyze the results and determine next steps
4. **Repeat**: Continue until the task is complete

${user.canvasEnabled ? `You have access to the user's Canvas LMS data through various functions. Use these strategically to gather information and provide comprehensive assistance.` : 'You do not have access to Canvas LMS data.'}

For each step, you must provide:
- **Thought**: Your reasoning about what to do next
- **Action**: The specific function to call (or "Final Answer" if done)
- **Action Input**: The parameters for the function

Format your response as JSON:
{
  "thought": "Your reasoning about what to do next",
  "action": "function_name" or "Final Answer",
  "action_input": {parameters} or "your final comprehensive response"
}

Always think step by step and explain your reasoning. When you have enough information to provide a complete answer, use "Final Answer" as the action.

Available functions: ${user.canvasEnabled ? canvasFunctions.map(f => f.name).join(', ') : 'None'}

User's question: ${args.query}`;

    let currentStep = 0;
    let completed = false;
    let finalAnswer = "";
    
    while (currentStep < maxSteps && !completed) {
      currentStep++;
      
      console.log(`[ReAct Agent] Step ${currentStep}/${maxSteps}`);
      
      // Build context for current step
      const contextMessages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.query }
      ];
      
      // Add previous steps to context
      if (memory.steps.length > 0) {
        const stepsContext = memory.steps.map(step => 
          `Step ${step.stepNumber}:\nThought: ${step.thought}\nAction: ${step.action}\nObservation: ${step.observation}`
        ).join('\n\n');
        
        contextMessages.push({
          role: "assistant",
          content: `Previous steps:\n${stepsContext}\n\nNow continuing with the next step...`
        });
      }
      
      // Get agent's next step
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: contextMessages as any,
        temperature: 0.3,
        max_tokens: 2000,
      });
      
      const responseContent = response.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response from OpenAI");
      }
      
      // Parse agent response
      let agentStep: any;
      try {
        // Try to extract JSON from the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          agentStep = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: treat as final answer
          agentStep = {
            thought: "Providing final answer based on analysis",
            action: "Final Answer",
            action_input: responseContent
          };
        }
      } catch (error) {
        console.error("[ReAct Agent] Failed to parse JSON, treating as final answer:", error);
        agentStep = {
          thought: "Providing final answer",
          action: "Final Answer",
          action_input: responseContent
        };
      }
      
      console.log(`[ReAct Agent] Step ${currentStep} - Thought: "${agentStep.thought}"`);
      console.log(`[ReAct Agent] Step ${currentStep} - Action: "${agentStep.action}"`);
      
      // Handle the action
      let observation = "";
      
      if (agentStep.action === "Final Answer") {
        finalAnswer = agentStep.action_input;
        completed = true;
        observation = "Task completed successfully";
      } else {
        // Execute the function
        const functionResult = await executeCanvasFunction(
          ctx,
          agentStep.action,
          agentStep.action_input,
          args.userId
        );
        
        observation = JSON.stringify(functionResult, null, 2);
        
        // Store useful information in memory context
        if (functionResult.success && functionResult.data) {
          memory.context[agentStep.action] = functionResult.data;
        }
      }
      
      // Save step to memory
      const step: AgentStep = {
        thought: agentStep.thought,
        action: agentStep.action,
        actionInput: agentStep.action_input,
        observation: observation,
        stepNumber: currentStep,
        timestamp: Date.now()
      };
      
      memory.steps.push(step);
      
      console.log(`[ReAct Agent] Step ${currentStep} - Observation: ${observation.substring(0, 200)}...`);
      
      // Check for loops or repetitive behavior
      if (currentStep > 3) {
        const recentActions = memory.steps.slice(-3).map(s => s.action);
        if (recentActions.every(action => action === recentActions[0])) {
          console.log("[ReAct Agent] Detected potential loop, forcing completion");
          completed = true;
          finalAnswer = "I've gathered the available information but seem to be repeating actions. Let me provide what I've learned so far.";
        }
      }
    }
    
    // If we hit max steps without completion, provide summary
    if (!completed) {
      console.log("[ReAct Agent] Reached maximum steps, providing summary");
      
      const summaryPrompt = `Based on the following steps taken, provide a comprehensive final answer to the user's question: "${args.query}"

Steps taken:
${memory.steps.map(step => 
  `Step ${step.stepNumber}:\nThought: ${step.thought}\nAction: ${step.action}\nObservation: ${step.observation}`
).join('\n\n')}

Provide a helpful summary of what was discovered and any recommendations.`;

      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful AI assistant. Provide a comprehensive summary based on the information gathered." },
          { role: "user", content: summaryPrompt }
        ] as any,
        temperature: 0.3,
        max_tokens: 1500,
      });
      
      finalAnswer = summaryResponse.choices[0]?.message?.content || "I was unable to complete the full analysis, but I've gathered some information for you.";
    }
    
    // Save the agent's response to the chat
    await ctx.runMutation(internal.messages.saveMessage, {
      chatId: args.chatId,
      userId: args.userId,
      content: finalAnswer,
      role: "assistant",
      tokens: undefined, // Will be calculated by the system
      functionCall: JSON.stringify({
        agentType: "ReAct",
        steps: memory.steps.length,
        reasoning: memory.steps.map(s => ({
          step: s.stepNumber,
          thought: s.thought,
          action: s.action
        }))
      })
    });
    
    console.log(`[ReAct Agent] Completed in ${memory.steps.length} steps`);
    
    return {
      finalAnswer,
      reasoning: memory.steps,
      completed,
      usage: undefined // Usage will be tracked separately
    };
  },
});

// Helper function to format agent steps for display
export const formatAgentSteps = (steps: AgentStep[]): string => {
  return steps.map(step => 
    `**Step ${step.stepNumber}**: ${step.thought}\n` +
    `**Action**: ${step.action}\n` +
    `**Result**: ${step.observation.substring(0, 200)}${step.observation.length > 200 ? '...' : ''}\n`
  ).join('\n---\n');
};