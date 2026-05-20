"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface WaveformProps {
  isActive?: boolean
  barCount?: number
  className?: string
}

export function Waveform({ 
  isActive = true, 
  barCount = 20,
  className = "" 
}: WaveformProps) {
  const bars = React.useMemo(
    () =>
      Array.from({ length: barCount }).map((_, i) => ({
        height: `${20 + ((i % 5) * 12)}%`,
        duration: 0.5 + ((i % 5) * 0.1),
        delay: i * 0.05,
      })),
    [barCount],
  )

  return (
    <div className={`flex items-end justify-center gap-1 h-12 ${className}`}>
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            height: ["20%", bar.height, "20%"],
          } : { height: "20%" }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: bar.delay,
          }}
          className="w-1 bg-gradient-to-t from-primary to-accent rounded-full"
          style={{ minHeight: "4px" }}
        />
      ))}
    </div>
  )
}
