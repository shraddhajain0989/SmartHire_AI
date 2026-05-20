"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Sparkles,
  Download,
  RefreshCw,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Award,
  Code,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard-topbar"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"

const keywordAnalysis = [
  { keyword: "React", count: 5, status: "good" },
  { keyword: "TypeScript", count: 3, status: "good" },
  { keyword: "Node.js", count: 4, status: "good" },
  { keyword: "AWS", count: 1, status: "warning" },
  { keyword: "Docker", count: 0, status: "missing" },
  { keyword: "CI/CD", count: 0, status: "missing" },
  { keyword: "Agile", count: 2, status: "good" },
  { keyword: "Leadership", count: 1, status: "warning" },
]

const missingSkills = [
  "Docker & Containerization",
  "CI/CD Pipeline Experience",
  "Cloud Architecture (GCP/Azure)",
  "Machine Learning Basics",
  "System Design",
]

const suggestions = [
  {
    type: "critical",
    title: "Add Quantifiable Achievements",
    description: "Include specific metrics and numbers to demonstrate impact (e.g., 'Improved performance by 40%')",
  },
  {
    type: "important",
    title: "Enhance Technical Skills Section",
    description: "Add Docker, Kubernetes, and CI/CD to match current market demands",
  },
  {
    type: "suggestion",
    title: "Optimize for ATS",
    description: "Use standard section headers like 'Experience', 'Education', 'Skills'",
  },
  {
    type: "suggestion",
    title: "Add a Professional Summary",
    description: "Include a 2-3 sentence summary highlighting your key strengths",
  },
]

const skillProgress = [
  { skill: "Technical Skills", current: 85, max: 100 },
  { skill: "Work Experience", current: 78, max: 100 },
  { skill: "Education", current: 90, max: 100 },
  { skill: "Projects", current: 72, max: 100 },
  { skill: "Certifications", current: 60, max: 100 },
]

export default function ResumePage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setIsUploaded(true)
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
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-muted-foreground">Upload your resume and get AI-powered insights</p>
          </motion.div>

          {!isUploaded ? (
            /* Upload Section */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <GlassCard hover={false}>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => setIsUploaded(true)}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/50 hover:bg-secondary/20"
                  }`}
                >
                  <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {isDragging ? "Drop your resume here" : "Upload Your Resume"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your resume or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            /* Analysis Results */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Resume Preview & Score */}
              <div className="lg:col-span-2 space-y-6">
                {/* Score Overview */}
                <GlassCard hover={false}>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <ProgressRing
                        value={78}
                        size={160}
                        strokeWidth={12}
                        color="hsl(var(--primary))"
                        label="ATS Score"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Resume Analysis Complete</h3>
                        <p className="text-muted-foreground">
                          Your resume scores 78/100 on ATS compatibility. Here&apos;s how to improve it.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button className="bg-gradient-to-r from-primary to-accent">
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </Button>
                        <Button variant="outline" onClick={() => setIsUploaded(false)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Upload New
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Resume Preview */}
                <GlassCard hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resume Preview
                    </h3>
                    <span className="text-sm text-muted-foreground">john_doe_resume.pdf</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 space-y-6 font-mono text-sm">
                    {/* Header */}
                    <div className="text-center border-b border-border/30 pb-4">
                      <h2 className="text-xl font-bold text-foreground">John Doe</h2>
                      <p className="text-muted-foreground">Senior Software Engineer</p>
                      <p className="text-xs text-muted-foreground">john@example.com | +1 (555) 123-4567 | San Francisco, CA</p>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4" /> Experience
                      </h3>
                      <div className="pl-6 space-y-2">
                        <div>
                          <p className="font-semibold">Senior Software Engineer - Tech Corp</p>
                          <p className="text-xs text-muted-foreground">Jan 2022 - Present</p>
                          <p className="text-muted-foreground">• Led development of microservices architecture</p>
                          <p className="text-muted-foreground">• Mentored team of 5 junior developers</p>
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4" /> Education
                      </h3>
                      <div className="pl-6">
                        <p className="font-semibold">B.S. Computer Science - Stanford University</p>
                        <p className="text-xs text-muted-foreground">Graduated 2018</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4" /> Skills
                      </h3>
                      <div className="pl-6 flex flex-wrap gap-2">
                        {["React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL"].map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-primary/10 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* AI Suggestions */}
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">AI Improvement Suggestions</h3>
                  </div>
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border ${
                          suggestion.type === "critical"
                            ? "bg-red-500/5 border-red-500/30"
                            : suggestion.type === "important"
                            ? "bg-yellow-500/5 border-yellow-500/30"
                            : "bg-blue-500/5 border-blue-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {suggestion.type === "critical" ? (
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          ) : suggestion.type === "important" ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold">{suggestion.title}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Right Column - Analysis Details */}
              <div className="space-y-6">
                {/* Job Match */}
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Job Match Analysis</h3>
                  </div>
                  <div className="text-center mb-6">
                    <ProgressRing
                      value={72}
                      size={100}
                      strokeWidth={8}
                      color="hsl(var(--accent))"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Resume-Job Match</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your resume matches 72% of the requirements for Senior Software Engineer positions.
                  </p>
                </GlassCard>

                {/* Keyword Analysis */}
                <GlassCard hover={false}>
                  <h3 className="font-semibold mb-4">Keyword Analysis</h3>
                  <div className="space-y-3">
                    {keywordAnalysis.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.status === "good" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : item.status === "warning" ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{item.keyword}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          item.status === "good" ? "text-green-500" :
                          item.status === "warning" ? "text-yellow-500" : "text-red-500"
                        }`}>
                          {item.count > 0 ? `${item.count}x` : "Missing"}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Missing Skills */}
                <GlassCard hover={false}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Skills to Add
                  </h3>
                  <div className="space-y-2">
                    {missingSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                      >
                        <ChevronRight className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Section Scores */}
                <GlassCard hover={false}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Section Scores
                  </h3>
                  <div className="space-y-4">
                    {skillProgress.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.skill}</span>
                          <span className="text-muted-foreground">{item.current}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.current}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
