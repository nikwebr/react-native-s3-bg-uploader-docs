"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/homepage/ui/button"
import { Badge } from "@/components/homepage/ui/badge"
import { DataFlowAnimation } from "./data-flow-animation"
import { BookOpen, ChevronDown, Copy, Check } from "lucide-react"

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight
      const viewportHeight = window.innerHeight
      
      // Calculate progress based on how much of the section has scrolled past
      const scrolled = -rect.top
      const scrollableDistance = sectionHeight - viewportHeight
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance))
      setScrollProgress(progress)

      // Calculate scroll velocity
      const now = Date.now()
      const deltaTime = now - lastTime.current
      const deltaScroll = Math.abs(window.scrollY - lastScrollY.current)
      
      if (deltaTime > 0) {
        const velocity = deltaScroll / deltaTime
        setScrollVelocity(velocity)
      }
      
      lastScrollY.current = window.scrollY
      lastTime.current = now
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install react-native-s3-upload")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} className="min-h-[250vh]">
      {/* Sticky hero content */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Main hero content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              iOS
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Android
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Web
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">
              v2.0.0
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl text-balance leading-tight">
            <span className="text-foreground">Background S3 Uploads</span>
            <br />
            <span className="text-primary">for React Native</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base md:text-lg text-muted-foreground text-center max-w-2xl text-pretty leading-relaxed">
            Seamless file uploads that continue even when your app goes to background.
            Pausable, resumable, and built for the S3 API.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="min-w-[200px]">
              <BookOpen className="w-4 h-4 mr-2" />
              Read the Docs
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="font-mono text-sm gap-3 min-w-[280px] justify-between"
              onClick={handleCopy}
            >
              <span>npm install react-native-s3-upload</span>
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Animation container */}
          <div className="w-full max-w-4xl mt-8">
            <DataFlowAnimation scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
          >
            <span className="text-xs text-muted-foreground">Scroll to see background mode</span>
            <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
