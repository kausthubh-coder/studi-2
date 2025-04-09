"use client";

import { Reveal } from './animations';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white -z-10" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="rounded-3xl bg-white px-6 py-16 sm:p-16 shadow-xl border-2 border-black">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  ✨ Transform your academic experience
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-black">
                  Connect your Canvas account to Studi and experience the power of AI-assisted learning. Get early access today and be among the first to revolutionize your study habits.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-white px-6 py-3 text-base font-medium text-black shadow-sm border-2 border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    🚀 Get Early Access
                  </Link>
                  <Link
                    href="#features"
                    className="text-base font-medium text-black hover:text-gray-700 flex items-center border-b-2 border-black"
                  >
                    👀 Learn more
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
              <div className="rounded-xl bg-white p-6 border-2 border-black">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-black text-black">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-black">Quick Setup</h3>
                <p className="mt-2 text-sm text-black">
                  Connect your Canvas account in seconds and start using Studi immediately with no complex configuration.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="rounded-xl bg-white p-6 border-2 border-black">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-black text-black">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-black">Privacy Focused</h3>
                <p className="mt-2 text-sm text-black">
                  Your data is secure and private. We only access what's needed to provide you with personalized assistance.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.3}>
              <div className="rounded-xl bg-white p-6 border-2 border-black">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-black text-black">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-black">Works Everywhere</h3>
                <p className="mt-2 text-sm text-black">
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


