"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Plus, Trash } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";

type ThreadType = {
  id: string;
  title: string;
  createdAt: number;
};

type ChatListProps = {
  threads: ThreadType[];
  onDeleteThread: (threadId: string) => void;
};

export function ChatList({ threads, onDeleteThread }: ChatListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const createThread = useAction(api.studyAgent.createThread);
  
  const handleNewChat = async () => {
    // Create a new thread and navigate to it
    try {
      const thread = await createThread({ title: "New Chat" });
      if (thread?.id) {
        router.push(`/chat/${thread.id}`);
      }
    } catch (error) {
      console.error("Failed to create new thread:", error);
    }
  };
  
  const handleDelete = useCallback((e: React.MouseEvent, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Confirm before deleting
    if (confirm("Are you sure you want to delete this chat?")) {
      onDeleteThread(threadId);
    }
  }, [onDeleteThread]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 border-r border-black">
      <div className="p-4">
        <motion.button
          onClick={handleNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </motion.button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-3">
          <h3 className="px-2 text-xs font-medium text-black uppercase tracking-wider">
            Your Chats
          </h3>
          <div className="mt-2 space-y-1">
            {threads.length === 0 ? (
              <div className="p-3 text-center text-sm text-black">
                No chats yet. Start a new conversation!
              </div>
            ) : (
              threads.map((thread) => {
                const isActive = pathname === `/chat/${thread.id}`;
                return (
                  <Link
                    key={thread.id}
                    href={`/chat/${thread.id}`}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      isActive
                        ? "bg-gray-200 text-black font-medium"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <MessageSquare size={16} />
                      <span className="truncate text-sm">
                        {thread.title || "New Chat"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(e, thread.id);
                      }}
                      className="ml-2 p-1 text-black hover:text-red-600 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Delete chat"
                    >
                      <Trash size={16} />
                    </button>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 


