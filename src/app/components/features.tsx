"use client";

import { useState } from 'react';
import { FadeIn, Reveal } from './animations';
import { ReactElement } from 'react';

// Note: You would typically use real icons from an icon library or SVG files
const FeatureIcons: Record<string, () => ReactElement> = {
  Canvas: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21L9 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  AI: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Homework: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M12 7V13L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Summarization: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M4 6H20M4 10H20M4 14H12M4 18H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  StudyPlans: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Grades: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M16 8.00002L18 10M19.5 6.5L18 8.00002M19.5 6.5L18 5M18 5L16.5 3.5M18 5L19.5 3.5M7 13H12M7 17H16M7 9H9M8 21H16C18.2091 21 20 19.2091 20 17V7C20 4.79086 18.2091 3 16 3H8C5.79086 3 4 4.79086 4 7V17C4 19.2091 5.79086 21 8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// Feature data
const features = [
  {
    id: 'canvas',
    name: 'Canvas Integration',
    icon: 'Canvas',
    description: 'Seamlessly connect with your Canvas LMS account to access courses, assignments, and materials in one place.',
    details: 'Studi automatically syncs with your Canvas account, importing your courses, assignments, due dates, and learning materials. No more switching between platforms or missing important deadlines.'
  },
  {
    id: 'ai-assistant',
    name: 'AI-Powered Answers',
    icon: 'AI',
    description: 'Get instant, accurate answers to your questions about course material, assignments, and more.',
    details: 'Our advanced AI understands your course content and can provide explanations, summaries, and answers tailored to your specific classes. It's like having a tutor available 24/7.'
  },
  {
    id: 'homework-help',
    name: 'Homework Assistance',
    icon: 'Homework',
    description: 'Receive step-by-step guidance on solving problems and completing assignments.',
    details: 'When you're stuck on a homework problem, Studi can break it down into manageable steps, provide hints, and guide you through the solution process without simply giving you the answer.'
  },
  {
    id: 'summarization',
    name: 'Content Summarization',
    icon: 'Summarization',
    description: 'Transform lengthy lectures and readings into concise, easy-to-understand summaries.',
    details: 'Upload lecture notes, readings, or recorded lectures, and Studi will generate comprehensive summaries highlighting the key points, making review and study sessions more efficient.'
  },
  {
    id: 'study-plans',
    name: 'Personalized Study Plans',
    icon: 'StudyPlans',
    description: 'Get customized study schedules based on your courses, assignments, and learning style.',
    details: 'Studi analyzes your course load, upcoming assignments, and past performance to create optimized study plans that help you prepare effectively and reduce last-minute cramming.'
  },
  {
    id: 'grade-tracking',
    name: 'Grade Tracking & Analysis',
    icon: 'Grades',
    description: 'Monitor your academic performance and receive insights to improve your grades.',
    details: 'Keep track of your grades across all courses, identify trends, and get personalized recommendations on where to focus your efforts to improve your academic performance.'
  }
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Features</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything You Need to Excel in Your Studies</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Studi combines powerful Canvas integration with AI assistance to transform how you learn and study.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
          {/* Feature tabs */}
          <div className="flex flex-col space-y-4">
            {features.map((feature, index) => (
              <Reveal key={feature.id} delay={0.1 * index} direction="left">
                <button
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-start p-4 text-left rounded-lg transition-all ${
                    activeFeature === feature.id
                      ? 'bg-white dark:bg-gray-800 shadow-md'
                      : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg ${
                    activeFeature === feature.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {FeatureIcons[feature.icon]()}
                  </div>
                  <div className="ml-4">
                    <p className={`text-lg font-medium ${
                      activeFeature === feature.id
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {feature.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          {/* Feature details */}
          <div className="relative lg:mt-0 mt-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeFeature === feature.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="h-full flex flex-col">
                  <div className="relative aspect-video w-full rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                    {/* Feature illustration/screenshot would go here */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4">
                          <div className={`h-16 w-16 mx-auto rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center`}>
                            {FeatureIcons[feature.icon]()}
                          </div>
                          <h3 className="mt-6 text-xl font-medium text-center text-gray-900 dark:text-white">{feature.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col flex-1">
                    <p className="text-lg text-gray-700 dark:text-gray-300 flex-1">
                      {feature.details}
                    </p>
                    <div className="mt-6">
                      <a href="#" className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:text-blue-500 dark:hover:text-blue-300">
                        Learn more about {feature.name.toLowerCase()}
                        <svg className="ml-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 