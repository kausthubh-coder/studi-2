'use client';

import dynamic from 'next/dynamic'

// Import the Navigation component with dynamic to disable SSR
const Navigation = dynamic(
  () => import('./navigation').then((mod) => mod.Navigation),
  { ssr: false }
);

export default function NavigationWrapper() {
  return <Navigation />;
} 