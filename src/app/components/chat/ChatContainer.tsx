"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { MessageList } from "./MessageList";
import { Message } from "@/types/chat";
import { 
  ArrowUp, 
  Paperclip, 
  Plus, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  Loader2, 
  Image,
  FileUp,
  BookOpen,
  Code,
  FileQuestion,
  Edit,
  Trash,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type ChatContainerProps = {
  messages: Message[];
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
  chatId,
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

  // Action buttons for suggestions
  const ActionButton = ({ icon, label, onClick }: { 
    icon: React.ReactNode; 
    label: string;
    onClick: () => void;
  }) => (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-full border border-black text-black transition-colors"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </motion.button>
  );
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black">
        <div className="flex items-center">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-black" />
          </button>
          
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
              <button 
                onClick={saveEditedTitle}
                className="p-1 ml-1 rounded-full hover:bg-gray-100"
              >
                <Check className="h-4 w-4 text-green-600" />
              </button>
              <button 
                onClick={cancelEditingTitle}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold text-black">
                What would you like to know?
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <ActionButton
                  icon={<MessageSquare className="w-4 h-4" />}
                  label="How can you help me with my studies?"
                  onClick={() => onSendMessage("How can you help me with my studies?")}
                />
                <ActionButton
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Learning technique suggestions"
                  onClick={() => onSendMessage("What are some effective learning techniques?")}
                />
                <ActionButton
                  icon={<FileQuestion className="w-4 h-4" />}
                  label="Answer my homework questions"
                  onClick={() => onSendMessage("Can you help me with homework questions?")}
                />
                <ActionButton
                  icon={<Code className="w-4 h-4" />}
                  label="Help me with programming"
                  onClick={() => onSendMessage("How can you help me with programming assignments?")}
                />
                <ActionButton
                  icon={<Sparkles className="w-4 h-4" />}
                  label="Make a study plan"
                  onClick={() => onSendMessage("Help me create a study plan for exams")}
                />
              </div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
      
      {/* Input area */}
      <div className="px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-xl border border-black">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full px-4 py-3 resize-none bg-transparent border-none text-black text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[60px]"
              style={{ overflow: "hidden" }}
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between p-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Paperclip className="w-4 h-4 text-black" />
                </motion.button>
              </div>
              
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Studi is thinking...
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
                  whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors border flex items-center justify-between gap-1 ${
                    message.trim() && !isLoading
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span className="sr-only">Send</span>
                </motion.button>
              </div>
            </div>
          </div>
          
          {messages.length === 0 && (
            <p className="text-xs text-center mt-2 text-black">
              Press Enter to send • Shift + Enter for a new line
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 