"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
};

export const FadeIn = ({ children, delay = 0, duration = 0.6, className = '' }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

type FloatingElementProps = {
  children: ReactNode;
  amount?: number;
  duration?: number;
  className?: string;
};

export const FloatingElement = ({ children, amount = 10, duration = 4, className = '' }: FloatingElementProps) => (
  <motion.div
    animate={{ 
      y: [0, -amount, 0],
    }}
    transition={{ 
      duration,
      repeat: Infinity,
      ease: "easeInOut" 
    }}
    className={className}
  >
    {children}
  </motion.div>
);

type GradientTextProps = {
  children: ReactNode;
  className?: string;
}

export const GradientText = ({ children, className = '' }: GradientTextProps) => (
  <motion.span
    className={`bg-gradient-to-r from-black to-black dark:from-white dark:to-white bg-clip-text text-transparent ${className}`}
    initial={{ backgroundPosition: "0% 50%" }}
    whileHover={{ scale: 1.05 }}
  >
    {children}
  </motion.span>
);

// New animation components for more micro-interactions

type RevealProps = {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
};

export const Reveal = ({ children, direction = 'up', delay = 0, className = '' }: RevealProps) => {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type TypewriterProps = {
  text: string;
  delay?: number;
  className?: string;
};

export const Typewriter = ({ text, delay = 0, className = '' }: TypewriterProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
  >
    {text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + index * 0.05 }}
      >
        {char}
      </motion.span>
    ))}
  </motion.div>
); 


