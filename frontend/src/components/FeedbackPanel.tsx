interface FeedbackPanelProps {
  title: string
  value: string | number
  note: string
}

export default function FeedbackPanel({ title, value, note }: FeedbackPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-glass backdrop-blur-xl">
      <h3 className="text-sm uppercase tracking-[0.2em] text-cyan-300/90">{title}</h3>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>
    </div>
  )
}
