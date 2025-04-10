"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuthRedirect } from "../../../../hooks/use-auth-redirect";

export default function SignInPage() {
  // Use the auth redirect hook
  useAuthRedirect();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none p-0 w-full",
            }
          }}
        />
    </div>
  );
} 