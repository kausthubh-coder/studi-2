import { v } from "convex/values";
import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Define types for better type safety
type User = {
  _id: Id<"users">;
  canvasEnabled?: boolean;
  canvasAccessToken?: string;
  canvasUrl?: string;
  [key: string]: any;
};

type FunctionCallResult = {
  name: string;
  arguments: any;
  result: any;
};

type GenerateChatCompletionResponse = {
  message: string;
  usage?: any;
  functionCall?: FunctionCallResult;
};

// Define Canvas function schemas for OpenAI
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
  },
  {
    name: "get_files",
    description: "Get files for a specific course from Canvas LMS",
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
    name: "get_file_download_url",
    description: "Get download URL for a specific file from Canvas LMS",
    parameters: {
      type: "object",
      properties: {
        file_id: {
          type: "string",
          description: "The Canvas file ID"
        }
      },
      required: ["file_id"]
    }
  },
  {
    name: "get_course_grades",
    description: "Get grades for assignments in a specific course from Canvas LMS",
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
    description: "Get overall grades for all enrolled courses from Canvas LMS",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_discussions",
    description: "Get discussion topics for a specific course from Canvas LMS",
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
    name: "get_discussion_details",
    description: "Get details for a specific discussion topic including entries and replies",
    parameters: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          description: "The Canvas course ID"
        },
        discussion_id: {
          type: "string",
          description: "The Canvas discussion topic ID"
        }
      },
      required: ["course_id", "discussion_id"]
    }
  },
  {
    name: "get_user_profile",
    description: "Get the user's profile information from Canvas LMS",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_user_enrollments",
    description: "Get the user's enrollments (courses with roles) from Canvas LMS",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_calendar_events",
    description: "Get calendar events from Canvas LMS",
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
    name: "get_upcoming_events",
    description: "Get upcoming events/assignments with due dates from Canvas LMS",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_quizzes",
    description: "Get quizzes for a specific course from Canvas LMS",
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
    name: "get_quiz_details",
    description: "Get details for a specific quiz including questions",
    parameters: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          description: "The Canvas course ID"
        },
        quiz_id: {
          type: "string",
          description: "The Canvas quiz ID"
        }
      },
      required: ["course_id", "quiz_id"]
    }
  },
  {
    name: "get_module_items",
    description: "Get items for a specific module in a course",
    parameters: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          description: "The Canvas course ID"
        },
        module_id: {
          type: "string",
          description: "The Canvas module ID"
        }
      },
      required: ["course_id", "module_id"]
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

