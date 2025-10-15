"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
// Removed Agent React hook fallback to maintain compatibility across versions

// Basic message type for ChatContainer compatibility
export interface MessageType {
  _id: string;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  _creationTime: number;
  threadId: string;
  functionCall?: string;
}

// Simple ChatContainer component for now
function ChatContainer({ 
  messages, 
  isLoading, 
  onSendMessage, 
  title
}: {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  title: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-black">{title}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(message._creationTime).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ChatDetailPage() {
  const { isLoaded, isSignedIn } = useUser();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const threadId = params?.id ? (params.id as string) : null;
  
  // Fallback: fetch messages directly via query (no Agent React hook)
  const messagesResult = useQuery(
    api.studyAgent.listThreadMessages,
    threadId && isLoaded && isSignedIn
      ? { threadId, paginationOpts: { cursor: null, numItems: 50 } }
      : "skip"
  );
  
  // Format messages for ChatContainer compatibility
  const formattedMessages: MessageType[] = (messagesResult?.page ?? []).map((msg: {
    _id?: string;
    content?: string;
    role?: string;
    _creationTime?: number;
  }) => ({
    _id: msg._id || "temp-id",
    content: msg.content || "",
    role: (msg.role as "user" | "assistant" | "system" | "function") || "assistant",
    _creationTime: msg._creationTime || Date.now(),
    threadId: threadId || "",
  }));

  // Optionally: display latest stream chunk as an assistant message while streaming
  // const streamingText = messagesResult?.streams?.text ?? "";
  
  // Send message using the Agent system
  const sendMessage = useMutation(api.studyAgent.sendMessage);
  
  // Create thread action
  const createThread = useAction(api.studyAgent.createThread);

  // Handle authentication state
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);
  
  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!threadId) {
      // If no threadId, create a new thread first
      try {
        setIsLoading(true);
        const newThread = await createThread({
          title: content.length > 30 ? content.substring(0, 30) + "..." : content
        });
        
        // Redirect to the new thread
        router.push(`/chat/${newThread.id}`);
        return;
      } catch (error) {
        console.error("Failed to create thread:", error);
        setError(error as Error);
        setIsLoading(false);
        return;
      }
    }
    
    try {
      setIsLoading(true);
      await sendMessage({
        threadId,
        message: content,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to handle errors
  useEffect(() => {
    if (error) {
      console.error("Error in chat page:", error);
      if (error.message?.includes("Unauthorized")) {
        router.push("/sign-in");
      }
    }
  }, [error, router]);

  // If not loaded or not authenticated yet, show loading state
  if (!isLoaded || (isLoaded && !isSignedIn)) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-800 mb-4">Unable to load chat</h2>
          <p className="text-gray-700 mb-4">
            {error instanceof Error ? error.message : "There was a problem loading this chat. You may not have permission to view it."}
          </p>
          <button 
            onClick={() => router.push("/dashboard")} 
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show the chat interface
  return (
    <ChatContainer 
      messages={formattedMessages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      title={threadId || "New Chat"}
    />
  );
}