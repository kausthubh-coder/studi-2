"use client";

import { useState } from 'react';
import { FadeIn, Reveal } from './animations';
import Link from 'next/link';

// Feature check SVG component
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M7.5 13.5L4 10L3 11L7.5 15.5L17.5 5.5L16.5 4.5L7.5 13.5Z" 
      fill="currentColor" 
    />
  </svg>
);

// Pricing data
const pricingPlans = [
  {
    id: 'free',
    name: 'Student Basic',
    price: '0',
    description: 'Perfect for individual students just getting started.',
    features: [
      'Canvas course integration',
      'Basic AI homework help',
      'Assignment tracking',
      'Single user access',
      'Limited summarizations (5/month)'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    id: 'pro',
    name: 'Student Pro',
    price: '9',
    description: 'For dedicated students who want to excel in their courses.',
    features: [
      'Full Canvas integration',
      'Advanced AI homework assistance',
      'Unlimited summarizations',
      'Study plan generation',
      'Exam preparation help',
      'Grade improvement insights',
      'Priority support',
      'All file formats supported'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    id: 'team',
    name: 'Study Group',
    price: '19',
    description: 'For study groups that want to collaborate and excel together.',
    features: [
      'Everything in Student Pro',
      'Up to 5 student accounts',
      'Collaborative study plans',
      'Shared notes & materials',
      'Group assignment tracking',
      'Discussion tools',
      'Group performance analytics',
      'Dedicated support'
    ],
    cta: 'Get Started',
    popular: false
  }
];

export function Pricing() {
  const [annualBilling, setAnnualBilling] = useState(true);
  
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student-Friendly Pricing</h2>
          </Reveal>
          <FadeIn>
            <p className="text-lg opacity-80 mb-8">
              Affordable plans designed specifically for students. Start free and upgrade when you&apos;re ready.
            </p>
            
            {/* Billing toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!annualBilling ? 'font-medium' : 'opacity-60'}`}>Monthly</span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${
                  annualBilling ? 'bg-black dark:bg-white' : 'bg-black/20 dark:bg-white/20'
                }`}
                role="switch"
                aria-checked={annualBilling}
              >
                <span className="sr-only">Toggle billing frequency</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    annualBilling ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm flex items-center ${annualBilling ? 'font-medium' : 'opacity-60'}`}>
                Yearly <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Student Discount</span>
              </span>
            </div>
          </FadeIn>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <FadeIn 
              key={plan.id}
              delay={index * 0.1} 
              className={`rounded-2xl shadow-sm overflow-hidden border ${
                plan.popular 
                  ? 'border-black dark:border-white' 
                  : 'border-black/10 dark:border-white/10'
              } flex flex-col`}
            >
              {plan.popular && (
                <div className="bg-black text-white dark:bg-white dark:text-black py-1.5 px-4 text-xs font-medium text-center">
                  Most Popular
                </div>
              )}
              
              <div className="px-6 py-8 flex-1">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">${annualBilling ? (parseFloat(plan.price) * 0.8 * 12).toFixed(0) : plan.price}</span>
                  <span className="ml-1 text-lg text-black/60 dark:text-white/60">/{annualBilling ? 'year' : 'month'}</span>
                </div>
                <p className="mt-5 text-sm opacity-70">{plan.description}</p>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-black dark:text-white">
                        <CheckIcon />
                      </div>
                      <span className="ml-3 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-6 py-8 bg-black/5 dark:bg-white/5">
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-full text-sm font-medium transition-colors ${
                    plan.popular
                      ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                      : 'border border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
        
        {/* Educational discount info */}
        <div className="mt-16 text-center">
          <FadeIn>
            <p className="text-sm opacity-70">
              Special discounts available for educational institutions.{' '}
              <Link href="/edu-discount" className="font-medium underline hover:opacity-80">
                Learn about our educational program
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
} 


