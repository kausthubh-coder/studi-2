"use client";

import { SignUp } from "@clerk/nextjs";
import { useAuthRedirect } from "../../../hooks/use-auth-redirect";

export default function SignUpPage() {
  // Use the auth redirect hook
  useAuthRedirect();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">Sign Up</h1>
          <p className="mt-2 text-sm text-black">
            Create an account to get started
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none p-0 w-full",
            }
          }}
        />
      </div>
    </div>
  );
} 


