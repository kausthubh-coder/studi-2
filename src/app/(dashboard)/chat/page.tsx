"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { MessageSquare, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Id } from "../../../../convex/_generated/dataModel";

export default function ChatPage() {
  const router = useRouter();
  const chats = useQuery(api.chats.getChats) || [];
  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  // Handle creating a new chat
  const handleNewChat = useCallback(async () => {
    try {
      // Create a new chat with a default title
      const chatId = await createChat({ title: "New Chat" });
      
      // Navigate to the new chat
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
      alert("Failed to create a new chat. Please try again.");
    }
  }, [createChat, router]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Example conversation starters
  const conversationStarters = [
    "Tell me about the history of artificial intelligence",
    "How can I improve my study habits?",
    "Explain quantum computing in simple terms",
    "What are the best strategies for time management?",
    "Help me understand machine learning algorithms",
    "Write a summary of climate change impacts"
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col items-center justify-center p-4 md:p-8"
    >
      <motion.div variants={item} className="max-w-3xl w-full text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Start a new conversation</h1>
        <p className="text-black max-w-xl mx-auto">
          Chat with your AI assistant about anything. Ask questions, get explanations, or just have a conversation.
        </p>
      </motion.div>

      <motion.div variants={item} className="w-full max-w-3xl">
        <button
          onClick={handleNewChat}
          className="w-full py-4 px-6 bg-black text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mb-8"
        >
          <Plus className="h-5 w-5" />
          New Conversation
        </button>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 text-center">Try asking about...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conversationStarters.map((starter, index) => (
              <motion.div
                key={index}
                variants={item}
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => {
                    handleNewChat().then(async () => {
                      // We would ideally want to pre-populate the new chat with this starter question
                      // This would require additional functionality in the API
                    });
                  }}
                  className="w-full text-left p-4 border border-black rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 mt-0.5 text-black" />
                    <span className="font-medium">{starter}</span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {chats.length > 0 && (
          <motion.div variants={item} className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium mb-4">Recent conversations</h2>
            <div className="space-y-3">
              {chats.slice(0, 3).map((chat) => (
                <motion.div
                  key={chat._id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button
                    onClick={() => router.push(`/chat/${chat._id}`)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chat.title || "New Chat"}</p>
                        <p className="text-sm text-black truncate">
                          {new Date(chat._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
} 