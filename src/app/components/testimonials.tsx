"use client";

import { FadeIn, Reveal } from './animations';

// Testimonial data
const testimonials = [
  {
    id: 1,
    content: "Studi has been a game-changer for my engineering courses. It helps me understand complex concepts and keeps all my Canvas assignments organized in one place.",
    author: "Alex Johnson",
    role: "Engineering Student, MIT",
    image: "/avatars/avatar-1.png"
  },
  {
    id: 2,
    content: "As a pre-med student with a packed schedule, Studi helps me stay on top of my coursework. The summarization feature saves me hours of reading time.",
    author: "Maria Garcia",
    role: "Pre-Med Student, Stanford",
    image: "/avatars/avatar-2.png"
  },
  {
    id: 3,
    content: "The AI homework assistant is incredibly helpful for my math courses. It guides me through problems step-by-step rather than just giving answers.",
    author: "Jamal Williams",
    role: "Computer Science Major, Berkeley",
    image: "/avatars/avatar-3.png"
  },
  {
    id: 4,
    content: "Our study group uses Studi to prepare for exams. The way it connects directly to Canvas and helps us create study plans has improved all our grades.",
    author: "Sarah Chen",
    role: "Business Student, Harvard",
    image: "/avatars/avatar-4.png"
  },
  {
    id: 5,
    content: "I struggled with keeping track of all my assignments until I found Studi. Now I never miss a deadline, and my professors have noticed the improvement in my work.",
    author: "David Kim",
    role: "Psychology Major, Princeton",
    image: "/avatars/avatar-5.png"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-black/5 dark:bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Students Everywhere</h2>
          </Reveal>
          <FadeIn>
            <p className="text-lg opacity-80">
              Hear how Studi is helping students excel in their academic journey.
            </p>
          </FadeIn>
        </div>

        {/* Testimonial grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn 
              key={testimonial.id} 
              delay={index * 0.1}
              className={`bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5 flex flex-col ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Quote icon */}
              <div className="mb-4">
                <svg width="45" height="36" className="text-black/20 dark:text-white/20" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.325 0C15.911 0 18.199 0.647 20.188 1.942C22.177 3.145 23.767 4.88 24.958 7.147C26.149 9.413 26.744 12.053 26.744 15.066C26.744 18.172 26.009 21.139 24.539 23.966C23.161 26.701 21.248 29.111 18.801 31.197C16.353 33.282 13.65 34.835 10.692 35.854L9.38 32.355C11.737 31.337 13.837 29.895 15.677 28.031C17.517 26.167 18.661 24.141 19.107 21.952C18.57 22.076 18.033 22.139 17.495 22.139C15.088 22.139 13.092 21.336 11.506 19.731C9.92 18.126 9.127 16.042 9.127 13.48C9.127 10.918 9.966 8.805 11.644 7.147C13.325 5.487 15.212 4.529 17.307 4.273C15.677 4.273 13.92 3.577 12.039 2.184C10.252 0.792 9.358 0.096 9.358 0.096L13.325 0ZM37.801 0C40.387 0 42.675 0.647 44.664 1.942C46.653 3.145 48.243 4.88 49.434 7.147C50.625 9.413 51.22 12.053 51.22 15.066C51.22 18.172 50.484 21.139 49.014 23.966C47.637 26.701 45.724 29.111 43.277 31.197C40.829 33.282 38.126 34.835 35.168 35.854L33.856 32.355C36.213 31.337 38.312 29.895 40.153 28.031C41.993 26.167 43.137 24.141 43.583 21.952C43.045 22.076 42.508 22.139 41.971 22.139C39.564 22.139 37.568 21.336 35.982 19.731C34.396 18.126 33.603 16.042 33.603 13.48C33.603 10.918 34.442 8.805 36.119 7.147C37.801 5.487 39.688 4.529 41.783 4.273C40.153 4.273 38.395 3.577 36.514 2.184C34.728 0.792 33.834 0.096 33.834 0.096L37.801 0Z" />
                </svg>
              </div>
              
              {/* Testimonial content */}
              <p className="flex-1 text-lg mb-6">{testimonial.content}</p>
              
              {/* Author info */}
              <div className="flex items-center mt-auto">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm opacity-60">{testimonial.role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
} 