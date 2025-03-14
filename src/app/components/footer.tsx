"use client";

import Link from 'next/link';
import { LogoText } from './logo';
import { FadeIn } from './animations';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo and info */}
            <div className="col-span-2">
              <LogoText className="mb-4" />
              <p className="text-sm opacity-70 mb-6 max-w-md">
                Studi is an intelligent AI assistant designed specifically for Canvas LMS, helping students manage their academic workload more effectively and excel in their studies.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'github', 'linkedin', 'instagram'].map((social) => (
                  <Link 
                    key={social}
                    href={`https://${social}.com/studi`} 
                    className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    aria-label={`${social.charAt(0).toUpperCase() + social.slice(1)}`}
                  >
                    <span className="text-sm opacity-70 hover:opacity-100">
                      {social === 'twitter' ? 'X' : social.charAt(0).toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Features', href: '/#features' },
                  { name: 'Pricing', href: '/#pricing' },
                  { name: 'Canvas Integration', href: '/integration' },
                  { name: 'Updates', href: '/updates' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', href: '/help' },
                  { name: 'Study Guides', href: '/guides' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'For Educators', href: '/educators' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-3">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Privacy', href: '/privacy' },
                  { name: 'Terms', href: '/terms' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm opacity-60">
              © {currentYear} Studi Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Cookies
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
} 