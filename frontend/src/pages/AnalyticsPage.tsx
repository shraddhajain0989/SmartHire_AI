import { useEffect, useState } from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { fetchAnalytics } from '../services/interview'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl transition-all duration-300">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Training analytics</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Complete practice sessions, mock interviews, and evaluate your readiness.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Growth Chart Card */}
        <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Score growth</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trend || []}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="session" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '1rem', color: '#fff' }} />
                <Area type="monotone" dataKey="score" stroke="#22D3EE" fill="url(#scoreGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assessment Metrics Card */}
        <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Assessment metrics</h2>
          <div className="mt-5 space-y-4 text-slate-650 dark:text-slate-350">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-5 transition-colors duration-300">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300/90 font-medium">Average similarity</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{analytics?.average_similarity ?? 'N/A'}%</p>
            </div>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-5 transition-colors duration-300">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300/90 font-medium">Completed Rounds</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{analytics?.completed_interviews ?? '0'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
