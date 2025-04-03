"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuthRedirect } from "../../../hooks/use-auth-redirect";

export default function SignInPage() {
  // Use the auth redirect hook
  useAuthRedirect();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">Sign In</h1>
          <p className="mt-2 text-sm text-black">
            Welcome back! Please enter your details
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none p-0 w-full",
            }
          }}
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
} 