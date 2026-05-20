"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  MessageSquare,
  Code,
  Eye,
  Smile,
  FileText,
  Calendar,
  Clock,
  Play,
  BarChart3,
  Target,
  Brain,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { StatCard } from "@/components/stat-card"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts"

const performanceData = [
  { name: "Week 1", confidence: 65, communication: 70, technical: 60 },
  { name: "Week 2", confidence: 70, communication: 75, technical: 68 },
  { name: "Week 3", confidence: 75, communication: 78, technical: 72 },
  { name: "Week 4", confidence: 82, communication: 85, technical: 78 },
  { name: "Week 5", confidence: 85, communication: 88, technical: 82 },
  { name: "Week 6", confidence: 87, communication: 90, technical: 85 },
]

const skillsData = [
  { skill: "Communication", value: 88 },
  { skill: "Technical", value: 82 },
  { skill: "Problem Solving", value: 85 },
  { skill: "Leadership", value: 78 },
  { skill: "Creativity", value: 80 },
  { skill: "Adaptability", value: 90 },
]

const upcomingInterviews = [
  { company: "Google", role: "Software Engineer", date: "Mar 15, 2024", time: "10:00 AM" },
  { company: "Meta", role: "Product Manager", date: "Mar 18, 2024", time: "2:00 PM" },
  { company: "Amazon", role: "Data Scientist", date: "Mar 22, 2024", time: "11:00 AM" },
]

const recentActivity = [
  { type: "interview", title: "Completed Mock Interview", time: "2 hours ago", score: 85 },
  { type: "resume", title: "Resume Analysis Updated", time: "5 hours ago", score: 78 },
  { type: "coding", title: "Solved 3 Coding Problems", time: "1 day ago", score: 92 },
  { type: "feedback", title: "AI Feedback Received", time: "2 days ago", score: 80 },
]

const aiSuggestions = [
  "Practice STAR method for behavioral questions",
  "Improve eye contact during responses",
  "Reduce filler words like 'um' and 'uh'",
  "Add more quantifiable achievements to resume",
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="pl-64">
        <DashboardTopbar />
        
        <main className="p-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here&apos;s your interview preparation progress</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={TrendingUp}
              label="Confidence Score"
              value={87}
              suffix="%"
              trend={{ value: 12, isPositive: true }}
              color="blue"
            />
            <StatCard
              icon={MessageSquare}
              label="Communication Score"
              value={90}
              suffix="%"
              trend={{ value: 8, isPositive: true }}
              color="purple"
            />
            <StatCard
              icon={Code}
              label="Technical Score"
              value={85}
              suffix="%"
              trend={{ value: 15, isPositive: true }}
              color="cyan"
            />
            <StatCard
              icon={Eye}
              label="Eye Contact"
              value={92}
              suffix="%"
              trend={{ value: 5, isPositive: true }}
              color="green"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Performance Chart */}
            <GlassCard className="lg:col-span-2" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Performance Trend</h3>
                  <p className="text-sm text-muted-foreground">Your progress over time</p>
                </div>
                <select className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  <option>Last 6 weeks</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                </select>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCommunication" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorConfidence)"
                    />
                    <Area
                      type="monotone"
                      dataKey="communication"
                      stroke="hsl(var(--accent))"
                      fillOpacity={1}
                      fill="url(#colorCommunication)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Skills Radar */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-2">Skills Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">Your strengths breakdown</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillsData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Rings */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-6">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <ProgressRing value={85} color="hsl(var(--primary))" label="Overall" />
                </div>
                <div className="flex flex-col items-center">
                  <ProgressRing value={78} color="hsl(var(--accent))" label="Resume Match" />
                </div>
                <div className="flex flex-col items-center">
                  <ProgressRing value={92} color="hsl(var(--chart-4))" label="Emotion" />
                </div>
                <div className="flex flex-col items-center">
                  <ProgressRing value={88} color="hsl(var(--chart-3))" label="Speech" />
                </div>
              </div>
            </GlassCard>

            {/* Upcoming Interviews */}
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {upcomingInterviews.map((interview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{interview.company}</p>
                      <p className="text-sm text-muted-foreground">{interview.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{interview.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {interview.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link href="/interview">
                <Button className="w-full mt-4 bg-gradient-to-r from-primary to-accent">
                  <Play className="mr-2 h-4 w-4" />
                  Start Mock Interview
                </Button>
              </Link>
            </GlassCard>

            {/* AI Suggestions */}
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Suggestions</h3>
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Activity Timeline */}
          <GlassCard className="mt-6" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "interview" ? "bg-primary/20" :
                      activity.type === "resume" ? "bg-accent/20" :
                      activity.type === "coding" ? "bg-chart-4/20" : "bg-chart-3/20"
                    }`}>
                      {activity.type === "interview" && <MessageSquare className="h-4 w-4 text-primary" />}
                      {activity.type === "resume" && <FileText className="h-4 w-4 text-accent" />}
                      {activity.type === "coding" && <Code className="h-4 w-4 text-chart-4" />}
                      {activity.type === "feedback" && <Brain className="h-4 w-4 text-chart-3" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{activity.score}%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
