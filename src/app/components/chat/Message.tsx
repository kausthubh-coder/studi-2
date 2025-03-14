"use client";

import { useState } from "react";
import { UserCircle, Bot, Copy, Check, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Message as MessageType } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

type MessageProps = {
  message: MessageType;
};

export function Message({ message }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const isUser = message.role === "user";
  
  const formattedTime = formatDistanceToNow(new Date(message._creationTime), {
    addSuffix: true,
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to detect and render emojis in text
  const renderMessageContent = (content: string) => {
    // Simple regex to find emoji patterns
    const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
    
    // Split the content by emojis and map through
    const parts = content.split(emojiRegex);
    const emojis = content.match(emojiRegex) || [];
    
    // Rebuild with larger emojis
    let result = [];
    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i]);
      if (i < emojis.length) {
        result.push(
          <span key={i} className="text-xl inline-block align-middle mx-0.5">
            {emojis[i]}
          </span>
        );
      }
    }
    
    return result;
  };

  return (
    <div className={`px-4 py-5 ${isUser ? "bg-gray-50" : "bg-white"} ${
      isUser ? "ml-auto" : ""
    } rounded-lg max-w-[85%] ${isUser ? "" : "border-l-2 border-black"}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
              <UserCircle size={20} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1.5">
            <span className="font-semibold text-black">
              {isUser ? "You" : "Studi"}
            </span>
            <span className="text-xs text-black ml-2 opacity-80">
              {formattedTime}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none break-words whitespace-pre-wrap text-black">
            {renderMessageContent(message.content)}
          </div>
          
          <div className="flex mt-2 gap-2">
            <motion.button
              onClick={copyToClipboard}
              className="text-black hover:bg-gray-100 p-1 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Copy to clipboard"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </motion.button>
            
            {!isUser && ( 
              <motion.button
                onClick={() => setLiked(!liked)}
                className={`p-1 rounded transition-colors ${
                  liked 
                    ? "text-red-500" 
                    : "text-black hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={liked ? "Remove reaction" : "React with ❤️"}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 