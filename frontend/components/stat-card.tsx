"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  suffix?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "purple" | "cyan" | "green"
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = "",
  trend,
  color = "blue"
}: StatCardProps) {
  const colorClasses = {
    blue: "from-primary/20 to-primary/5 text-primary",
    purple: "from-chart-3/20 to-chart-3/5 text-chart-3",
    cyan: "from-accent/20 to-accent/5 text-accent",
    green: "from-chart-4/20 to-chart-4/5 text-chart-4"
  }

  const glowClasses = {
    blue: "bg-primary/20",
    purple: "bg-chart-3/20",
    cyan: "bg-accent/20",
    green: "bg-chart-4/20"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowClasses[color]} blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold">
          {value}
          {suffix && <span className="text-lg text-muted-foreground ml-1">{suffix}</span>}
        </p>
      </div>
    </motion.div>
  )
}
