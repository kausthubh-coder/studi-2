"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Smile, Paperclip } from "lucide-react";
import { motion } from "framer-motion";

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
};

export function MessageInput({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Common emoji sets
  const quickEmojis = ["😊", "👍", "🙏", "❤️", "😂", "🎉", "👀", "🤔"];

  // Resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 shadow-md">
      <motion.form 
        onSubmit={handleSubmit} 
        className="flex flex-col space-y-2 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-1.5 mb-1 px-1">
          {quickEmojis.map(emoji => (
            <motion.button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="text-lg opacity-80 hover:opacity-100 focus:outline-none"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {emoji}
            </motion.button>
          ))}
          <div className="flex-1"></div>
          <button
            type="button"
            className="p-1.5 text-black hover:text-indigo-600 rounded-full transition-colors hover:bg-indigo-50"
          >
            <Smile size={18} />
          </button>
          <button
            type="button"
            className="p-1.5 text-black hover:text-indigo-600 rounded-full transition-colors hover:bg-indigo-50"
          >
            <Paperclip size={18} />
          </button>
        </div>
        
        <div className="flex items-end gap-3">
          <motion.div 
            className={`flex-1 relative rounded-xl border ${
              isFocused 
                ? "border-indigo-300 ring-2 ring-indigo-100" 
                : "border-gray-300 hover:border-gray-400"
            } transition-all duration-200 bg-white overflow-hidden shadow-sm`}
            animate={{ boxShadow: isFocused ? "0 2px 8px rgba(99, 102, 241, 0.15)" : "0 1px 2px rgba(0, 0, 0, 0.05)" }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={1}
              className="w-full resize-none py-3 px-4 text-black focus:outline-none bg-transparent"
              disabled={isLoading}
            />
          </motion.div>
          
          <motion.button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`rounded-full p-3.5 flex items-center justify-center ${
              message.trim() && !isLoading
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "bg-gray-100 text-black cursor-not-allowed"
            } focus:outline-none transition-all duration-200`}
            whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
            whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </motion.button>
        </div>
      </motion.form>
      
      <p className="text-xs text-center mt-2 text-black">
        Press Shift + Enter for a new line • Click an emoji to add it
      </p>
    </div>
  );
} 


