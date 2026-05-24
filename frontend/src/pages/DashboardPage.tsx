import { useEffect, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import useAuth from '../hooks/useAuth'
import { fetchAnalytics } from '../services/interview'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const chartData = analytics?.trend || []
  const skillData = analytics?.skills || []

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl transition-all duration-300">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Welcome back, {user?.name || 'Student'}</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Practice interviews, track weak areas, and improve your placement performance.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Completed Activities" value={analytics?.interview_count ?? 0} description="Completed coding attempts and mock interviews" />
          <StatsCard title="Confidence" value={`${analytics?.confidence_score ?? 0}%`} description="AI measured readiness score" />
          <StatsCard title="Improvement" value={`${analytics?.trend_delta ?? 0}%`} description="Performance growth delta" />
          <StatsCard title="Weak topics" value={analytics?.weak_topics?.length ?? 0} description="Areas requiring strengthening" />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Performance Chart Card */}
        <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Performance trend</h2>
              <p className="text-sm text-slate-550 dark:text-slate-400">Track score improvements across practice rounds.</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="session" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '1rem', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#22D3EE" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Weak Topics & Skill Distribution */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Weak skills</h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              {(analytics?.weak_topics || ['Communication', 'System design', 'Behavioral']).map((topic: string) => (
                <li key={topic} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 px-4 py-3 font-medium transition-colors duration-300">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Skill distribution</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={skillData.length ? skillData : [{ name: 'Technical', value: 40 }, { name: 'Behavior', value: 30 }, { name: 'HR', value: 30 }]} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} fill="#22D3EE">
                    {skillData.length
                      ? skillData.map((entry: any, index: number) => <Cell key={entry.name} fill={['#38BDF8', '#A78BFA', '#F472B6'][index % 3]} />)
                      : ['#38BDF8', '#A78BFA', '#F472B6'].map((color, index) => <Cell key={index} fill={color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
