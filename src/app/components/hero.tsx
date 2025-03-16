"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn, Reveal, Typewriter } from './animations';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M100 0H0V100" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          {/* Eyebrow */}
          <FadeIn delay={0.1}>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              AI-Powered Study Assistant
            </span>
          </FadeIn>

          {/* Headline */}
          <Reveal delay={0.2}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Your <span className="text-blue-600 dark:text-blue-500">AI-Powered</span> Study Assistant
            </h1>
          </Reveal>

          {/* Typewriter effect */}
          <Reveal delay={0.3}>
            <div className="mt-4 text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 h-8">
              <Typewriter text="Seamlessly integrated with Canvas" className="inline-block" />
            </div>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Studi helps you master your coursework with AI-powered assistance. Organize notes, get instant answers to questions, and connect directly with your Canvas courses.
            </p>
          </Reveal>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Reveal delay={0.5} direction="up">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Canvas Integration
              </span>
            </Reveal>
            <Reveal delay={0.6} direction="up">
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI-Powered Answers
              </span>
            </Reveal>
            <Reveal delay={0.7} direction="up">
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Smart Note Organization
              </span>
            </Reveal>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Reveal delay={0.8} direction="up">
              <Link href="/auth/signup" className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400">
                Get Early Access
              </Link>
            </Reveal>
            <Reveal delay={0.9} direction="up">
              <Link href="#features" className="rounded-lg bg-gray-100 px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
                Learn More
              </Link>
            </Reveal>
          </div>

          {/* Preview Box */}
          <Reveal delay={1.0}>
            <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:p-8 mx-auto max-w-3xl">
              <div className="flex flex-col space-y-4">
                {/* Chat question */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                      <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Can you help me understand the key concepts from my Canvas lecture on neural networks?</p>
                    </div>
                  </div>
                </div>

                {/* Chat response */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3.5L5 6.5M9 3.5L13 6.5M9 3.5V9.5M15 20.5L19 17.5M15 20.5L11 17.5M15 20.5V14.5M5 6.5C5 8.70914 6.79086 10.5 9 10.5C11.2091 10.5 13 8.70914 13 6.5M5 6.5C5 4.29086 6.79086 2.5 9 2.5C11.2091 2.5 13 4.29086 13 6.5M19 17.5C19 15.2909 17.2091 13.5 15 13.5C12.7909 13.5 11 15.2909 11 17.5M19 17.5C19 19.7091 17.2091 21.5 15 21.5C12.7909 21.5 11 19.7091 11 17.5M13 6.5C13 8.70914 14.7909 10.5 17 10.5C19.2091 10.5 21 8.70914 21 6.5C21 4.29086 19.2091 2.5 17 2.5C14.7909 2.5 13 4.29086 13 6.5ZM11 17.5C11 15.2909 9.20914 13.5 7 13.5C4.79086 13.5 3 15.2909 3 17.5C3 19.7091 4.79086 21.5 7 21.5C9.20914 21.5 11 19.7091 11 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Based on your Canvas lecture from CS301, here are the key concepts of neural networks:</p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Neural networks are computing systems inspired by biological neural networks</li>
                        <li>They consist of input layers, hidden layers, and output layers</li>
                        <li>Each connection between neurons has a weight that adjusts during learning</li>
                        <li>Activation functions determine the output of a neuron</li>
                      </ul>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Would you like me to explain any of these concepts in more detail?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
