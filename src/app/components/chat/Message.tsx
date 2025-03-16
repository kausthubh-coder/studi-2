"use client";

import { useState } from "react";
import { UserCircle, Bot, Copy, Check, Heart, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message as MessageType } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from 'react-markdown';
import { logger } from "../../../utils/logger";

type MessageProps = {
  message: MessageType;
};

export function Message({ message }: MessageProps) {
  logger.debug("Rendering message", { 
    role: message.role, 
    hasFunction: !!message.functionCall,
    chatId: message.chatId
  });

  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [expandedFunction, setExpandedFunction] = useState(false);
  const isUser = message.role === "user";

  // Parse function call data if present
  const functionCall = message.functionCall ? JSON.parse(message.functionCall) : null;
  
  const formattedTime = formatDistanceToNow(new Date(message._creationTime), {
    addSuffix: true,
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFunctionDetails = () => {
    setExpandedFunction(!expandedFunction);
  };

  return (
    <div
      className={`mb-4 ${
        isUser 
          ? 'mr-0 ml-auto flex justify-end' 
          : 'ml-0 mr-auto flex justify-start'
      }`}
    >
      <div
        className={`relative rounded-lg ${
          isUser
            ? 'bg-white border border-black shadow-sm p-4 max-w-[85%]' 
            : 'bg-white p-4 max-w-3xl'
        }`}
      >
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
          {isUser && (
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                <UserCircle size={20} />
              </div>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className={`flex items-center mb-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <span className="font-semibold text-black">
                {isUser ? "You" : "Studi"}
              </span>
              <span className="text-xs text-gray-500 ml-2 opacity-80">
                {formattedTime}
              </span>
            </div>
            
            {isUser ? (
              <div className="prose prose-sm max-w-none break-words whitespace-pre-wrap text-black">
                {message.content}
              </div>
            ) : (
              <div className="prose-sm sm:prose-base lg:prose-lg max-w-none text-black">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
            
            {/* Render function call result if present - collapsible version */}
            {functionCall && (
              <div className="mt-2 border border-black rounded-md text-xs overflow-hidden">
                <motion.button
                  onClick={toggleFunctionDetails}
                  className="w-full flex items-center justify-between p-2 bg-white text-black hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="font-semibold flex items-center">
                    <span className="mr-2">Function called:</span> 
                    <span className="text-blue-600">{functionCall.name}</span>
                  </div>
                  {expandedFunction ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </motion.button>
                
                <AnimatePresence>
                  {expandedFunction && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 border-t border-black bg-white">
                        <div className="mt-1">
                          <div className="font-medium text-black">Arguments:</div>
                          <pre className="p-2 bg-white border border-black rounded overflow-x-auto text-black">
                            {JSON.stringify(functionCall.arguments, null, 2)}
                          </pre>
                        </div>
                        <div className="mt-1">
                          <div className="font-medium text-black">Result:</div>
                          <pre className="p-2 bg-white border border-black rounded overflow-x-auto text-black">
                            {JSON.stringify(functionCall.result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <div className={`flex mt-2 gap-2 ${isUser ? 'justify-start' : 'justify-end'}`}>
              {!isUser && ( 
                <motion.button
                  onClick={copyToClipboard}
                  className="text-black hover:bg-gray-100 p-1 rounded transition-colors border border-gray-200"
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
              )}
              
              {!isUser && ( 
                <motion.button
                  onClick={() => setLiked(!liked)}
                  className={`p-1 rounded transition-colors border border-gray-200 ${
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
    </div>
  );
} 