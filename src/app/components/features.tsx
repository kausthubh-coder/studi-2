"use client";

import { useState } from 'react';
import { FadeIn, Reveal } from './animations';
import { ReactElement } from 'react';

// Note: You would typically use real icons from an icon library or SVG files
const FeatureIcons: Record<string, () => ReactElement> = {
  Canvas: () => (
    <span className="text-2xl">🎓</span>
  ),
  AI: () => (
    <span className="text-2xl">🤖</span>
  ),
  Homework: () => (
    <span className="text-2xl">⏰</span>
  ),
  Summarization: () => (
    <span className="text-2xl">📝</span>
  ),
  StudyPlans: () => (
    <span className="text-2xl">📅</span>
  ),
  Grades: () => (
    <span className="text-2xl">📊</span>
  ),
};

// Feature data
const features = [
  {
    id: 'canvas',
    name: '🎓 Canvas Integration',
    icon: 'Canvas',
    description: 'Seamlessly connect with your Canvas LMS account to access courses, assignments, and materials in one place.',
    details: 'Studi automatically syncs with your Canvas account, importing your courses, assignments, due dates, and learning materials. No more switching between platforms or missing important deadlines.'
  },
  {
    id: 'ai-assistant',
    name: '🤖 AI-Powered Answers',
    icon: 'AI',
    description: 'Get instant, accurate answers to your questions about course material, assignments, and more.',
    details: 'Our advanced AI understands your course content and can provide explanations, summaries, and answers tailored to your specific classes. It\'s like having a tutor available 24/7.'
  },
  {
    id: 'homework-help',
    name: '⏰ Homework Assistance',
    icon: 'Homework',
    description: 'Receive step-by-step guidance on solving problems and completing assignments.',
    details: 'When you\'re stuck on a homework problem, Studi can break it down into manageable steps, provide hints, and guide you through the solution process without simply giving you the answer.'
  },
  {
    id: 'summarization',
    name: '📝 Content Summarization',
    icon: 'Summarization',
    description: 'Transform lengthy lectures and readings into concise, easy-to-understand summaries.',
    details: 'Upload lecture notes, readings, or recorded lectures, and Studi will generate comprehensive summaries highlighting the key points, making review and study sessions more efficient.'
  },
  {
    id: 'study-plans',
    name: '📅 Personalized Study Plans',
    icon: 'StudyPlans',
    description: 'Get customized study schedules based on your courses, assignments, and learning style.',
    details: 'Studi analyzes your course load, upcoming assignments, and past performance to create optimized study plans that help you prepare effectively and reduce last-minute cramming.'
  },
  {
    id: 'grade-tracking',
    name: '📊 Grade Tracking & Analysis',
    icon: 'Grades',
    description: 'Monitor your academic performance and receive insights to improve your grades.',
    details: 'Keep track of your grades across all courses, identify trends, and get personalized recommendations on where to focus your efforts to improve your academic performance.'
  }
];

export function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-base font-semibold leading-7 text-black">✨ Features</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">Everything You Need to Excel in Your Studies</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-8 text-black max-w-2xl mx-auto">
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
                  className={`flex items-start p-4 text-left rounded-lg transition-all border ${
                    activeFeature === feature.id
                      ? 'bg-white border-2 border-black shadow-md'
                      : 'border-black hover:bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg ${
                    activeFeature === feature.id
                      ? 'bg-white border-2 border-black'
                      : 'bg-white border border-black'
                  }`}>
                    {FeatureIcons[feature.icon]()}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-black">
                      {feature.name}
                    </p>
                    <p className="mt-1 text-sm text-black">
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
                  <div className="relative aspect-video w-full rounded-2xl bg-white border-2 border-black shadow-xl overflow-hidden">
                    {/* Feature illustration/screenshot would go here */}
                    <div className="absolute inset-0 bg-white">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4">
                          <div className="h-16 w-16 mx-auto rounded-xl bg-white border-2 border-black flex items-center justify-center">
                            {FeatureIcons[feature.icon]()}
                          </div>
                          <h3 className="mt-6 text-xl font-medium text-center text-black">{feature.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col flex-1">
                    <p className="text-lg text-black flex-1">
                      {feature.details}
                    </p>
                    <div className="mt-6">
                      <a href="#" className="text-black font-medium flex items-center border-b-2 border-black inline-block hover:text-gray-700">
                        👉 Learn more about {feature.name.toLowerCase()}
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