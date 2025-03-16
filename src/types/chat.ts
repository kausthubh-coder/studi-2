/**
 * Types related to chat functionality
 */

import { Id } from "../../convex/_generated/dataModel";

/**
 * Represents a chat message in the system
 */
export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  chatId: Id<"chats">;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  isDeleted?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  functionCall?: string; // JSON string of function call data
}

/**
 * Represents a chat thread
 */
export interface Chat {
  _id: Id<"chats">;
  _creationTime: number;
  title: string;
  userId: string;
  isDeleted?: boolean;
} 