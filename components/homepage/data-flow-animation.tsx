"use client"

import { useEffect, useRef, useCallback } from "react"
import { Smartphone, Cloud, Moon } from "lucide-react"

interface DataPacket {
  id: number
  progress: number
  targetProgress: number
  yOffset: number
  size: number
  createdAt: number
}

interface Props {
  scrollProgress: number
  scrollVelocity: number
}

export function DataFlowAnimation({ scrollProgress, scrollVelocity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRectRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })
  const packetsRef = useRef<DataPacket[]>([])
  const packetIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastSpawnTimeRef = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  // Determine animation phase based on scroll (faster transition to background)
  const phase = scrollProgress < 0.15 ? "active" : scrollProgress < 0.35 ? "transitioning" : "background"
  const senderDarkness = Math.min(1, Math.max(0, (scrollProgress - 0.15) / 0.2))
  
  // Animation should be complete when fully in background
  const animationComplete = scrollProgress > 0.6

  // Detect scrolling state
  useEffect(() => {
    if (scrollVelocity > 0.01) {
      isScrollingRef.current = true
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 100)
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollVelocity])

  // Spawn packets based on scroll velocity
  useEffect(() => {
    const now = Date.now()
    const timeSinceLastSpawn = now - lastSpawnTimeRef.current
    
    // Only spawn if scrolling, enough time has passed, and not yet fully in background
    if (scrollVelocity > 0.02 && timeSinceLastSpawn > 50 && packetsRef.current.length < 12 && scrollProgress < 0.5) {
      lastSpawnTimeRef.current = now
      packetIdRef.current += 1
      
      const newPacket: DataPacket = {
        id: packetIdRef.current,
        progress: 0,
        targetProgress: 0,
        yOffset: (Math.random() - 0.5) * 50,
        size: 4 + Math.random() * 4,
        createdAt: now,
      }
      
      packetsRef.current = [...packetsRef.current, newPacket]
    }
    
    // Update target progress for all packets based on scroll velocity
    if (scrollVelocity > 0.01) {
      const progressIncrement = Math.min(0.35, scrollVelocity * 2.5)
      packetsRef.current = packetsRef.current.map(p => ({
        ...p,
        targetProgress: Math.min(1.1, p.targetProgress + progressIncrement)
      }))
    }
  }, [scrollVelocity])

  // Node positions as percentages (must match the JSX positioning)
  const nodeStartX = 0.15 // Center of left node
  const nodeEndX = 0.85   // Center of right node
  const nodeY = 0.42      // Vertical center of nodes (accounting for label below)

  // Calculate smooth bezier curve position
  const getPacketPosition = useCallback((progress: number, yOffset: number, width: number, height: number) => {
    const t = Math.max(0, Math.min(1, progress))
    
    // Control points for smooth curve - connect the node centers
    const startX = width * nodeStartX
    const endX = width * nodeEndX
    const centerY = height * nodeY
    
    // Smooth cubic bezier
    const x = startX + (endX - startX) * t
    
    // Gentle sine wave for organic movement
    const waveAmplitude = 10
    const waveFrequency = 1.5
    const wave = Math.sin(t * Math.PI * waveFrequency) * waveAmplitude * (1 - Math.abs(t - 0.5) * 0.5)
    
    const y = centerY + yOffset * 0.3 + wave
    
    return { x, y }
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      const { width, height } = containerRectRef.current
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Draw connection path between nodes
      const startX = width * nodeStartX
      const endX = width * nodeEndX
      const centerY = height * nodeY
      
      ctx.beginPath()
      ctx.setLineDash([6, 6])
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.25 - senderDarkness * 0.1})`
      ctx.lineWidth = 2
      ctx.moveTo(startX, centerY)
      ctx.lineTo(endX, centerY)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Smoothly interpolate packet progress toward target
      const smoothingFactor = 0.15
      
      // If animation complete, rapidly move all packets to completion
      if (animationComplete) {
        packetsRef.current = packetsRef.current
          .map(packet => ({
            ...packet,
            progress: packet.progress + 0.08,
            targetProgress: 1.2
          }))
          .filter(p => p.progress < 1.05)
      } else {
        packetsRef.current = packetsRef.current
          .map(packet => {
            const newProgress = packet.progress + (packet.targetProgress - packet.progress) * smoothingFactor
            return { ...packet, progress: newProgress }
          })
          .filter(p => p.progress < 1.05)
      }
      
      // Draw packets
      packetsRef.current.forEach(packet => {
        const pos = getPacketPosition(packet.progress, packet.yOffset, width, height)
        
        // Calculate opacity for smooth fade in/out
        let opacity = 1
        if (packet.progress < 0.08) {
          opacity = packet.progress / 0.08
        } else if (packet.progress > 0.88) {
          opacity = Math.max(0, (1 - packet.progress) / 0.12)
        }
        
        // Draw glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, packet.size * 3)
        gradient.addColorStop(0, `rgba(45, 212, 191, ${opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(45, 212, 191, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, packet.size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw packet
        const packetGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, packet.size)
        packetGradient.addColorStop(0, `rgba(94, 234, 212, ${opacity})`)
        packetGradient.addColorStop(1, `rgba(45, 212, 191, ${opacity})`)
        ctx.fillStyle = packetGradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, packet.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [getPacketPosition, senderDarkness, animationComplete])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return
      
      const rect = container.getBoundingClientRect()
      containerRectRef.current = { width: rect.width, height: rect.height }
      
      // Set canvas size to match container (1:1 pixel ratio for simplicity)
      canvas.width = rect.width
      canvas.height = rect.height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <div className="relative w-full h-[350px] flex items-center justify-center">
      {/* Canvas for smooth animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Sender Block (Mobile Device) */}
      <div
        className="absolute flex flex-col items-center z-10 transition-all duration-700 ease-out"
        style={{
          left: "15%",
          top: "42%",
          transform: "translate(-50%, -50%)",
          filter: `brightness(${1 - senderDarkness * 0.6})`,
          opacity: 1 - senderDarkness * 0.3,
        }}
      >
        <div
          className="relative p-5 md:p-7 rounded-2xl border border-border bg-card transition-all duration-700"
          style={{
            boxShadow:
              phase === "background"
                ? "0 0 20px rgba(45, 212, 191, 0.08)"
                : "0 0 40px rgba(45, 212, 191, 0.15)",
          }}
        >
          <Smartphone className="w-10 h-10 md:w-14 md:h-14 text-primary" />
          {phase === "background" && (
            <div className="absolute -top-2 -right-2 bg-muted rounded-full p-1.5 border border-border animate-pulse">
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          )}
        </div>
        <span className="mt-3 text-xs md:text-sm font-medium text-muted-foreground">
          {phase === "background" ? "Background Mode" : "Your App"}
        </span>
      </div>

      {/* Receiver Block (S3 Cloud) */}
      <div 
        className="absolute flex flex-col items-center z-10"
        style={{
          left: "85%",
          top: "42%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="relative p-5 md:p-7 rounded-2xl border border-border bg-card transition-all duration-300"
          style={{
            boxShadow:
              packetsRef.current.some((p) => p.progress > 0.85)
                ? "0 0 50px rgba(45, 212, 191, 0.35)"
                : "0 0 40px rgba(45, 212, 191, 0.15)",
          }}
        >
          <Cloud className="w-10 h-10 md:w-14 md:h-14 text-primary" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded text-xs font-mono text-primary border border-border">
            S3
          </div>
        </div>
        <span className="mt-3 text-xs md:text-sm font-medium text-muted-foreground">Amazon S3</span>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            phase === "background" ? "bg-primary/50 animate-pulse" : "bg-primary"
          }`}
        />
        <span className="text-xs text-muted-foreground font-medium">
          {phase === "active" && "Scroll to upload..."}
          {phase === "transitioning" && "Entering background..."}
          {phase === "background" && "Upload continues in background"}
        </span>
      </div>
    </div>
  )
}
