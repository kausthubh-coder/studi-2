'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Import the AuthCheck component with dynamic to disable SSR
const AuthCheck = dynamic(
  () => import('./auth-check').then((mod) => mod.default || mod.AuthCheck),
  { ssr: false }
);

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="hidden">
      <p>Authentication Error: {error.message}</p>
    </div>
  );
}

export default function AuthCheckWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
    </ErrorBoundary>
  );
} 


