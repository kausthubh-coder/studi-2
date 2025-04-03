"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ChatContainer } from "@/app/components/chat/ChatContainer";
import { Loader2 } from "lucide-react";
import { Message } from "@/types/chat";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Safely get chatId from params
  const chatIdString = params?.id ? (params.id as string) : null;
  
  // Convert string chatId to Convex Id when available
  const convexChatId = chatIdString as unknown as Id<"chats"> | null;
  
  // Get chat details
  const chat = useQuery(
    api.chats.getChat, 
    convexChatId ? { chatId: convexChatId } : "skip"
  );
  
  // Get messages for this chat
  const messagesResult = useQuery(
    api.messages.getMessages, 
    convexChatId ? { chatId: convexChatId } : "skip"
  ) || [];
  
  // Send message mutation
  const sendMessage = useMutation(api.messages.sendMessage);
  
  // Update chat mutation
  const updateChat = useMutation(api.chats.updateChat);
  
  // Delete chat mutation
  const deleteChat = useMutation(api.chats.deleteChat);
  
  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!convexChatId) return;
    
    try {
      setIsLoading(true);
      await sendMessage({
        chatId: convexChatId,
        content,
      });
      
      // If this is the first message and the chat doesn't have a title yet, 
      // set a title based on the content of the first message
      if (messagesResult.length === 0 && (!chat?.title || chat.title === "New Chat")) {
        // Create a title from the first message (truncate if too long)
        const autoTitle = content.length > 30 
          ? content.substring(0, 30) + "..." 
          : content;
          
        await updateChat({
          id: convexChatId,
          title: autoTitle
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating chat title
  const handleUpdateTitle = async (newTitle: string) => {
    if (!convexChatId) return;
    
    try {
      await updateChat({
        id: convexChatId,
        title: newTitle
      });
    } catch (error) {
      console.error("Failed to update chat title:", error);
    }
  };

  // Handle deleting chat
  const handleDeleteChat = async () => {
    if (!convexChatId) return;
    
    try {
      await deleteChat({
        chatId: convexChatId
      });
      router.push("/home");
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // If chatId is not available or loading, show loading state
  if (!chatIdString || !chat) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  // Add a try-catch block around the chat loading and display a friendly error if it fails
  try {
    return (
      <ChatContainer 
        messages={messagesResult as Message[]} 
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        title={chat.title}
        chatId={convexChatId ? convexChatId.toString() : undefined}
        onUpdateTitle={handleUpdateTitle}
        onDeleteChat={handleDeleteChat}
      />
    );
  } catch (error: any) {
    // If there's an unauthorized error, redirect to dashboard
    useEffect(() => {
      console.error("Error in chat page:", error);
      if (error.message?.includes("Unauthorized")) {
        router.push("/dashboard");
      }
    }, [error, router]);
    
    // Show error message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-800 mb-4">Unable to load chat</h2>
          <p className="text-gray-700 mb-4">
            {error.message || "There was a problem loading this chat. You may not have permission to view it."}
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