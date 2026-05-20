"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: "blue" | "purple" | "cyan" | "none"
  hover?: boolean
}

export function GlassCard({ 
  children, 
  className = "", 
  glow = "none",
  hover = true 
}: GlassCardProps) {
  const glowClasses = {
    blue: "glow-blue",
    purple: "glow-purple",
    cyan: "glow-cyan",
    none: ""
  }

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        glass-card rounded-2xl p-6
        ${glowClasses[glow]}
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
