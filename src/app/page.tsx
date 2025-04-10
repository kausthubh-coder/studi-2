"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import AuthCheckWrapper from "./components/auth/auth-check-wrapper"

export default function Home() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (parallaxRef.current) {
        const elements = parallaxRef.current.querySelectorAll(".parallax-icon")

        elements.forEach((element) => {
          const htmlElement = element as HTMLElement
          const rect = htmlElement.getBoundingClientRect()
          const elementCenterX = rect.left + rect.width / 2
          const elementCenterY = rect.top + rect.height / 2

          // Calculate distance between cursor and element center
          const distanceX = e.clientX - elementCenterX
          const distanceY = e.clientY - elementCenterY
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

          // Base movement parameters
          const depth = Number.parseFloat(element.getAttribute("data-depth") || "1")
          const baseSpeed = 0.015 * depth

          // Proximity effect - icons move away from cursor when close
          const proximityThreshold = 300
          let proximityFactor = 0

          if (distance < proximityThreshold) {
            proximityFactor = (1 - distance / proximityThreshold) * 10
          }

          // Calculate movement based on mouse position and proximity
          const moveX = -distanceX * baseSpeed - (distanceX / distance || 0) * proximityFactor
          const moveY = -distanceY * baseSpeed - (distanceY / distance || 0) * proximityFactor

          // Apply the transformation
          htmlElement.style.transform = `translate(${moveX}px, ${moveY}px)`
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you! ${email} has been added to our waitlist.`)
    setEmail("")
  }

  const handleIconHover = (id: string) => {
    setHoveredIcon(id)
  }

  const handleIconLeave = () => {
    setHoveredIcon(null)
  }

  return (
    <main>
      <AuthCheckWrapper />
      <div className="min-h-screen bg-[#F6EEE3] relative overflow-hidden" ref={parallaxRef}>
        {/* Paper Texture */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30 bg-[url('/paper-texture.png')]"></div>

        {/* Grid Background with Radial Gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid-pattern.svg')] bg-repeat">
          <div className="absolute inset-0 bg-radial-gradient"></div>
        </div>

        {/* Floating Navigation */}
        <header className="container mx-auto py-4 px-4 relative z-20 mt-6">
          <nav className="flex items-center justify-between bg-[#F6EEE3]/80 backdrop-blur-sm border-2 border-black rounded-full px-6 py-3 shadow-sm">
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
                Pricing
              </Link>
              <Link href="/sign-in" className="text-gray-700 hover:text-black transition-colors duration-300">
                Log In
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-5xl mx-auto">
            {/* Strategic Illustrations */}

            {/* Paper Plane (large) */}
            <div
              className={`absolute right-[10%] top-[5%] parallax-icon transition-all duration-700 ease-out ${hoveredIcon === "plane" ? "translate-x-5 -translate-y-5" : ""}`}
              data-depth="1.2"
              onMouseEnter={() => handleIconHover("plane")}
              onMouseLeave={handleIconLeave}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
              >
                <path
                  d="M15 42.5L105 10L72.5 100L55 62.5L15 42.5Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Compass */}
            <div
              className={`absolute left-[5%] top-[30%] parallax-icon transition-all duration-1000 ease-out ${hoveredIcon === "compass" ? "rotate-45" : ""}`}
              data-depth="0.8"
              onMouseEnter={() => handleIconHover("compass")}
              onMouseLeave={handleIconLeave}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer opacity-70"
              >
                <circle cx="30" cy="30" r="25" stroke="black" strokeWidth="2" />
                <path d="M30 10L35 30L30 50L25 30L30 10Z" stroke="black" strokeWidth="1.5" />
                <path d="M10 30L30 25L50 30L30 35L10 30Z" stroke="black" strokeWidth="1.5" />
                <circle cx="30" cy="30" r="3" stroke="black" strokeWidth="1" />
              </svg>
            </div>

            {/* Atom */}
            <div
              className={`absolute right-[8%] bottom-[15%] parallax-icon transition-all duration-2000 ease-out ${hoveredIcon === "atom" ? "rotate-45" : ""}`}
              data-depth="1.0"
              onMouseEnter={() => handleIconHover("atom")}
              onMouseLeave={handleIconLeave}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer opacity-70"
              >
                <circle cx="40" cy="40" r="8" stroke="black" strokeWidth="2" />
                <ellipse cx="40" cy="40" rx="30" ry="15" stroke="black" strokeWidth="2" />
                <ellipse cx="40" cy="40" rx="30" ry="15" transform="rotate(60 40 40)" stroke="black" strokeWidth="2" />
                <ellipse cx="40" cy="40" rx="30" ry="15" transform="rotate(120 40 40)" stroke="black" strokeWidth="2" />
              </svg>
            </div>

            {/* Einstein's Equation */}
            <div
              className={`absolute left-[15%] top-[15%] parallax-icon transition-all duration-500 ease-out ${hoveredIcon === "equation" ? "scale-110" : ""}`}
              data-depth="1.0"
              onMouseEnter={() => handleIconHover("equation")}
              onMouseLeave={handleIconLeave}
            >
              <div className="text-2xl italic font-serif cursor-pointer opacity-80">E=mc²</div>
            </div>

            {/* Magnifying Glass */}
            <div
              className={`absolute right-[20%] top-[40%] parallax-icon transition-all duration-500 ease-out ${hoveredIcon === "magnify" ? "scale-110" : ""}`}
              data-depth="0.9"
              onMouseEnter={() => handleIconHover("magnify")}
              onMouseLeave={handleIconLeave}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer opacity-70"
              >
                <circle cx="25" cy="25" r="15" stroke="black" strokeWidth="2" />
                <line x1="35" y1="35" x2="50" y2="50" stroke="black" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Books */}
            <div
              className={`absolute left-[25%] bottom-[25%] parallax-icon transition-all duration-700 ease-out ${hoveredIcon === "books" ? "scale-110" : ""}`}
              data-depth="0.7"
              onMouseEnter={() => handleIconHover("books")}
              onMouseLeave={handleIconLeave}
            >
              <svg
                width="70"
                height="30"
                viewBox="0 0 80 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer opacity-70"
              >
                <rect x="10" y="5" width="60" height="5" stroke="black" strokeWidth="1" />
                <rect x="10" y="12" width="60" height="5" stroke="black" strokeWidth="1" />
                <rect x="10" y="19" width="60" height="5" stroke="black" strokeWidth="1" />
              </svg>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center mt-20 mb-16 text-center relative z-10">
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold mb-6 max-w-4xl leading-tight tracking-tight">
                Bring your learning to life.
              </h1>

              <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl font-normal">
                Enhance your education with Studi&apos;s AI-Powered Education platform
              </p>

              {/* Glass Waitlist CTA */}
              <div className="w-full max-w-md mb-12 bg-[#F6EEE3]/60 backdrop-blur-md p-8 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="email" className="text-left text-sm font-medium text-gray-800">
                      Join our waitlist
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border-2 border-black rounded-md bg-[#F6EEE3]/80 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-black border-2 border-black text-white rounded-md px-6 py-3 font-medium flex items-center justify-center hover:bg-gray-900 transition-all duration-300 ease-out"
                    >
                      Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </form>

                <p className="text-sm text-gray-700 mt-4">Be the first to know when we launch. No spam, ever.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  )
}



