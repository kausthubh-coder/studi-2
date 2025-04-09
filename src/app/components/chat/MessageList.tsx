"use client";

import { useMemo } from "react";
import { Message } from "./Message";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { MessageType } from "./ChatContainer";

type MessageListProps = {
  messages: MessageType[];
};

export function MessageList({ messages }: MessageListProps) {
  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: MessageType[] }[] = [];
    
    messages.forEach((message) => {
      const date = new Date(message._creationTime).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });
      
      const lastGroup = groups[groups.length - 1];
      
      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ date, messages: [message] });
      }
    });
    
    return groups;
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 relative">
      <AnimatePresence initial={false}>
        {groupedMessages.map((group) => (
          <motion.div 
            key={group.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="sticky top-0 z-10 py-2 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="bg-white px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5"
              >
                <Calendar size={14} className="text-black" />
                <span className="text-xs font-medium text-black">{group.date}</span>
              </motion.div>
            </div>
            
            <div className="space-y-4 px-4">
              {group.messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: Math.min(0.05 * index, 0.3),
                    ease: "easeOut"
                  }}
                >
                  <Message message={message} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 