// Generate a chat completion using OpenAI
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
    console.log(`[OpenAI] Starting chat completion for chat ${args.chatId}`);
    
    // Get OpenAI client
    const openai = await getOpenAIClient();
    
    try {
      // Get user to check if Canvas is enabled
      const user: User | null = await ctx.runQuery(internal.users.getUserById, { userId: args.userId });
      
      console.log(`[OpenAI] User ${args.userId} Canvas enabled: ${user?.canvasEnabled}`);
      
      // Prepare system message
      const systemMessage = {
        role: "system",
        content: "You are a knowledgeable AI assistant called studi specializing in educational content. Format your responses in a blog-style with proper markdown formatting including headings, bullet points, and code blocks where appropriate. Be informative yet conversational, and organize complex information with clear structure. " +
                 (user?.canvasEnabled ? "You can access the user's Canvas LMS data to provide educational assistance and structure this information in a readable, well-formatted way." : "")
      };
      
      // Combine system message with user messages and cast to any to avoid type issues
      const formattedMessages: any = [
        systemMessage,
        ...args.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      // Only include Canvas functions if Canvas integration is enabled
      const functions = user?.canvasEnabled ? canvasFunctions : [];
      
      console.log(`[OpenAI] Sending request with ${formattedMessages.length} messages and ${functions.length} available functions`);
      
      // Call OpenAI API with any type to bypass TypeScript errors
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: formattedMessages,
        functions: functions.length > 0 ? functions : undefined,
        function_call: functions.length > 0 ? "auto" : undefined,
        temperature: 0.7,
        max_tokens: 1000,
      } as any);
      
      const responseMessage = response.choices[0]?.message;
      
      // Check if the model wants to call a function
      if (responseMessage.function_call) {
        const functionName = responseMessage.function_call.name;
        const functionArgs = JSON.parse(responseMessage.function_call.arguments);
        
        console.log(`[OpenAI] Function call detected: ${functionName}`, { args: functionArgs });
        
        // Execute the appropriate Canvas function
        let functionResult;
        
        try {
          switch (functionName) {
            case "get_courses":
              console.log(`[OpenAI] Executing get_courses for user ${args.userId}`);
              functionResult = await ctx.runAction(internal.canvas.getCourses, { 
                userId: args.userId 
              });
              break;
            case "get_assignments":
              console.log(`[OpenAI] Executing get_assignments for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getAssignments, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_announcements":
              console.log(`[OpenAI] Executing get_announcements for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getAnnouncements, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_modules":
              console.log(`[OpenAI] Executing get_modules for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getModules, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_files":
              console.log(`[OpenAI] Executing get_files for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getFiles, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_file_download_url":
              console.log(`[OpenAI] Executing get_file_download_url for file ${functionArgs.file_id}`);
              functionResult = await ctx.runAction(internal.canvas.getFileDownloadUrl, { 
                userId: args.userId,
                fileId: functionArgs.file_id
              });
              break;
            case "get_course_grades":
              console.log(`[OpenAI] Executing get_course_grades for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getCourseGrades, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_enrollment_grades":
              console.log(`[OpenAI] Executing get_enrollment_grades for user ${args.userId}`);
              functionResult = await ctx.runAction(internal.canvas.getEnrollmentGrades, { 
                userId: args.userId
              });
              break;
            case "get_discussions":
              console.log(`[OpenAI] Executing get_discussions for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getDiscussions, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_discussion_details":
              console.log(`[OpenAI] Executing get_discussion_details for discussion ${functionArgs.discussion_id}`);
              functionResult = await ctx.runAction(internal.canvas.getDiscussionDetails, { 
                userId: args.userId,
                courseId: functionArgs.course_id,
                discussionId: functionArgs.discussion_id
              });
              break;
            case "get_user_profile":
              console.log(`[OpenAI] Executing get_user_profile for user ${args.userId}`);
              functionResult = await ctx.runAction(internal.canvas.getUserProfile, { 
                userId: args.userId
              });
              break;
            case "get_user_enrollments":
              console.log(`[OpenAI] Executing get_user_enrollments for user ${args.userId}`);
              functionResult = await ctx.runAction(internal.canvas.getUserEnrollments, { 
                userId: args.userId
              });
              break;
            case "get_calendar_events":
              console.log(`[OpenAI] Executing get_calendar_events`);
              functionResult = await ctx.runAction(internal.canvas.getCalendarEvents, { 
                userId: args.userId,
                startDate: functionArgs.start_date,
                endDate: functionArgs.end_date
              });
              break;
            case "get_upcoming_events":
              console.log(`[OpenAI] Executing get_upcoming_events for user ${args.userId}`);
              functionResult = await ctx.runAction(internal.canvas.getUpcomingEvents, { 
                userId: args.userId
              });
              break;
            case "get_quizzes":
              console.log(`[OpenAI] Executing get_quizzes for course ${functionArgs.course_id}`);
              functionResult = await ctx.runAction(internal.canvas.getQuizzes, { 
                userId: args.userId,
                courseId: functionArgs.course_id
              });
              break;
            case "get_quiz_details":
              console.log(`[OpenAI] Executing get_quiz_details for quiz ${functionArgs.quiz_id}`);
              functionResult = await ctx.runAction(internal.canvas.getQuizDetails, { 
                userId: args.userId,
                courseId: functionArgs.course_id,
                quizId: functionArgs.quiz_id
              });
              break;
            case "get_module_items":
              console.log(`[OpenAI] Executing get_module_items for module ${functionArgs.module_id}`);
              functionResult = await ctx.runAction(internal.canvas.getModuleItems, { 
                userId: args.userId,
                courseId: functionArgs.course_id,
                moduleId: functionArgs.module_id
              });
              break;
            default:
              console.error(`[OpenAI] Unknown function: ${functionName}`);
              functionResult = { error: "Function not implemented" };
          }
          
          console.log(`[OpenAI] Function ${functionName} executed successfully`, { 
            success: functionResult.success,
            hasData: functionResult.data ? true : false,
            hasError: functionResult.error ? true : false
          });
        } catch (error) {
          console.error(`[OpenAI] Error executing function ${functionName}:`, error);
          functionResult = { error: `Error executing function: ${error}` };
        }
        
        // Add the function result to the messages for the second API call
        const secondCallMessages: any = [
          ...formattedMessages,
          {
            role: "assistant",
            content: null,
            function_call: {
              name: functionName,
              arguments: responseMessage.function_call.arguments
            }
          },
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(functionResult)
          }
        ];
        
        console.log(`[OpenAI] Sending second request with function results for ${functionName}`);
        
        // Call the model again with the function result
        const secondResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: secondCallMessages,
          temperature: 0.7,
          max_tokens: 1000,
        } as any);
        
        const finalMessage: string = secondResponse.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        
        console.log(`[OpenAI] Received final response with ${finalMessage.length} characters`);
        
        // Save the assistant's message to the database with function call data
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
        
        console.log(`[OpenAI] Saved assistant message with function call data`);
        
        return { 
          message: finalMessage,
          usage: secondResponse.usage,
          functionCall: {
            name: functionName,
            arguments: functionArgs,
            result: functionResult
          }
        };
      }
      
      // Get the generated response for non-function calls
      const assistantMessage: string = responseMessage.content || "Sorry, I couldn't generate a response.";
      
      console.log(`[OpenAI] Received standard response with ${assistantMessage.length} characters`);
      
      // Save the assistant's message to the database
      await ctx.runMutation(internal.messages.saveMessage, {
        chatId: args.chatId,
        userId: args.userId,
        content: assistantMessage,
        role: "assistant",
        tokens: response.usage?.total_tokens || 0,
      });
      
      console.log(`[OpenAI] Saved standard assistant message`);
      
      return { 
        message: assistantMessage,
        usage: response.usage
      };
    } catch (error) {
      console.error("[OpenAI] Error generating chat completion:", error);
      
      // Save error message to the database
      await ctx.runMutation(internal.messages.saveMessage, {
        chatId: args.chatId,
        userId: args.userId,
        content: `I'm sorry, but I encountered an error while processing your request. Please try again later.`,
        role: "assistant",
      });
      
      return { 
        message: "Error generating response. Please try again later."
      };
    }
  },
}); 