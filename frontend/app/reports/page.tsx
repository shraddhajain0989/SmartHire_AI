"use client"

import { motion } from "framer-motion"
import {
  Download,
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Play,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import Link from "next/link"

const reports = [
  {
    id: 1,
    type: "Mock Interview",
    company: "Google",
    role: "Software Engineer",
    date: "Mar 15, 2024",
    duration: "32 min",
    score: 85,
    trend: "up",
  },
  {
    id: 2,
    type: "Coding Assessment",
    company: "Meta",
    role: "Frontend Developer",
    date: "Mar 12, 2024",
    duration: "45 min",
    score: 92,
    trend: "up",
  },
  {
    id: 3,
    type: "Mock Interview",
    company: "Amazon",
    role: "Data Scientist",
    date: "Mar 10, 2024",
    duration: "28 min",
    score: 78,
    trend: "down",
  },
  {
    id: 4,
    type: "Resume Analysis",
    company: "-",
    role: "-",
    date: "Mar 8, 2024",
    duration: "-",
    score: 74,
    trend: "up",
  },
  {
    id: 5,
    type: "Mock Interview",
    company: "Netflix",
    role: "Backend Engineer",
    date: "Mar 5, 2024",
    duration: "35 min",
    score: 88,
    trend: "up",
  },
]

const progressData = [
  { week: "Week 1", score: 65 },
  { week: "Week 2", score: 70 },
  { week: "Week 3", score: 72 },
  { week: "Week 4", score: 78 },
  { week: "Week 5", score: 82 },
  { week: "Week 6", score: 85 },
  { week: "Week 7", score: 88 },
  { week: "Week 8", score: 85 },
]

const stats = [
  { label: "Total Interviews", value: 24 },
  { label: "Avg Score", value: "82%" },
  { label: "Improvement", value: "+23%" },
  { label: "This Month", value: 8 },
]

export default function ReportsPage() {
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
              <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">Track your progress and view detailed reports</p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center" hover={false}>
                  <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Progress Chart */}
          <GlassCard className="mb-8" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">Your interview scores over time</p>
              </div>
              <select className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                <option>Last 8 weeks</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>All time</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Reports List */}
          <GlassCard hover={false}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold">All Reports</h3>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-10 bg-secondary/50 border-border/50"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.type === "Mock Interview"
                            ? "bg-primary/20 text-primary"
                            : report.type === "Coding Assessment"
                            ? "bg-accent/20 text-accent"
                            : "bg-chart-3/20 text-chart-3"
                        }`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium">{report.company}</td>
                      <td className="py-4 px-4 text-muted-foreground">{report.role}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {report.duration}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            report.score >= 85 ? "text-green-500" :
                            report.score >= 70 ? "text-yellow-500" : "text-red-500"
                          }`}>
                            {report.score}%
                          </span>
                          {report.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link href="/feedback">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          {report.type === "Mock Interview" && (
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Replay
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground">Showing 1-5 of 24 reports</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary/20">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
