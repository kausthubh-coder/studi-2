"use client";

import { Reveal } from './animations';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-950 -z-10" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="rounded-3xl bg-blue-600 px-6 py-16 sm:p-16 shadow-xl dark:bg-blue-900">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Transform your academic experience
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                  Connect your Canvas account to Studi and experience the power of AI-assisted learning. Get early access today and be among the first to revolutionize your study habits.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Get Early Access
                  </Link>
                  <Link
                    href="#features"
                    className="text-base font-medium text-white hover:text-blue-100 flex items-center"
                  >
                    Learn more
                    <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
          
          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0.1}>
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Quick Setup</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Connect your Canvas account in seconds and start using Studi immediately with no complex configuration.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Privacy Focused</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Your data is secure and private. We only access what's needed to provide you with personalized assistance.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.3}>
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Works Everywhere</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Access Studi from any device - desktop, tablet, or mobile - for a seamless learning experience.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
} 