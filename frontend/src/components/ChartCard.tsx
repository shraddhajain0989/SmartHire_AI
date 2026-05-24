import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </div>
  )
}
