import React from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface FunctionCall {
  name: string;
  arguments: any;
  result: any;
}

interface ChatMessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  functionCall?: FunctionCall;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp,
  functionCall,
}) => {
  // Function to render function call details
  const renderFunctionCallDetails = () => {
    if (!functionCall) return null;
    
    return (
      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-xs">
        <div className="font-semibold text-indigo-600 dark:text-indigo-400">
          Function called: {functionCall.name}
        </div>
        <div className="mt-1">
          <div className="font-medium">Arguments:</div>
          <pre className="p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
            {JSON.stringify(functionCall.arguments, null, 2)}
          </pre>
        </div>
        <div className="mt-1">
          <div className="font-medium">Result:</div>
          <pre className="p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
            {JSON.stringify(functionCall.result, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`mb-4 ${
        role === 'user' 
          ? 'mr-8 flex justify-start' 
          : 'ml-8 flex justify-center'
      }`}
    >
      <div 
        className={`relative ${
          role === 'user' 
            ? 'bg-blue-100 dark:bg-blue-900 rounded-lg p-4' 
            : 'prose dark:prose-invert max-w-3xl'
        }`}
      >
        {role === 'user' ? (
          <p className="text-gray-800 dark:text-gray-200">{content}</p>
        ) : (
          <div className="prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
            {functionCall && renderFunctionCallDetails()}
          </div>
        )}
        <div className={`text-xs text-gray-500 mt-1 ${
          role === 'user' ? 'text-right' : 'text-center'
        }`}>
          {format(timestamp, 'h:mm a')}
        </div>
      </div>
    </div>
  );
}; 