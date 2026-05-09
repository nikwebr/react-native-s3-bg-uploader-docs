"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/homepage/ui/button"
import { Badge } from "@/components/homepage/ui/badge"
import { DataFlowAnimation } from "./data-flow-animation"
import { BookOpen, ChevronDown, Copy, Check } from "lucide-react"
import { version } from '@/lib/version';

export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    let initialTop: number | null = null
    function sample() {
      if (sectionRef.current && scrollIndicatorRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        initialTop ??= rect.top
        const dist = sectionRef.current.offsetHeight - window.innerHeight
        if (dist > 0) {
          const progress = Math.max(0, Math.min(1, (initialTop - rect.top) / dist))
          scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - progress * 3))
        }
      }
      rafId = requestAnimationFrame(sample)
    }
    rafId = requestAnimationFrame(sample)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i react-native-s3-bg-uploader react-native-nitro-modules")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} className="min-h-[250vh]">
      {/* Sticky hero content */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden hero-bg">
        {/* Main hero content */}
        <div className="flex-1 mt-10 flex flex-col items-center justify-center px-6 py-8">
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
              v{version}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl text-balance leading-tight">
            <span className="text-foreground">Background Uploads</span>
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
            <Button size="lg" className="min-w-[200px]" asChild>
              <a href="/docs">
                <BookOpen className="w-4 h-4 mr-2" />
                Read the Docs
              </a>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="font-mono text-xs sm:text-sm gap-3 sm:min-w-[280px] justify-between"
              onClick={handleCopy}
            >
              <span className="whitespace-normal sm:whitespace-nowrap text-left">npm i react-native-s3-bg-uploader react-native-nitro-modules</span>
              {copied ? <Check className="w-4 h-4 shrink-0 text-primary" /> : <Copy className="w-4 h-4 shrink-0" />}
            </Button>
          </div>

          {/* Animation container */}
          <div className="w-full max-w-4xl mt-8">
            <DataFlowAnimation sectionRef={sectionRef} />
          </div>

          {/* Scroll indicator */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{ opacity: 1 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
