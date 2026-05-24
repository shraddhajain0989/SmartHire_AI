interface StatsCardProps {
  title: string
  value: string | number
  description: string
}

export default function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
      <div className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200/80">{title}</div>
      <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-350">{description}</p>
    </div>
  )
}
