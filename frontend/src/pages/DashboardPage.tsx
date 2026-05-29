import { useEffect, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'
import useAuth from '../hooks/useAuth'
import { fetchAnalytics } from '../services/interview'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const COLORS = ['#4F46E5', '#06B6D4', '#6366F1', '#22D3EE']

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
  const pieData = analytics?.practice_breakdown || [
    { name: 'Coding', value: 1 },
    { name: 'MCQ', value: 1 },
    { name: 'Verbal', value: 1 },
    { name: 'Interviews', value: 1 }
  ]

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 font-body pb-12"
    >
      {/* Welcome & Streaks banner */}
      <section className="glass-panel p-8 overflow-hidden transition-all duration-300">
        <div className="glow-background-glow absolute top-[-50px] right-[-50px] w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 font-display">
              Welcome, {user?.name || 'Student'} 
              <Sparkles className="w-5 h-5 text-cyan-400 fill-current animate-pulse text-glow-cyan" />
            </h1>
            <p className="mt-1.5 text-sm text-slate-650 dark:text-slate-400 font-medium">Evaluate your engineering credentials, solve algorithm maps, and review mock playback logs.</p>
          </div>
          
          <div className="flex gap-2">
            <Link 
              to="/interview" 
              className="glass-btn-primary px-6 py-3 text-sm"
            >
              <span>Start Mock Interview</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 relative z-10">
          <StatsCard title="Completed Activities" value={analytics?.completed_interviews + analytics?.coding_solved || 0} description="Total algorithms and mock transcripts" />
          <StatsCard title="Avg Match Rate" value={`${analytics?.average_similarity || 0}%`} description="AI confidence and similarity index" />
          <StatsCard title="Practice Streak" value={`${analytics?.streak || 0} Days`} description="Consecutive days active" />
          <StatsCard title="Focus Needed" value={analytics?.weak_topics?.length || 0} description="Identified weakness modules" />
        </div>
      </section>

      {/* Main dashboard widgets */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Growth Trend chart */}
        <div className="xl:col-span-2 glass-panel p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <TrendingUp className="w-5 h-5 text-cyan-400 text-glow-cyan" /> Performance Trajectory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">Historical similarity metrics parsed across your recent mock attempts.</p>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="session" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10, 8, 28, 0.85)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    color: '#fff', 
                    fontSize: 12,
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="url(#colorScore)" strokeWidth={0} fillOpacity={1} fill="url(#colorScore)" />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weakness lists & practice distributions */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-display">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Focus Areas
            </h2>
            <ul className="space-y-2.5">
              {analytics?.weak_topics?.length ? (
                analytics.weak_topics.slice(0, 3).map((topic: string) => (
                  <li key={topic} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] px-4.5 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-300">
                    <span>{topic}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/15">Urgent</span>
                  </li>
                ))
              ) : (
                ['Communication', 'System Design', 'Algorithms'].map((topic: string) => (
                  <li key={topic} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] px-4.5 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-300">
                    <span>{topic}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">Baseline</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-display">
              <Activity className="w-5 h-5 text-cyan-450 text-glow-cyan" />
              Practice Distribution
            </h2>
            
            <div className="h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    innerRadius={45} 
                    outerRadius={68} 
                    paddingAngle={6}
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 space-y-2">
                {pieData.slice(0, 4).map((entry: any, index: number) => (
                  <div key={entry.name} className="flex items-center gap-2 text-[10px] text-slate-650 dark:text-slate-400 font-bold uppercase tracking-wide font-display">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
