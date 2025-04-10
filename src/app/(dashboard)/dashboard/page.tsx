"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  User, 
  Plus,
  BarChart3,
  Clock,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  
  // Only fetch data if authenticated
  const convexUser = useQuery(
    api.users.getUser,
    isLoaded && isSignedIn ? {} : "skip"
  );
  
  const chats = useQuery(
    api.chats.getChats,
    isLoaded && isSignedIn ? {} : "skip"
  ) || [];
  
  const createChat = useMutation(api.chats.createChat);

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
  
  const handleNewChat = async () => {
    try {
      const chatId = await createChat({ title: "New Chat" });
      if (chatId) {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  // If user is not signed in, redirect to sign-in page
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="bg-white shadow-sm border border-black rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Welcome back, {user?.firstName || "User"}!</h1>
            <p className="text-black">Your AI assistant is ready to help</p>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="md:col-span-2">
          <div className="bg-white shadow-sm border border-black rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Chats
              </h2>
              <Link 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNewChat();
                }}
                className="text-sm text-black hover:text-gray-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Link>
            </div>
            
            {chats.length > 0 ? (
              <div className="space-y-3">
                {chats.slice(0, 5).map((chat) => (
                  <Link 
                    key={chat._id} 
                    href={`/chat/${chat._id}`} 
                    className="flex items-center gap-3 p-3 rounded-lg border border-black hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-black truncate">{chat.title || "New Chat"}</p>
                      <p className="text-sm text-black truncate">
                        {new Date(chat._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 text-black" />
                      <span className="text-xs text-black ml-1">
                        {new Date(chat._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <MessageSquare className="h-8 w-8 text-black" />
                </div>
                <p className="text-black mb-4">You haven&apos;t started any chats yet.</p>
                <motion.button 
                  onClick={handleNewChat}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  Start a New Chat
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 


