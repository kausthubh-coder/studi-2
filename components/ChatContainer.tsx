import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  functionCall?: {
    name: string;
    arguments: any;
    result: any;
  };
}

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isLoading = false 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Welcome to Studi
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Start a conversation with the AI assistant to help with your studies.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
              functionCall={message.functionCall}
            />
          ))}
        </>
      )}
      
      {isLoading && (
        <div className="flex justify-center ml-8 my-4">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4 max-w-md">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}; 