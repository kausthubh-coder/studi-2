"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Use useEffect to handle initial client-side rendering
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR or initial load, render a simplified version
  if (isLoading || !isClient) {
    return (
      <header 
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
          scrolled 
            ? 'bg-white backdrop-blur-md shadow-md border-b border-black' 
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl">📚</span>
              <span className="ml-2 text-xl font-bold text-black">Studi</span>
              <span className="ml-2 inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-black ring-1 ring-inset ring-black">BETA</span>
            </div>

            {/* Loading navigation placeholder */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-8 text-sm font-medium text-black">
                <div className="hover:text-gray-700 border-b border-black">✨ Features</div>
                <div className="hover:text-gray-700 border-b border-black">💬 Testimonials</div>
                <div className="hover:text-gray-700 border-b border-black">💰 Pricing</div>
                <div className="hover:text-gray-700 border-b border-black">✏️ Blog</div>
              </div>
            </nav>

            {/* Mobile menu button placeholder */}
            <div className="md:hidden p-2 h-10 w-10"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled 
          ? 'bg-white backdrop-blur-md shadow-md border-b border-black' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <span className="text-2xl">📚</span>
              <span className="ml-2 text-xl font-bold text-black">Studi</span>
            </div>
            <span className="ml-2 inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-black ring-1 ring-inset ring-black">BETA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8 text-sm font-medium text-black">
              <Link href="#features" className="hover:text-gray-700 border-b border-black">✨ Features</Link>
              <Link href="#testimonials" className="hover:text-gray-700 border-b border-black">💬 Testimonials</Link>
              <Link href="#pricing" className="hover:text-gray-700 border-b border-black">💰 Pricing</Link>
              <Link href="/blog" className="hover:text-gray-700 border-b border-black">✏️ Blog</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isSignedIn || isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-sm font-medium text-black hover:text-gray-700 border-b border-black"
                  >
                    📊 Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-black hover:text-gray-700 border-b border-black">
                      🔑 Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-100 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                      🚀 Get Early Access
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-lg border-t border-b border-black">
          <Link 
            href="#features" 
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-100 border-b border-black"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✨ Features
          </Link>
          <Link 
            href="#testimonials" 
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-100 border-b border-black"
            onClick={() => setMobileMenuOpen(false)}
          >
            💬 Testimonials
          </Link>
          <Link 
            href="#pricing" 
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-100 border-b border-black"
            onClick={() => setMobileMenuOpen(false)}
          >
            💰 Pricing
          </Link>
          <Link 
            href="/blog" 
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-100 border-b border-black"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✏️ Blog
          </Link>
          
          <div className="pt-4 pb-3 border-t border-black">
            {isSignedIn || isAuthenticated ? (
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <Link 
                  href="/dashboard" 
                  className="ml-3 block px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-700 hover:bg-gray-100 border-b border-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <SignInButton mode="modal">
                  <button 
                    className="w-full flex justify-center items-center px-4 py-2 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🔑 Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button 
                    className="w-full flex justify-center items-center px-4 py-2 border-2 border-black text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🚀 Get Early Access
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
} 


