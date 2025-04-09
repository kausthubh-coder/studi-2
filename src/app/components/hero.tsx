"use client";

import Link from 'next/link';
import { FadeIn, Reveal, Typewriter } from './animations';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M100 0H0V100" fill="none" stroke="black" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          {/* Eyebrow */}
          <FadeIn delay={0.1}>
            <span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-medium text-black border border-black">
              🧠 AI-Powered Study Assistant
            </span>
          </FadeIn>

          {/* Headline */}
          <Reveal delay={0.2}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
              Your <span className="text-black border-b-2 border-black">AI-Powered</span> Study Assistant
            </h1>
          </Reveal>

          {/* Typewriter effect */}
          <Reveal delay={0.3}>
            <div className="mt-4 text-xl md:text-2xl font-medium text-black h-8">
              <Typewriter text="✨ Seamlessly integrated with Canvas" className="inline-block" />
            </div>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black">
              Studi helps you master your coursework with AI-powered assistance. Organize notes, get instant answers to questions, and connect directly with your Canvas courses.
            </p>
          </Reveal>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Reveal delay={0.5} direction="up">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-black border border-black">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                🎓 Canvas Integration
              </span>
            </Reveal>
            <Reveal delay={0.6} direction="up">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-black border border-black">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                🤖 AI-Powered Answers
              </span>
            </Reveal>
            <Reveal delay={0.7} direction="up">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-black border border-black">
                <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                📝 Smart Note Organization
              </span>
            </Reveal>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Reveal delay={0.8} direction="up">
              <Link href="/auth/signup" className="rounded-lg bg-white px-6 py-3 text-base font-medium text-black shadow-sm border-2 border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                🚀 Get Early Access
              </Link>
            </Reveal>
            <Reveal delay={0.9} direction="up">
              <Link href="#features" className="rounded-lg bg-white px-6 py-3 text-base font-medium text-black shadow-sm border border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                👀 Learn More
              </Link>
            </Reveal>
          </div>

          {/* Preview Box */}
          <Reveal delay={1.0}>
            <div className="mt-16 rounded-2xl border-2 border-black bg-white p-4 shadow-lg sm:p-6 lg:p-8 mx-auto max-w-3xl">
              <div className="flex flex-col space-y-4">
                {/* Chat question */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-black">
                      <span className="text-lg">👨‍🎓</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-lg bg-white p-4 border border-black">
                      <p className="text-sm text-black">Can you help me understand the key concepts from my Canvas lecture on neural networks?</p>
                    </div>
                  </div>
                </div>

                {/* Chat response */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-black">
                      <span className="text-lg">🤖</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-lg bg-white p-4 border border-black">
                      <p className="text-sm text-black">Based on your Canvas lecture from CS301, here are the key concepts of neural networks:</p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-black space-y-1">
                        <li>Neural networks are computing systems inspired by biological neural networks 🧠</li>
                        <li>They consist of input layers, hidden layers, and output layers 🔄</li>
                        <li>Each connection between neurons has a weight that adjusts during learning ⚖️</li>
                        <li>Activation functions determine the output of a neuron ⚡</li>
                      </ul>
                      <p className="mt-2 text-sm text-black">Would you like me to explain any of these concepts in more detail?</p>
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


