"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { 
  ArrowUp, 
  ArrowLeft, 
  Loader2, 
  Edit,
  Trash,
  Check,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Message } from "./Message";

// Define the Message type locally
export interface MessageType {
  _id: string;
  content: string;
  role: "user" | "assistant" | "system" | "function";
  _creationTime: number;
  chatId: string;
  functionCall?: string;
}

type ChatContainerProps = {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  title?: string;
  chatId?: string;
  onUpdateTitle?: (newTitle: string) => void;
  onDeleteChat?: () => void;
};

export function ChatContainer({ 
  messages, 
  isLoading, 
  onSendMessage,
  title,
  onUpdateTitle,
  onDeleteChat
}: ChatContainerProps) {
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || "New Chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Update edited title when title prop changes
  useEffect(() => {
    if (title) {
      setEditedTitle(title);
    }
  }, [title]);
  
  // Custom hooks for auto-resizing textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to calculate the right scrollHeight
    textarea.style.height = "60px";
    
    // Calculate new height (with max height)
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, []);
  
  // Handle sending message
  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;
    
    console.log('Sending message, { chatId, contentLength: message.length }, chat');
    onSendMessage(message.trim());
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px";
    }
  };
  
  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Start editing title
  const startEditingTitle = () => {
    setIsEditing(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 10);
  };

  // Save edited title
  const saveEditedTitle = () => {
    if (onUpdateTitle && editedTitle.trim()) {
      console.log('Updating chat title, { chatId, newTitle: editedTitle }, chat');
      onUpdateTitle(editedTitle.trim());
    }
    setIsEditing(false);
  };

  // Cancel title editing
  const cancelEditingTitle = () => {
    setEditedTitle(title || "New Chat");
    setIsEditing(false);
  };

  // Handle title input key press
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEditedTitle();
    } else if (e.key === "Escape") {
      cancelEditingTitle();
    }
  };

  // Handle chat deletion
  const handleDeleteChat = () => {
    if (confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      console.log('Deleting chat, { chatId }, chat');
      onDeleteChat?.();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Adjust textarea height on mount
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px";
    }
  }, [messages]);

  // Format messages for our components
  const formattedMessages = messages.map(msg => ({
    id: msg._id,
    content: msg.content,
    role: msg.role,
    timestamp: new Date(msg._creationTime),
    originalChatId: msg.chatId, // Keep the original chatId for reference
    functionCall: msg.functionCall ? JSON.parse(msg.functionCall) : undefined
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <div className="flex items-center">
          <motion.button 
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 text-black" />
          </motion.button>
          
          {isEditing ? (
            <div className="ml-2 flex items-center">
              <input
                ref={titleInputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                className="text-xl font-semibold text-black bg-white border-b border-black px-1 py-0.5 focus:outline-none"
                autoFocus
              />
              <motion.button 
                onClick={saveEditedTitle}
                className="p-1 ml-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Check className="h-4 w-4 text-green-600" />
              </motion.button>
              <motion.button 
                onClick={cancelEditingTitle}
                className="p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4 text-red-600" />
              </motion.button>
            </div>
          ) : (
            <h1 className="ml-2 text-xl font-semibold text-black">{title || "New Chat"}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing && onUpdateTitle && (
            <motion.button
              onClick={startEditingTitle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 text-black"
              title="Edit chat title"
            >
              <Edit className="h-4 w-4" />
            </motion.button>
          )}
          
          {onDeleteChat && (
            <motion.button
              onClick={handleDeleteChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 text-black"
              title="Delete chat"
            >
              <Trash className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          {formattedMessages.length === 0 ? (
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold text-black">
                What would you like to know?
              </h1>
            </div>
          ) : (
            <div className="space-y-4">
              {formattedMessages.map((msg) => (
                <Message
                  key={msg.id}
                  message={{
                    _id: msg.id,
                    content: msg.content,
                    role: msg.role,
                    _creationTime: msg.timestamp.getTime(),
                    chatId: msg.originalChatId,
                    functionCall: msg.functionCall ? JSON.stringify(msg.functionCall) : undefined
                  }}
                />
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-center ml-8 my-4">
              <div className="animate-pulse bg-white border border-black rounded-lg p-4 max-w-md shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-black p-4 bg-white">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full border border-black rounded-lg p-3 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
            style={{ height: "60px", maxHeight: "200px" }}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 


