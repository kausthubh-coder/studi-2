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
      router.push("/dashboard");
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
} 