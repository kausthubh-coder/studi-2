// Types for Convex Agent integration
import { type UIMessage } from "@convex-dev/agent/react";

// Extended UI Message type with our specific properties
export interface StudiMessage extends UIMessage {
  threadId?: string;
  functionCall?: any;
}

// Thread type for our application
export interface StudiThread {
  _id: string;
  title?: string;
  _creationTime: number;
  userId?: string;
}

// Legacy compatibility type - will be phased out
export interface MessageType {
  _id: string;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  _creationTime: number;
  threadId: string;
  functionCall?: string;
}

// Utility function to convert UIMessage to legacy MessageType
export function uiMessageToLegacy(uiMessage: UIMessage, threadId: string): MessageType {
  return {
    _id: uiMessage.key,
    content: uiMessage.content,
    role: uiMessage.role as "user" | "assistant" | "system" | "function",
    _creationTime: Date.now(),
    threadId,
    functionCall: undefined,
  };
}

// Utility function to convert legacy MessageType to UIMessage
export function legacyToUIMessage(message: MessageType): UIMessage {
  return {
    key: message._id,
    content: message.content,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
    order: 0,
    stepOrder: 0,
    status: "completed",
    agentName: message.role === "assistant" ? "Studi" : undefined,
  } as UIMessage;
}