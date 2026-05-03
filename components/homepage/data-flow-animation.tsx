"use client"

import { useEffect, useRef, useState } from "react"
import { Smartphone, Cloud, Moon, Check } from "lucide-react"

interface DataPacket {
  id: number
  progress: number
  targetProgress: number
  yOffset: number
  size: number
}

interface RenderedPacket {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

interface Props {
  sectionRef: React.RefObject<HTMLElement | null>
}

const NODE_START_X = 0.15
const NODE_END_X = 0.85
const NODE_Y = 0.42

export function DataFlowAnimation({ sectionRef }: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const packetsRef = useRef<DataPacket[]>([])
  const packetIdRef = useRef(0)
  const lastSpawnRef = useRef(0)

  const [lineOpacity, setLineOpacity] = useState(0.6)
  const [rendered, setRendered] = useState<RenderedPacket[]>([])
  const [senderDarkness, setSenderDarkness] = useState(0)
  const [phase, setPhase] = useState<"active" | "transitioning" | "background" | "done">("active")

  useEffect(() => {
    let rafId: number
    let lastTick = 0
    let lastScrollY = window.scrollY
    let lastPerfT = performance.now()
    let initialTop: number | null = null

    function loop(now: number) {
      rafId = requestAnimationFrame(loop)

      const scrollY = window.scrollY
      const perfT = performance.now()
      const dt = perfT - lastPerfT

      let prog = 0
      let vel = 0

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        initialTop ??= rect.top
        const dist = sectionRef.current.offsetHeight - window.innerHeight
        if (dist > 0) {
          prog = Math.max(0, Math.min(1, (initialTop - rect.top) / dist))
        }
      }

      if (dt > 0) vel = Math.abs(scrollY - lastScrollY) / dt
      lastScrollY = scrollY
      lastPerfT = perfT

      if (now - lastTick < 33) return
      lastTick = now

      const ts = Date.now()

      if (
        vel > 0.02 &&
        ts - lastSpawnRef.current > 50 &&
        packetsRef.current.length < 12 &&
        prog < 0.8
      ) {
        lastSpawnRef.current = ts
        packetIdRef.current += 1
        packetsRef.current = [
          ...packetsRef.current,
          {
            id: packetIdRef.current,
            progress: 0,
            targetProgress: 0,
            yOffset: (Math.random() - 0.5) * 50,
            size: 5 + Math.random() * 5,
          },
        ]
      }

      if (vel > 0.01) {
        const inc = Math.min(0.35, vel * 2.5)
        packetsRef.current = packetsRef.current.map((p) => ({
          ...p,
          targetProgress: Math.min(1.1, p.targetProgress + inc),
        }))
      }

      const animDone = prog > 0.35
      packetsRef.current = packetsRef.current
        .map((p) =>
          animDone
            ? { ...p, progress: p.progress + 0.08, targetProgress: 1.2 }
            : { ...p, progress: p.progress + (p.targetProgress - p.progress) * 0.15 }
        )
        .filter((p) => p.progress < 1.05)

      const bcr = containerRef.current?.getBoundingClientRect()
      const width = bcr?.width ?? 0
      const height = bcr?.height ?? 0

      if (!width || !height) return

      const startX = width * NODE_START_X
      const endX = width * NODE_END_X
      const centerY = height * NODE_Y

      const darkness = Math.min(1, Math.max(0, (prog - 0.08) / 0.14))
      setLineOpacity(0.6 - darkness * 0.2)
      setSenderDarkness(darkness)

      let newPhase: "active" | "transitioning" | "background" | "done"
      if (prog < 0.08) newPhase = "active"
      else if (prog < 0.22) newPhase = "transitioning"
      else if (prog < 0.75) newPhase = "background"
      else newPhase = "done"
      setPhase(newPhase)

      setRendered(
        packetsRef.current.map((p) => {
          const t = Math.max(0, Math.min(1, p.progress))
          const x = startX + (endX - startX) * t
          const wave = Math.sin(t * Math.PI * 1.5) * 10 * (1 - Math.abs(t - 0.5) * 0.5)
          const y = centerY + p.yOffset * 0.3 + wave
          let opacity = 1
          if (p.progress < 0.08) opacity = p.progress / 0.08
          else if (p.progress > 0.88) opacity = Math.max(0, (1 - p.progress) / 0.12)
          return { id: p.id, x, y, size: p.size, opacity }
        })
      )
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [sectionRef])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220px] sm:h-[280px] md:h-[350px]"
    >
      <div
        className="absolute"
        style={{
          left: `${NODE_START_X * 100}%`,
          right: `${(1 - NODE_END_X) * 100}%`,
          top: `calc(${NODE_Y * 100}% - 1px)`,
          height: 2,
          opacity: lineOpacity,
          backgroundImage:
            "repeating-linear-gradient(to right, rgb(32,178,170) 0px, rgb(32,178,170) 6px, transparent 6px, transparent 12px)",
        }}
      />

      {rendered.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size * 2,
            height: p.size * 2,
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
            opacity: p.opacity,
            background: "rgb(94,210,205)",
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(32,178,170,0.45)`,
          }}
        />
      ))}

      <div
        className="absolute flex flex-col items-center z-10 transition-all duration-700 ease-out"
        style={{
          left: "15%",
          top: "42%",
          transform: "translate(-50%, -50%)",
          "--darkness": senderDarkness,
        } as React.CSSProperties}
      >
        <div className="relative">
          <div
            className="relative p-3 sm:p-5 md:p-7 rounded-2xl border border-border bg-card transition-all duration-700 sender-node"
            style={{
              boxShadow:
                phase === "background" || phase === "done"
                  ? "0 0 20px rgba(32,178,170,0.08)"
                  : "0 0 40px rgba(32,178,170,0.15)",
            }}
          >
            <Smartphone className="w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 text-primary" />
          </div>
          {(phase === "background" || phase === "done") && (
            <div className="absolute -top-2 -right-2 bg-muted rounded-full p-1.5 border border-border animate-pulse">
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          )}
        </div>
        <span className="mt-3 text-xs md:text-sm font-medium text-muted-foreground">
          {phase === "background" ? "Background Mode" : "Your App"}
        </span>
      </div>

      <div
        className="absolute flex flex-col items-center z-10"
        style={{ left: "85%", top: "42%", transform: "translate(-50%, -50%)" }}
      >
        <div
          className="relative p-3 sm:p-5 md:p-7 rounded-2xl border border-border bg-card transition-all duration-300"
          style={{
            boxShadow: rendered.some(
              (p) => p.x / (containerRef.current?.getBoundingClientRect().width ?? 1) > 0.75
            )
              ? "0 0 50px rgba(32,178,170,0.35)"
              : "0 0 40px rgba(32,178,170,0.15)",
          }}
        >
          <Cloud className="w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 text-primary" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded text-xs font-mono text-primary border border-border">
            S3
          </div>
          {phase === "done" && (
            <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5 border border-background pop-in">
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          )}
        </div>
        <span className="mt-3 text-xs md:text-sm font-medium text-muted-foreground">
          Amazon S3
        </span>
      </div>

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
          {phase === "done" && "Upload complete"}
        </span>
      </div>
    </div>
  )
}
