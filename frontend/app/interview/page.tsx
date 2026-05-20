"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  StopCircle,
  Brain,
  Eye,
  Smile,
  Frown,
  Meh,
  MessageSquare,
  Clock,
  AlertTriangle,
  Gauge,
  Activity,
  Lightbulb,
  Send,
  ChevronRight,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Waveform } from "@/components/waveform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const questions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and weaknesses?",
  "Describe a challenging project you worked on.",
  "Where do you see yourself in 5 years?",
  "Why do you want to work for our company?",
]

const transcript = [
  { speaker: "AI", text: "Tell me about yourself and your background.", time: "0:15" },
  { speaker: "You", text: "I am a software engineer with 5 years of experience in full-stack development...", time: "0:45" },
  { speaker: "AI", text: "That's interesting! Can you tell me more about your experience with React?", time: "1:30" },
  { speaker: "You", text: "Yes, I have been working with React for the past 3 years, building complex web applications...", time: "2:15" },
]

const aiHints = [
  "Mention specific technologies you've worked with",
  "Use the STAR method for behavioral questions",
  "Maintain steady eye contact with the camera",
  "Speak clearly and at a moderate pace",
]

export default function InterviewPage() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userInput, setUserInput] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="pl-64">
        <main className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold">AI Interview Room</h1>
              <p className="text-muted-foreground">Practice your interview skills with AI</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-lg">{isInterviewStarted ? "12:45" : "00:00"}</span>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isInterviewStarted 
                  ? isPaused 
                    ? "bg-yellow-500/20 text-yellow-500" 
                    : "bg-green-500/20 text-green-500"
                  : "bg-muted text-muted-foreground"
              }`}>
                {isInterviewStarted ? (isPaused ? "Paused" : "Recording") : "Not Started"}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Video & Analytics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Section */}
              <GlassCard className="p-0 overflow-hidden" hover={false}>
                <div className="relative aspect-video bg-gradient-to-br from-secondary/50 to-secondary/20">
                  {/* Face Detection Border */}
                  <div className="absolute inset-8 border-2 border-dashed border-primary/50 rounded-2xl">
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg" />
                  </div>

                  {/* Camera Status */}
                  {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/80">
                      <div className="text-center">
                        <VideoOff className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Camera is off</p>
                      </div>
                    </div>
                  )}

                  {/* AI Avatar Placeholder */}
                  {isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                          <Brain className="h-16 w-16 text-primary" />
                        </div>
                        <p className="text-lg font-medium">AI Interviewer</p>
                        <p className="text-sm text-muted-foreground">Ready to begin</p>
                      </div>
                    </div>
                  )}

                  {/* Real-time Indicators */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-sm">
                      <Eye className="h-4 w-4 text-green-400" />
                      <span>Eye Contact: Good</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-sm">
                      <Smile className="h-4 w-4 text-blue-400" />
                      <span>Emotion: Confident</span>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="absolute top-4 right-4">
                    <div className="p-3 rounded-lg bg-black/50 backdrop-blur-sm">
                      <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: isInterviewStarted ? "78%" : "0%" }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                      <p className="text-right text-sm font-bold mt-1">78%</p>
                    </div>
                  </div>

                  {/* Voice Waveform */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="p-3 rounded-lg bg-black/50 backdrop-blur-sm">
                      <Waveform isActive={isInterviewStarted && !isPaused && isMicOn} />
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`rounded-full ${!isCameraOn ? "bg-destructive/20 text-destructive" : ""}`}
                    >
                      {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`rounded-full ${!isMicOn ? "bg-destructive/20 text-destructive" : ""}`}
                    >
                      {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    
                    {!isInterviewStarted ? (
                      <Button
                        size="lg"
                        onClick={() => setIsInterviewStarted(true)}
                        className="bg-gradient-to-r from-primary to-accent px-8"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start Interview
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsPaused(!isPaused)}
                          className="rounded-full"
                        >
                          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setCurrentQuestion(Math.min(currentQuestion + 1, questions.length - 1))}
                          className="rounded-full"
                        >
                          <SkipForward className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={() => {
                            setIsInterviewStarted(false)
                            setIsPaused(false)
                          }}
                          className="rounded-full"
                        >
                          <StopCircle className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Real-time Analytics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nervousness</p>
                      <p className="text-lg font-bold">Low</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Smile className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Smile Detection</p>
                      <p className="text-lg font-bold">Active</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <MessageSquare className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Filler Words</p>
                      <p className="text-lg font-bold">3</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4" hover={false}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Gauge className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Speaking Speed</p>
                      <p className="text-lg font-bold">Normal</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Right Column - Chat & Questions */}
            <div className="space-y-6">
              {/* Current Question */}
              <GlassCard hover={false}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold">Current Question</span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {currentQuestion + 1}/{questions.length}
                  </span>
                </div>
                <p className="text-lg font-medium mb-4">{questions[currentQuestion]}</p>
                <div className="flex gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-full h-1.5 rounded-full transition-colors ${
                        index === currentQuestion
                          ? "bg-primary"
                          : index < currentQuestion
                          ? "bg-primary/50"
                          : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
              </GlassCard>

              {/* Transcript */}
              <GlassCard className="max-h-64 overflow-y-auto" hover={false}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Live Transcript
                </h3>
                <div className="space-y-4">
                  {transcript.map((entry, index) => (
                    <div key={index} className={`flex gap-3 ${entry.speaker === "You" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.speaker === "AI" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                      }`}>
                        {entry.speaker === "AI" ? "AI" : "JD"}
                      </div>
                      <div className={`flex-1 p-3 rounded-lg ${
                        entry.speaker === "AI" ? "bg-secondary/30" : "bg-primary/10"
                      }`}>
                        <p className="text-sm">{entry.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* AI Hints */}
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  AI Hints
                </h3>
                <div className="space-y-2">
                  {aiHints.map((hint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                    >
                      <ChevronRight className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{hint}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Response */}
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4">Quick Response</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your response..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                  <Button size="icon" className="bg-gradient-to-r from-primary to-accent">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
