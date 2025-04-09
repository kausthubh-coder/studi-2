"use client";

import { FadeIn, Reveal } from './animations';
import Image from 'next/image';

// Testimonial data
const testimonials = [
  {
    id: 1,
    content: "Studi has been a game-changer for my engineering courses. The Canvas integration makes it so easy to access all my course materials and assignments in one place.",
    author: "Alex Johnson",
    role: "Engineering Student, MIT",
    image: "/avatars/avatar-1.png",
    emoji: "🔧"
  },
  {
    id: 2,
    content: "As a pre-med student with a packed schedule, Studi helps me stay on top of my coursework. The AI assistant understands my Canvas materials and explains concepts clearly.",
    author: "Maria Garcia",
    role: "Pre-Med Student, Stanford",
    image: "/avatars/avatar-2.png",
    emoji: "⚕️"
  },
  {
    id: 3,
    content: "The AI homework assistant is incredibly helpful for my math courses. It analyzes problems from my Canvas assignments and guides me through solutions step-by-step.",
    author: "Jamal Williams",
    role: "Computer Science Major, Berkeley",
    image: "/avatars/avatar-3.png",
    emoji: "💻"
  },
  {
    id: 4,
    content: "Our study group uses Studi to prepare for exams. The way it connects directly to Canvas and helps us create study plans based on our course content has improved all our grades.",
    author: "Sarah Chen",
    role: "Business Student, Harvard",
    image: "/avatars/avatar-4.png",
    emoji: "📈"
  },
  {
    id: 5,
    content: "I struggled with keeping track of all my Canvas assignments until I found Studi. Now I never miss a deadline, and my professors have noticed the improvement in my work.",
    author: "David Kim",
    role: "Psychology Major, Princeton",
    image: "/avatars/avatar-5.png",
    emoji: "🧠"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Reveal>
            <h2 className="text-base font-semibold leading-7 text-black">💬 Testimonials</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Students Love Using Studi
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-8 text-black">
              Hear from students who have transformed their academic experience with our Canvas-integrated AI study assistant.
            </p>
          </Reveal>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={0.1 * index}>
              <div className="flex flex-col h-full overflow-hidden rounded-2xl bg-white p-6 shadow border-2 border-black">
                <div className="flex-1">
                  <div className="flex items-center gap-x-2 text-black mb-4">
                    <span className="text-2xl">{testimonial.emoji}</span>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-base text-black mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                </div>
                <div className="flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black overflow-hidden border border-black">
                    {testimonial.image ? (
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        width={40}
                        height={40}
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black">{testimonial.author}</h3>
                    <p className="text-xs text-black">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Reveal>
            <a href="#" className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-medium text-black shadow-sm border-2 border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              🚀 Join these students
              <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
} 


