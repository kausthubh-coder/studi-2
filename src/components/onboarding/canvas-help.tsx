"use client";

import { Info } from "lucide-react";

export const CanvasHelpInstructions = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-md border-2 border-black flex gap-3">
      <div className="flex-shrink-0">
        <Info className="h-5 w-5 text-black" />
      </div>
      <div className="text-sm text-black">
        <p className="font-semibold">How to get your Canvas token</p>
        <ol className="list-decimal list-inside mt-1 space-y-1">
          <li>Log in to your Canvas account</li>
          <li>Go to Account → Settings</li>
          <li>Scroll to "Approved Integrations"</li>
          <li>Click "New Access Token"</li>
          <li>Enter "Studi" as the purpose</li>
          <li>Set an expiration date (1 year recommended)</li>
          <li>Click "Generate Token"</li>
          <li><strong className="text-black">Important:</strong> Copy the token immediately as Canvas will only show it once</li>
        </ol>
        <p className="mt-2 text-xs italic text-black">
          Canvas tokens give applications access to your account data. Only create tokens for trusted applications.
        </p>
      </div>
    </div>
  );
}; 