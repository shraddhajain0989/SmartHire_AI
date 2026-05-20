"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreHorizontal,
  Eye,
  Video,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { GlassCard } from "@/components/glass-card"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const candidates = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    role: "Software Engineer",
    score: 92,
    status: "shortlisted",
    interviewDate: "Mar 15, 2024",
    resumeMatch: 88,
    avatar: "SC",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    email: "m.rodriguez@email.com",
    role: "Product Manager",
    score: 85,
    status: "pending",
    interviewDate: "Mar 14, 2024",
    resumeMatch: 82,
    avatar: "MR",
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily.j@email.com",
    role: "Data Scientist",
    score: 78,
    status: "pending",
    interviewDate: "Mar 13, 2024",
    resumeMatch: 75,
    avatar: "EJ",
  },
  {
    id: 4,
    name: "David Kim",
    email: "d.kim@email.com",
    role: "Frontend Developer",
    score: 68,
    status: "rejected",
    interviewDate: "Mar 12, 2024",
    resumeMatch: 70,
    avatar: "DK",
  },
  {
    id: 5,
    name: "Jessica Taylor",
    email: "j.taylor@email.com",
    role: "Software Engineer",
    score: 95,
    status: "shortlisted",
    interviewDate: "Mar 11, 2024",
    resumeMatch: 92,
    avatar: "JT",
  },
  {
    id: 6,
    name: "Alex Thompson",
    email: "alex.t@email.com",
    role: "Backend Engineer",
    score: 72,
    status: "pending",
    interviewDate: "Mar 10, 2024",
    resumeMatch: 78,
    avatar: "AT",
  },
]

const hiringData = [
  { month: "Jan", applications: 45, interviews: 32, hired: 8 },
  { month: "Feb", applications: 62, interviews: 48, hired: 12 },
  { month: "Mar", applications: 78, interviews: 55, hired: 15 },
]

const statusData = [
  { name: "Shortlisted", value: 35, color: "#22c55e" },
  { name: "Pending", value: 45, color: "#3b82f6" },
  { name: "Rejected", value: 20, color: "#ef4444" },
]

const topCandidates = [
  { name: "Jessica Taylor", role: "Software Engineer", score: 95 },
  { name: "Sarah Chen", role: "Software Engineer", score: 92 },
  { name: "Michael Rodriguez", role: "Product Manager", score: 85 },
]

export default function RecruiterPage() {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])

  const toggleCandidate = (id: number) => {
    setSelectedCandidates(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

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
              <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
              <p className="text-muted-foreground">Manage candidates and hiring pipeline</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Candidate
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Candidates"
              value={156}
              trend={{ value: 12, isPositive: true }}
              color="blue"
            />
            <StatCard
              icon={Briefcase}
              label="Active Positions"
              value={8}
              color="purple"
            />
            <StatCard
              icon={Calendar}
              label="Interviews This Week"
              value={24}
              trend={{ value: 8, isPositive: true }}
              color="cyan"
            />
            <StatCard
              icon={TrendingUp}
              label="Hire Rate"
              value={68}
              suffix="%"
              trend={{ value: 5, isPositive: true }}
              color="green"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Hiring Analytics */}
            <GlassCard className="lg:col-span-2" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Hiring Analytics</h3>
                  <p className="text-sm text-muted-foreground">Monthly overview</p>
                </div>
                <select className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>This year</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hiringData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interviews" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hired" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Status Distribution */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold mb-4">Candidate Status</h3>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {statusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span>{status.name}</span>
                    </div>
                    <span className="font-medium">{status.value}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Candidates Table */}
            <GlassCard className="lg:col-span-3" hover={false}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold">Candidate Management</h3>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedCandidates.length > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-primary/10">
                  <span className="text-sm">{selectedCandidates.length} selected</span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Shortlist All
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    Reject All
                  </Button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCandidates(candidates.map(c => c.id))
                            } else {
                              setSelectedCandidates([])
                            }
                          }}
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Candidate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">AI Score</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Resume Match</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate, index) => (
                      <motion.tr
                        key={candidate.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={selectedCandidates.includes(candidate.id)}
                            onChange={() => toggleCandidate(candidate.id)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                              {candidate.avatar}
                            </div>
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-xs text-muted-foreground">{candidate.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{candidate.role}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  candidate.score >= 85 ? "bg-green-500" :
                                  candidate.score >= 70 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${candidate.score}%` }}
                              />
                            </div>
                            <span className="font-medium">{candidate.score}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-muted-foreground">{candidate.resumeMatch}%</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            candidate.status === "shortlisted"
                              ? "bg-green-500/20 text-green-500"
                              : candidate.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-red-500/20 text-red-500"
                          }`}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Top Candidates */}
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Top Candidates
                </h3>
                <div className="space-y-3">
                  {topCandidates.map((candidate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div>
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-bold">{candidate.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Bulk Emails
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Interviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Reports
                  </Button>
                </div>
              </GlassCard>

              {/* AI Ranking Info */}
              <GlassCard className="bg-primary/5 border-primary/30" hover={false}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI Ranking System</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Candidates are ranked based on interview performance, 
                      resume match, and communication skills.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
