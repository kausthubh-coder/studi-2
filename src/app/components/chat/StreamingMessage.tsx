"use client";

import { useState } from "react";
import { Copy, Check, Heart, ChevronDown, ChevronRight, Brain, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from 'react-markdown';
import { useSmoothText, type UIMessage } from "@convex-dev/agent/react";

type StreamingMessageProps = {
  message: UIMessage;
};

export function StreamingMessage({ message }: StreamingMessageProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [expandedFunction, setExpandedFunction] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState(false);
  
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming";
  
  // Use smooth text for streaming messages
  const [visibleText] = useSmoothText(message.content, {
    startStreaming: isStreaming,
  });

  // Parse function call data from parts if present
  const toolCallParts = message.parts?.filter(part => part.type === "toolCall") || [];
  const toolResultParts = message.parts?.filter(part => part.type === "toolResult") || [];
  
  // Check if this is a ReAct agent response (legacy support)
  const isAgentResponse = message.agentName === "Studi" && toolCallParts.length > 0;
  
  const formattedTime = formatDistanceToNow(new Date(), { addSuffix: true });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFunctionDetails = () => {
    setExpandedFunction(!expandedFunction);
  };

  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-center'} w-full`}>
      <div
        className={`relative rounded-lg ${
          isUser
            ? 'bg-white border border-black shadow-sm p-4 max-w-[75%]' 
            : 'bg-white p-4 max-w-[75%]'
        }`}
      >
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1.5 justify-end">
              <span className="text-xs text-gray-500 opacity-80">
                {formattedTime}
              </span>
              {isStreaming && (
                <span className="ml-2 text-xs text-blue-500 opacity-80">
                  Streaming...
                </span>
              )}
            </div>
            
            {isUser ? (
              <div className="prose prose-sm max-w-none break-words whitespace-pre-wrap text-black">
                {message.content}
              </div>
            ) : (
              <div className="prose-sm sm:prose-base lg:prose-lg max-w-none text-black">
                <ReactMarkdown>{visibleText}</ReactMarkdown>
              </div>
            )}
            
            {/* Render tool calls if present */}
            {toolCallParts.length > 0 && (
              <div className="mt-3 border border-indigo-200 rounded-lg text-sm overflow-hidden bg-indigo-50">
                <motion.button
                  onClick={() => setExpandedReasoning(!expandedReasoning)}
                  className="w-full flex items-center justify-between p-3 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="font-semibold flex items-center">
                    <Brain className="mr-2" size={16} />
                    <span>Tool Calls ({toolCallParts.length})</span>
                  </div>
                  {expandedReasoning ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </motion.button>
                
                <AnimatePresence>
                  {expandedReasoning && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-indigo-200 bg-white">
                        <div className="space-y-3">
                          {toolCallParts.map((toolCall, index) => {
                            const toolResult = toolResultParts[index];
                            return (
                              <div key={index} className="border-l-4 border-indigo-200 pl-3 py-2">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-medium text-indigo-600">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="mb-1">
                                      <div className="flex items-center gap-1 mb-1">
                                        <Zap className="w-3 h-3 text-purple-500" />
                                        <span className="text-xs font-medium text-gray-700">Tool:</span>
                                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                          {(toolCall as any)?.toolName || 'Unknown'}
                                        </span>
                                      </div>
                                      {toolResult && (
                                        <div className="mt-2">
                                          <div className="text-xs font-medium text-gray-700 mb-1">Result:</div>
                                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                            {JSON.stringify((toolResult as any)?.result, null, 2)}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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