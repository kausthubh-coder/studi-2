'use client';

import dynamic from 'next/dynamic'

// Import the AuthCheck component with dynamic to disable SSR
const AuthCheck = dynamic(
  () => import('./auth-check').then((mod) => mod.AuthCheck),
  { ssr: false }
);

export default function AuthCheckWrapper() {
  return <AuthCheck />;
} 