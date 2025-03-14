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
  },
  {
    id: 'ai',
    name: 'AI-Powered Assistant',
    icon: 'AI',
    description: 'Get intelligent responses to your questions about course material, with context-aware understanding of your academic needs.',
  },
  {
    id: 'homework',
    name: 'Homework Assistant',
    icon: 'Homework',
    description: 'Receive step-by-step guidance on solving assignments and understanding complex concepts from your courses.',
  },
  {
    id: 'summarization',
    name: 'Smart Summarization',
    icon: 'Summarization',
    description: 'Automatically generate concise summaries of lecture materials, readings, and other course content.',
  },
  {
    id: 'studyplans',
    name: 'Personalized Study Plans',
    icon: 'StudyPlans',
    description: 'Create customized study schedules based on your courses, assignments, and upcoming exams.',
  },
  {
    id: 'grades',
    name: 'Grade Tracking',
    icon: 'Grades',
    description: 'Monitor your academic progress across all courses and receive suggestions for improvement.',
  },
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState('canvas');

  return (
    <section id="features" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Elevate Your Academic Experience</h2>
          </Reveal>
          <FadeIn>
            <p className="text-lg opacity-80">
              Studi integrates with Canvas LMS to provide powerful tools that help you succeed in your courses.
            </p>
          </FadeIn>
        </div>

        {/* Feature tabs */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Tab navigation */}
          <div className="space-y-4">
            {features.map((feature) => (
              <FadeIn key={feature.id} delay={0.1}>
                <button
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-200 border ${
                    activeFeature === feature.id
                      ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                      : 'border-black/5 dark:border-white/5 hover:bg-black/5 hover:dark:bg-white/5'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 p-2 rounded-lg ${
                      activeFeature === feature.id
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-black/5 dark:bg-white/5'
                    }`}>
                      {FeatureIcons[feature.icon]()}
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.name}</h3>
                      {activeFeature === feature.id && (
                        <p className="text-sm mt-1 opacity-80">{feature.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>

          {/* Feature preview */}
          <FadeIn className="bg-black/5 dark:bg-white/5 rounded-2xl aspect-[4/3] flex items-center justify-center border border-black/10 dark:border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold p-8 text-center">
              {activeFeature === 'canvas' && "🎓 Canvas Integration"}
              {activeFeature === 'ai' && "🤖 AI Assistance"}
              {activeFeature === 'homework' && "📚 Assignment Help"}
              {activeFeature === 'summarization' && "📝 Smart Summaries"}
              {activeFeature === 'studyplans' && "📅 Study Planning"}
              {activeFeature === 'grades' && "📊 Grade Tracking"}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
} 