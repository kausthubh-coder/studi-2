  "use client";

  import Link from 'next/link';
  import { Reveal } from './animations';

  export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="bg-white border-t-2 border-black">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
          <Reveal>
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="space-y-8">
                <div className="flex items-center">
                  <span className="text-2xl">📚</span>
                  <span className="ml-2 text-xl font-bold text-black">Studi</span>
                </div>
                <p className="text-sm text-black max-w-xs">
                  Studi is an AI-powered study assistant designed specifically for Canvas LMS, helping students manage their academic workload and excel in their studies.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-black hover:text-gray-700">
                    <span className="sr-only">Twitter</span>
                    <span className="text-2xl">🐦</span>
                  </a>
                  <a href="#" className="text-black hover:text-gray-700">
                    <span className="sr-only">GitHub</span>
                    <span className="text-2xl">🐙</span>
                  </a>
                  <a href="#" className="text-black hover:text-gray-700">
                    <span className="sr-only">LinkedIn</span>
                    <span className="text-2xl">💼</span>
                  </a>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-black">🚀 Product</h3>
                    <ul className="mt-6 space-y-4">
                      <li>
                        <Link href="#features" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          ✨ Features
                        </Link>
                      </li>
                      <li>
                        <Link href="#testimonials" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          💬 Testimonials
                        </Link>
                      </li>
                      <li>
                        <Link href="/canvas-integration" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          🎓 Canvas Integration
                        </Link>
                      </li>
                      <li>
                        <Link href="/pricing" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          💰 Pricing
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold leading-6 text-black">📚 Resources</h3>
                    <ul className="mt-6 space-y-4">
                      <li>
                        <Link href="/help" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          ❓ Help Center
                        </Link>
                      </li>
                      <li>
                        <Link href="/guides" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          📖 Study Guides
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          ✏️ Blog
                        </Link>
                      </li>
                      <li>
                        <Link href="/api" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          🔌 API
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-black">🏢 Company</h3>
                    <ul className="mt-6 space-y-4">
                      <li>
                        <Link href="/about" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          ℹ️ About
                        </Link>
                      </li>
                      <li>
                        <Link href="/careers" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          👩‍💻 Careers
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          📞 Contact
                        </Link>
                      </li>
                      <li>
                        <Link href="/partners" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          🤝 Partners
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold leading-6 text-black">⚖️ Legal</h3>
                    <ul className="mt-6 space-y-4">
                      <li>
                        <Link href="/privacy" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          🔒 Privacy
                        </Link>
                      </li>
                      <li>
                        <Link href="/terms" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          📜 Terms
                        </Link>
                      </li>
                      <li>
                        <Link href="/cookies" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          🍪 Cookie Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="/licenses" className="text-sm leading-6 text-black hover:text-gray-700 border-b border-black">
                          📄 Licenses
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t-2 border-black pt-8">
              <p className="text-sm text-black xl:text-center">
                &copy; {currentYear} Studi, Inc. All rights reserved. 🎉
              </p>
            </div>
          </Reveal>
        </div>
      </footer>
    );
  } 