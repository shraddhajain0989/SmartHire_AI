"use client"

import * as React from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const [mounted, setMounted] = React.useState(false)
  const [particles, setParticles] = React.useState<{
    x: string
    y: string
    duration: number
    delay: number
  }[]>([])

  React.useEffect(() => {
    // Only generate random values on the client after mount to avoid
    // server/client hydration mismatches caused by Math.random()
    setMounted(true)
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 10,
      })),
    )
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-chart-3/10 rounded-full blur-3xl"
      />
      
      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Particles (client-only) */}
      {mounted &&
        particles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0.2,
            }}
            animate={{
              y: [null, '-100vh'],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
            className="absolute w-1 h-1 bg-primary/50 rounded-full"
          />
        ))}
    </div>
  )
}
