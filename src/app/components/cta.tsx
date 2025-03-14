"use client";

import { FadeIn } from './animations';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/5 -z-10" />
      
      {/* Background circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-black/10 -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-black/10 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 border border-black p-8 md:p-12 lg:p-16 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">Experience intelligent conversations</h2>
              <p className="text-lg md:text-xl text-black mb-10 max-w-2xl mx-auto">
                Join Studi today and discover a new way to interact with AI. Our clean, minimal design and smart features make chatting with AI more productive and enjoyable.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 bg-black text-white rounded-full font-medium shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Sign Up Free
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-black rounded-full font-medium hover:bg-black/5 transition-colors text-black"
                  >
                    Go to Dashboard
                  </Link>
                </motion.div>
              </div>
              
              <p className="mt-6 text-sm text-black">No credit card required. Start chatting immediately.</p>
              
              {/* Feature list */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-black text-left">
                  <h3 className="font-semibold text-black mb-2">Auto Chat Naming</h3>
                  <p className="text-sm text-black">Smart conversation titles based on context for better organization.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-black text-left">
                  <h3 className="font-semibold text-black mb-2">Elegant Design</h3>
                  <p className="text-sm text-black">Clean, minimal interface for a distraction-free experience.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-black text-left">
                  <h3 className="font-semibold text-black mb-2">Micro-interactions</h3>
                  <p className="text-sm text-black">Delightful animations and responsive feedback for a better experience.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
} 