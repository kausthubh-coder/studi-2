"use client";

import React from 'react';

export function Logo({ className = '', size = 32 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <rect width="32" height="32" rx="4" className="fill-black dark:fill-white" />
      <path 
        d="M7 8H25M7 14H18M7 20H22" 
        className="stroke-white dark:stroke-black" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <circle 
        cx="22" 
        cy="14" 
        r="3" 
        className="stroke-white dark:stroke-black" 
        strokeWidth="2" 
      />
    </svg>
  );
}

export function LogoText({ className = '' }) {
  return (
    <div className={`font-bold text-xl flex items-center ${className}`}>
      <Logo size={24} className="mr-2" />
      <span>Studi</span>
    </div>
  );
} 


