"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { AuthCheck } from "../components/auth/auth-check";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Plus, 
  Settings, 
  MessageSquare, 
  Sparkles, 
  User,
  ChevronRight,
  Home
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const chats = useQuery(api.chats.getChats) || [];
  const createChat = useMutation(api.chats.createChat);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get current user from Convex
  const currentUser = useQuery(api.users.getUser);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    
    // Check if onboarding needs to be completed
    if (currentUser && isLoaded && isSignedIn && currentUser.onboardingCompleted === false && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [pathname, currentUser, isLoaded, isSignedIn, router]);
  
  // Function to open Clerk user profile
  const openClerkProfile = () => {
    const userButtonElement = document.querySelector('.cl-userButtonTrigger') as HTMLElement;
    if (userButtonElement) {
      userButtonElement.click();
    }
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
  
  return (
    <>
      <AuthCheck />
      <div className="min-h-screen bg-white flex">
        {/* Mobile menu toggle */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-black border border-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Sidebar */}
        <motion.aside 
          className={`fixed md:relative md:flex md:flex-col border-r border-black w-64 h-screen bg-white z-40 ${
            isMobileMenuOpen ? 'flex flex-col' : 'hidden md:flex md:flex-col'
          }`}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-black">
            <Link href="/dashboard" className="text-xl font-bold text-black">
              Studi
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 pb-1">
              <motion.button 
                onClick={handleNewChat}
                className="flex items-center gap-2 w-full p-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                <span>New Chat</span>
              </motion.button>
            </div>
            
            {/* Navigation Links */}
            <nav className="px-4 pt-1">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  pathname === '/dashboard' ? 'text-black font-medium bg-gray-100' : 'text-black hover:bg-gray-50'
                }`}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </nav>
            
            {/* Chat List */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-black">Recent Chats</h3>
                <ChevronRight size={16} className="text-black" />
              </div>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <Link 
                    key={chat._id} 
                    href={`/chat/${chat._id}`}
                    className={`flex items-center gap-2 p-2 text-sm rounded-md transition-colors ${
                      pathname === `/chat/${chat._id}` ? 'bg-gray-100 text-black font-medium' : 'text-black hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare size={16} />
                    <span className="truncate">{chat.title || "New Chat"}</span>
                  </Link>
                ))}
                
                {chats.length === 0 && (
                  <p className="text-sm text-black py-2 px-2">No chats yet</p>
                )}
              </div>
            </div>
          </div>
          
          {/* User Section */}
          <div className="p-4 border-t border-black">
            <div className="flex items-center gap-3 mb-2">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1 min-w-0 cursor-pointer" onClick={openClerkProfile}>
                <p className="text-sm font-medium truncate text-black">{user?.fullName || user?.username}</p>
                <p className="text-xs text-black truncate hover:underline">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <Link 
              href="/settings" 
              className={`flex items-center gap-2 p-2 text-sm rounded-md transition-colors ${
                pathname.startsWith('/settings') ? 'bg-gray-100 text-black font-medium' : 'text-black hover:bg-gray-50'
              }`}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </div>
        </motion.aside>
        
        {/* Main Content */}
        <div className="flex-1 md:ml-0 ml-0">
          <main className="h-screen overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
} 