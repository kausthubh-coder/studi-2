"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { ChatContainer, MessageType } from "@/app/components/chat/ChatContainer";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

// We'll use MessageType from ChatContainer instead of defining our own

export default function ChatDetailPage() {
  const { isLoaded, isSignedIn } = useUser();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Get threadId from params (using the same URL structure but treating it as threadId)
  const threadId = params?.id ? (params.id as string) : null;
  
  // Get thread messages using the new Agent system
  const messagesResult = useQuery(
    api.studyAgent.getThreadMessages, 
    isLoaded && isSignedIn && threadId ? { threadId } : "skip"
  ) || [];
  
  // Send message using the new Agent system
  const sendMessage = useAction(api.studyAgent.sendMessage);
  
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

  // Handle updating thread title (placeholder for now)
  const handleUpdateTitle = async (newTitle: string) => {
    // TODO: Implement thread title update when Agent component supports it
    console.log("Update title:", newTitle);
  };

  // Handle deleting thread (placeholder for now)
  const handleDeleteChat = async () => {
    // TODO: Implement thread deletion when Agent component supports it
    router.push("/dashboard");
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

  // Show the chat interface (even if threadId is null - we'll handle it in the send message)
  try {
    return (
      <ChatContainer 
        messages={messagesResult as MessageType[]} 
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        title={threadId || "New Chat"}
        chatId={threadId || undefined}
        onUpdateTitle={handleUpdateTitle}
        onDeleteChat={handleDeleteChat}
      />
    );
  } catch (error) {
    setError(error as Error);
    
    // Show error message
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
} 