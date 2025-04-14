import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Studi - Your Canvas LMS AI Assistant",
  description: "Studi seamlessly integrates with Canvas LMS to help students manage their academic workload, understand course materials, and excel in their studies.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (  
    <html lang="en" className={`scroll-smooth ${poppins.variable} ${playfair.variable}`}> 
      <body className="font-sans antialiased">
          <Providers>{children}</Providers>
          <Analytics />
      </body>
    </html>
  );
}
