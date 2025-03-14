import { v } from "convex/values";
import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { internal } from "./_generated/api";

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
  handler: async (ctx, args) => {
    // Get OpenAI client
    const openai = await getOpenAIClient();
    
    try {
      // Prepare system message
      const systemMessage = {
        role: "system",
        content: "You are a helpful AI assistant. Provide concise and accurate responses to the user's questions."
      };
      
      // Combine system message with user messages
      const messages = [systemMessage, ...args.messages];
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages.map(m => ({ 
          role: m.role as "system" | "user" | "assistant", 
          content: m.content 
        })),
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      // Get the generated response
      const assistantMessage = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
      
      // Save the assistant's message to the database
      await ctx.runMutation(internal.messages.saveMessage, {
        chatId: args.chatId,
        userId: args.userId,
        content: assistantMessage,
        role: "assistant",
        tokens: response.usage?.total_tokens || 0,
      });
      
      return { 
        message: assistantMessage,
        usage: response.usage,
      };
    } catch (error) {
      console.error("Error generating chat completion:", error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  },
}); 