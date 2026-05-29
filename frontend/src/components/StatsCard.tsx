interface StatsCardProps {
  title: string
  value: string | number
  description: string
}

export default function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="glass-card p-6 border border-white/5 bg-white/[0.02]">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400 font-display">{title}</div>
      <div className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">{value}</div>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-450 leading-relaxed">{description}</p>
    </div>
  )
}
