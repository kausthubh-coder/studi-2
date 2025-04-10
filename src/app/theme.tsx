"use client";

import { dark } from "@clerk/themes";

export const clerkTheme = {
  baseTheme: dark,
  variables: {
    colorPrimary: "black",
    colorBackground: "#E8E1D6",
    colorText: "black",
    colorTextOnPrimaryBackground: "white",
    colorTextSecondary: "#6b7280",
    fontFamily: "var(--font-poppins)",
    fontFamilyHeadings: "var(--font-playfair)",
    borderRadius: "0.5rem",
  },
  elements: {
    card: "w-full backdrop-blur-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 rounded-lg mx-auto",
    formButtonPrimary: "w-full bg-black border-2 border-black text-white rounded-md px-6 py-3 font-medium hover:bg-gray-900 transition-all duration-300 ease-out",
    formButtonReset: "text-gray-700 hover:text-black transition-colors duration-300",
    formFieldLabel: "font-medium text-gray-700",
    formFieldInput: "w-full px-4 py-3 border-2 border-black rounded-md bg-[#E8E1D6]/80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 transition-all duration-300",
    footerActionText: "text-gray-700 text-center",
    footerActionLink: "text-black font-medium hover:underline",
    headerTitle: "font-display text-3xl font-bold text-center",
    headerSubtitle: "text-gray-700 text-center",
    socialButtonsIconButton: "border-2 border-black bg-black text-white hover:bg-gray-900 transition-colors duration-300",
    socialButtonsBlockButton: "border-2 border-black bg-black text-white hover:bg-gray-900 transition-colors duration-300",
    socialButtonsProviderIcon: "text-white",
    dividerLine: "border-gray-300",
    dividerText: "text-gray-500 bg-[#E8E1D6]",
    avatarImageContainer: "border-2 border-black",
    badge: "bg-black text-white",
    formFieldWarningText: "text-amber-600",
    formFieldErrorText: "text-red-600",
    rootBox: "w-full flex justify-center",
    form: "w-full",
    main: "w-full mx-auto",
    identityPreview: "text-black bg-[#E8E1D6]",
    userPreview: "text-black bg-[#E8E1D6]",
    userButtonBox: "text-black bg-[#E8E1D6]",
  },
  layout: {
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "iconButton",
  },
}; 