"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3.5L5 6.5M9 3.5L13 6.5M9 3.5V9.5M15 20.5L19 17.5M15 20.5L11 17.5M15 20.5V14.5M5 6.5C5 8.70914 6.79086 10.5 9 10.5C11.2091 10.5 13 8.70914 13 6.5M5 6.5C5 4.29086 6.79086 2.5 9 2.5C11.2091 2.5 13 4.29086 13 6.5M19 17.5C19 15.2909 17.2091 13.5 15 13.5C12.7909 13.5 11 15.2909 11 17.5M19 17.5C19 19.7091 17.2091 21.5 15 21.5C12.7909 21.5 11 19.7091 11 17.5M13 6.5C13 8.70914 14.7909 10.5 17 10.5C19.2091 10.5 21 8.70914 21 6.5C21 4.29086 19.2091 2.5 17 2.5C14.7909 2.5 13 4.29086 13 6.5ZM11 17.5C11 15.2909 9.20914 13.5 7 13.5C4.79086 13.5 3 15.2909 3 17.5C3 19.7091 4.79086 21.5 7 21.5C9.20914 21.5 11 19.7091 11 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Studi</span>
            </div>
            <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">BETA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400">Features</Link>
              <Link href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400">Testimonials</Link>
              <Link href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link>
              <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400">
                      Get Early Access
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-950 shadow-lg">
          <Link 
            href="#features" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#testimonials" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link 
            href="#pricing" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            href="/blog" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
            {isSignedIn ? (
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <Link 
                  href="/dashboard" 
                  className="ml-3 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <SignInButton mode="modal">
                  <button 
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button 
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Early Access
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