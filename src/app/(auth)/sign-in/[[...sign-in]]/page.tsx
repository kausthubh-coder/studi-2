"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuthRedirect } from "../../../../hooks/use-auth-redirect";
import Link from "next/link";

export default function SignInPage() {
  // Use the auth redirect hook
  useAuthRedirect();
  
  return (
    <div className="min-h-screen bg-[#E8E1D6] relative overflow-hidden flex flex-col">
      {/* Paper Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[url('/paper-texture.png')]"></div>

      {/* Grid Background with Radial Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat">
        <div className="absolute inset-0 bg-radial-gradient"></div>
      </div>

      {/* Floating Navigation */}
      <header className="container mx-auto py-4 px-4 relative z-20 mt-6">
        <nav className="flex items-center justify-between bg-[#E8E1D6]/80 backdrop-blur-sm border-2 border-black rounded-full px-6 py-3 shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 transition-transform duration-300 ease-out hover:scale-110">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M3 8.5L21 2L14.5 20L11 12.5L3 8.5Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-medium">Studi</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-black transition-colors duration-300">
              Home
            </Link>
            <Link href="/waitlist" className="text-gray-700 hover:text-black transition-colors duration-300">
              Waitlist
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 relative z-10">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 rounded-lg",
              headerTitle: "text-3xl font-bold font-display text-center mb-2",
              headerSubtitle: "text-gray-700 text-center mb-6",
              formButtonPrimary: "w-full bg-black border-2 border-black text-white rounded-md px-6 py-3 font-medium hover:bg-gray-900 transition-all duration-300 ease-out",
              formInputText: "px-4 py-3 border-2 border-black rounded-md bg-[#E8E1D6] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300",
              socialButtonsBlockButton: "border-2 border-black hover:bg-gray-100 transition-colors duration-300",
              socialButtonsIconButton: "border-2 border-black hover:bg-gray-100 transition-colors duration-300",
              footerActionLink: "text-black font-medium hover:underline",
              identityPreviewEditButton: "text-black hover:underline",
            }
          }}
        />
      </div>
    </div>
  );
} 