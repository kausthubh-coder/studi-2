"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const CanvasOnboardingPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  
  // Form state
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const [canvasUrl, setCanvasUrl] = useState("");
  const [canvasToken, setCanvasToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Get the current user data
  const currentUser = useMutation(api.users.updateCanvasSettings);
  
  if (!isLoading && !isAuthenticated) {
    return redirect("/");
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    
    try {
      // Validate inputs
      if (!canvasUrl) {
        throw new Error("Canvas URL is required");
      }
      
      if (!canvasToken) {
        throw new Error("Canvas API token is required");
      }
      
      // Basic URL validation
      let url = canvasUrl;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
        setCanvasUrl(url);
      }
      
      // Call the mutation to update Canvas settings
      await currentUser({
        canvasEnabled: true,
        canvasUrl: url,
        canvasAccessToken: canvasToken
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/settings");
      }, 2000);
    } catch (err) {
      console.error("Error updating Canvas settings:", err);
      setError(err instanceof Error ? err.message : "Failed to update Canvas settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:underline flex items-center"
          >
            ← Back to Settings
          </button>
          <h1 className="text-3xl font-bold mt-4">Canvas Integration</h1>
          <p className="text-gray-600 mt-2">
            Connect your Canvas account to access your courses, assignments, and announcements.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Connect Your Canvas Account</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="canvas-url" className="block text-sm font-medium text-gray-700 mb-1">
                  Canvas URL
                </label>
                <input
                  id="canvas-url"
                  type="text"
                  value={canvasUrl}
                  onChange={(e) => setCanvasUrl(e.target.value)}
                  placeholder="https://your-institution.instructure.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the base URL of your Canvas instance (e.g., https://your-institution.instructure.com)
                </p>
              </div>
              
              <div>
                <label htmlFor="canvas-token" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <input
                  id="canvas-token"
                  type="password"
                  value={canvasToken}
                  onChange={(e) => setCanvasToken(e.target.value)}
                  placeholder="Your Canvas API access token"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter your Canvas API access token. Don't have one? See instructions below.
                </p>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                <p className="font-medium">Success!</p>
                <p>Canvas settings updated successfully! Redirecting...</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? "Connecting..." : "Connect Canvas"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">How to Generate a Canvas Access Token</h2>
          
          <div className="border-l-4 border-yellow-300 bg-yellow-50 p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Important:</strong> Your Canvas access token gives applications access to your account. 
              Only generate tokens for trusted applications.
            </p>
          </div>
          
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li>
              <strong>Log in to your Canvas account</strong>
              <p className="ml-6 text-gray-600">Access your institution's Canvas login page and sign in with your credentials.</p>
            </li>
            <li>
              <strong>Navigate to Account Settings</strong>
              <p className="ml-6 text-gray-600">Click on your profile picture in the top-right corner, then select "Account" and "Settings".</p>
            </li>
            <li>
              <strong>Find Approved Integrations</strong>
              <p className="ml-6 text-gray-600">Scroll down to the "Approved Integrations" section.</p>
            </li>
            <li>
              <strong>Generate New Access Token</strong>
              <p className="ml-6 text-gray-600">Click on "+ New Access Token" button.</p>
            </li>
            <li>
              <strong>Enter Purpose</strong>
              <p className="ml-6 text-gray-600">Enter "Studi Integration" as the Purpose.</p>
            </li>
            <li>
              <strong>Set Expiration</strong>
              <p className="ml-6 text-gray-600">We recommend setting an expiration date (e.g., 1 year from now).</p>
            </li>
            <li>
              <strong>Generate Token</strong>
              <p className="ml-6 text-gray-600">Click "Generate Token" button.</p>
            </li>
            <li>
              <strong>Copy the Token</strong>
              <p className="ml-6 text-gray-600 font-bold">IMPORTANT: Copy the token immediately! Canvas will only show it once, and you won't be able to retrieve it later.</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CanvasOnboardingPage;
