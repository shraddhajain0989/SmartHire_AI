"use client"

import { motion } from "framer-motion"
import {
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Brain,
  Eye,
  Mic,
  Heart,
  Target,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const overallScore = 85

const skillsRadarData = [
  { skill: "Communication", score: 88 },
  { skill: "Technical", score: 82 },
  { skill: "Confidence", score: 85 },
  { skill: "Eye Contact", score: 92 },
  { skill: "Speech Clarity", score: 78 },
  { skill: "Body Language", score: 80 },
]

const emotionData = [
  { name: "Confident", value: 45, color: "#22c55e" },
  { name: "Neutral", value: 30, color: "#3b82f6" },
  { name: "Nervous", value: 15, color: "#f59e0b" },
  { name: "Hesitant", value: 10, color: "#ef4444" },
]

const performanceTimeline = [
  { time: "0:00", confidence: 70, engagement: 65 },
  { time: "5:00", confidence: 75, engagement: 72 },
  { time: "10:00", confidence: 82, engagement: 78 },
  { time: "15:00", confidence: 78, engagement: 80 },
  { time: "20:00", confidence: 85, engagement: 85 },
  { time: "25:00", confidence: 88, engagement: 82 },
  { time: "30:00", confidence: 90, engagement: 88 },
]

const questionScores = [
  { question: "Q1", score: 85 },
  { question: "Q2", score: 78 },
  { question: "Q3", score: 92 },
  { question: "Q4", score: 70 },
  { question: "Q5", score: 88 },
]

const improvements = [
  {
    area: "Reduce Filler Words",
    current: "12 instances",
    target: "< 5 instances",
    priority: "high",
  },
  {
    area: "Eye Contact Consistency",
    current: "78%",
    target: "90%+",
    priority: "medium",
  },
  {
    area: "Answer Structure",
    current: "Good",
    target: "Excellent",
    priority: "low",
  },
  {
    area: "Technical Depth",
    current: "Moderate",
    target: "Deep",
    priority: "high",
  },
]

const feedbackHighlights = [
  { type: "strength", text: "Excellent communication skills and clear articulation" },
  { type: "strength", text: "Strong technical knowledge demonstrated in coding questions" },
  { type: "strength", text: "Good use of STAR method for behavioral questions" },
  { type: "improvement", text: "Reduce use of filler words like 'um' and 'uh'" },
  { type: "improvement", text: "Maintain more consistent eye contact with the camera" },
  { type: "improvement", text: "Provide more specific examples in leadership questions" },
]

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="pl-64">
        <DashboardTopbar />
        
        <main className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Feedback Report</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  March 15, 2024
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration: 32 minutes
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Report
              </Button>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </motion.div>

          {/* Overall Score */}
          <GlassCard className="mb-8" hover={false}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <ProgressRing
                  value={overallScore}
                  size={180}
                  strokeWidth={14}
                  color="hsl(var(--primary))"
                  label="Overall Score"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Excellent Performance!</h2>
                <p className="text-muted-foreground mb-4">
                  You scored in the top 15% of all candidates. Your communication skills 
                  and technical knowledge stood out. Focus on reducing filler words and 
                  maintaining consistent eye contact to reach an even higher score.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-500">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Top Performer</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Communication Expert</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Skills Radar */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Skills Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillsRadarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Emotion Analysis */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Emotional Intelligence
              </h3>
              <div className="h-72 flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {emotionData.map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: emotion.color }}
                        />
                        <span className="text-sm">{emotion.name}</span>
                      </div>
                      <span className="text-sm font-medium">{emotion.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Performance Timeline */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Performance Timeline
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Question-wise Scores */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-chart-3" />
                Question-wise Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={questionScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="question" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Communication</p>
                    <p className="text-2xl font-bold">88%</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technical</p>
                    <p className="text-2xl font-bold">82%</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Eye className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Eye Contact</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-3/20">
                    <Mic className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Speech Clarity</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Improvement Areas */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-4">Improvement Roadmap</h3>
              <div className="space-y-3">
                {improvements.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      item.priority === "high"
                        ? "bg-red-500/5 border-red-500/30"
                        : item.priority === "medium"
                        ? "bg-yellow-500/5 border-yellow-500/30"
                        : "bg-green-500/5 border-green-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.area}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.priority === "high"
                          ? "bg-red-500/20 text-red-500"
                          : item.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-green-500/20 text-green-500"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.current}</span>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-foreground">{item.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* AI Recommendations */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Feedback Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-500 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {feedbackHighlights
                    .filter((f) => f.type === "strength")
                    .map((feedback, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/30"
                      >
                        <Star className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{feedback.text}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-yellow-500 mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Areas to Improve
                </h4>
                <div className="space-y-2">
                  {feedbackHighlights
                    .filter((f) => f.type === "improvement")
                    .map((feedback, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/30"
                      >
                        <Target className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{feedback.text}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
