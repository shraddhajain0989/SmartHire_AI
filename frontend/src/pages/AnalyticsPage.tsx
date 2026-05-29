import { useEffect, useState } from 'react'
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion } from 'framer-motion'
import { 
  Award, 
  Flame, 
  LineChart, 
  Radar as RadarIcon, 
  PieChart as PieIcon, 
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

const COLORS = ['#22D3EE', '#38BDF8', '#818CF8', '#A78BFA', '#F472B6']

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/summary')
      .then((res) => setAnalytics(res.data))
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

  // Fallbacks
  const skillsData = analytics?.skills?.length ? analytics.skills : [
    { subject: 'Algorithms', A: 80, fullMark: 100 },
    { subject: 'System Design', A: 65, fullMark: 100 },
    { subject: 'DBMS', A: 90, fullMark: 100 },
    { subject: 'Communication', A: 70, fullMark: 100 },
    { subject: 'Behavioral', A: 85, fullMark: 100 }
  ]

  const pieData = analytics?.practice_breakdown || [
    { name: 'Coding', value: 1 },
    { name: 'MCQ', value: 1 },
    { name: 'Verbal', value: 1 },
    { name: 'Interviews', value: 1 }
  ]

  // Shading helper for Consistency Heatmap squares
  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-white/5 border-white/10'
    if (count <= 2) return 'bg-cyan-500/20 border-cyan-500/10'
    if (count <= 5) return 'bg-cyan-500/50 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
    return 'bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] text-glow-cyan'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <section className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-cyan-500" />
          Advanced Analytics Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Track and optimize your strengths, evaluate inconsistencies, and read personalized AI recommendations.</p>
        
        {/* AI Insight banner */}
        {analytics?.ai_insight && (
          <div className="mt-6 p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-cyan-500 fill-current animate-pulse shrink-0 mt-0.5 text-glow-cyan" />
            <div>
              <h3 className="font-bold text-cyan-400 text-sm text-glow-cyan">AI Performance Advisor</h3>
              <p className="text-slate-300 mt-1 text-xs leading-relaxed">{analytics.ai_insight}</p>
            </div>
          </div>
        )}
      </section>

      {/* KPI Stats widgets grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-6 overflow-hidden">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Avg Interview Score</p>
          <p className="mt-3.5 text-3xl font-black text-slate-900 dark:text-white">{analytics?.average_similarity || 0}%</p>
          <div className="text-[10px] text-slate-400 mt-1">across {analytics?.completed_interviews || 0} session(s)</div>
        </div>
        <div className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Coding Accuracy</p>
          <p className="mt-3.5 text-3xl font-black text-slate-900 dark:text-white">{analytics?.coding_accuracy || 0}%</p>
          <div className="text-[10px] text-slate-400 mt-1">{analytics?.coding_solved || 0} question(s) completed</div>
        </div>
        <div className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Theory MCQ Accuracy</p>
          <p className="mt-3.5 text-3xl font-black text-slate-900 dark:text-white">{analytics?.mcq_accuracy || 0}%</p>
          <div className="text-[10px] text-slate-400 mt-1">on dynamic practice mode</div>
        </div>
        <div className="glass-panel p-6 overflow-hidden">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Consistency Streak</p>
          <p className="mt-3.5 text-3xl font-black text-emerald-400 flex items-center gap-1.5 text-glow-cyan">
            <Flame className="w-6 h-6 fill-current text-orange-500 animate-bounce" />
            {analytics?.streak || 0} days
          </p>
          <div className="text-[10px] text-slate-400 mt-1">keeps daily practice active</div>
        </div>
      </div>

      {/* GitHub Consistency Heatmap Grid */}
      {analytics?.heatmap && (
        <section className="glass-panel p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-500" />
            Consistency Heatmap (90 Days)
          </h2>
          <p className="text-xs text-slate-400 font-medium">Daily compilation of mock interviews, coding practices, and MCQ quizzes.</p>
          
          <div className="flex flex-wrap gap-1.5 pt-2 max-w-full overflow-x-auto pb-2">
            {analytics.heatmap.map((day: any, idx: number) => (
              <div 
                key={idx}
                className={`w-6 h-6 rounded-md border text-center transition-all ${getHeatmapColor(day.count)}`}
                title={`${day.date}: ${day.count} attempt(s)`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
            <div className="w-3.5 h-3.5 rounded bg-cyan-500/20" />
            <div className="w-3.5 h-3.5 rounded bg-cyan-500/50" />
            <div className="w-3.5 h-3.5 rounded bg-cyan-500" />
            <span>More</span>
          </div>
        </section>
      )}

      {/* Strengths & Weaknesses chips */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="glass-panel p-6">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Strong Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {analytics?.strong_topics?.length ? (
              analytics.strong_topics.map((t: string) => (
                <span key={t} className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)] text-xs font-bold rounded-xl border border-emerald-500/20">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-semibold italic">Completing more solutions to compile strong subjects...</span>
            )}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Topic Weaknesses
          </h3>
          <div className="flex flex-wrap gap-2">
            {analytics?.weak_topics?.length ? (
              analytics.weak_topics.map((t: string) => (
                <span key={t} className="px-3.5 py-1.5 bg-rose-500/10 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)] text-xs font-bold rounded-xl border border-rose-500/20">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-semibold italic">No significant topic weaknesses detected! Excellent accuracy.</span>
            )}
          </div>
        </section>
      </div>

      {/* Visual Chart Widgets Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score progression area chart */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-cyan-500" />
            Session Score Growth
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trend || []}>
                <defs>
                  <linearGradient id="scoreGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="session" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(10, 8, 28, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#22D3EE" fill="url(#scoreGrowthGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radars for Skills stats */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <RadarIcon className="w-5 h-5 text-cyan-500" />
            Subdomain Competency Radar
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Performance" dataKey="A" stroke="#818CF8" fill="#818CF8" fillOpacity={0.5} />
                <Tooltip contentStyle={{ background: 'rgba(10, 8, 28, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Piechart practice breakdown */}
        <div className="glass-panel p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-cyan-500" />
            Activity Practice Distribution
          </h2>
          <div className="h-72 flex flex-col sm:flex-row items-center justify-center relative gap-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10, 8, 28, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend layout */}
            <div className="flex sm:flex-col flex-wrap justify-center gap-4 shrink-0 sm:pr-8">
              {pieData.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-2.5 text-xs text-slate-300 font-bold uppercase tracking-wider">
                  <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}: {Math.round(entry.value)} unit(s)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
