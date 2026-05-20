"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Play,
  Check,
  X,
  Clock,
  Code2,
  Terminal,
  FileCode,
  Brain,
  Zap,
  RotateCcw,
  Send,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Cpu,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"

const languages = [
  { name: "JavaScript", icon: "JS" },
  { name: "Python", icon: "PY" },
  { name: "Java", icon: "JA" },
  { name: "C++", icon: "C+" },
  { name: "Go", icon: "GO" },
  { name: "TypeScript", icon: "TS" },
]

const testCases = [
  { id: 1, input: "[1,2,3,4,5], target = 9", expected: "[3,4]", status: "passed" },
  { id: 2, input: "[2,7,11,15], target = 9", expected: "[0,1]", status: "passed" },
  { id: 3, input: "[3,2,4], target = 6", expected: "[1,2]", status: "failed" },
  { id: 4, input: "[3,3], target = 6", expected: "[0,1]", status: "pending" },
]

const aiReview = [
  { type: "improvement", message: "Consider using a hash map for O(n) time complexity instead of O(n²)" },
  { type: "good", message: "Good variable naming and code readability" },
  { type: "warning", message: "Edge case: Empty array input not handled" },
  { type: "improvement", message: "Add comments explaining the algorithm approach" },
]

const codeExample = `function twoSum(nums, target) {
  // Create a hash map to store values and indices
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return []; // No solution found
}`

export default function CodingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript")
  const [code, setCode] = useState(codeExample)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => {
      setOutput("Output:\n[0, 1]\n\nExecution Time: 2ms\nMemory: 42.1 MB")
      setIsRunning(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="pl-64">
        <main className="p-6 h-screen overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold">Coding Interview</h1>
              <p className="text-muted-foreground">Practice coding problems with AI review</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-lg">25:00</span>
              </div>
              <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/20 text-green-500">
                In Progress
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
            {/* Left Column - Problem Statement */}
            <div className="space-y-6 overflow-y-auto pr-2">
              <GlassCard hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-xs font-medium">
                      Easy
                    </div>
                    <h2 className="text-lg font-semibold">Two Sum</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">Problem 1 of 3</span>
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    Given an array of integers <code className="bg-secondary px-1.5 py-0.5 rounded">nums</code> and an integer <code className="bg-secondary px-1.5 py-0.5 rounded">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                  <p className="text-muted-foreground">
                    You may assume that each input would have exactly one solution, and you may not use the same element twice.
                  </p>
                  <p className="text-muted-foreground">
                    You can return the answer in any order.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="font-semibold text-foreground mb-2">Example 1:</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Input:</strong> nums = [2,7,11,15], target = 9<br />
                        <strong>Output:</strong> [0,1]<br />
                        <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="font-semibold text-foreground mb-2">Example 2:</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Input:</strong> nums = [3,2,4], target = 6<br />
                        <strong>Output:</strong> [1,2]
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="font-semibold text-foreground mb-2">Constraints:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                      <li>2 ≤ nums.length ≤ 10⁴</li>
                      <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                      <li>-10⁹ ≤ target ≤ 10⁹</li>
                      <li>Only one valid answer exists.</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>

              {/* Test Cases */}
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Test Cases
                </h3>
                <div className="space-y-3">
                  {testCases.map((test) => (
                    <div
                      key={test.id}
                      className={`p-3 rounded-lg border ${
                        test.status === "passed"
                          ? "bg-green-500/5 border-green-500/30"
                          : test.status === "failed"
                          ? "bg-red-500/5 border-red-500/30"
                          : "bg-secondary/30 border-border/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Test Case {test.id}</span>
                        {test.status === "passed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : test.status === "failed" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <strong>Input:</strong> {test.input}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Expected:</strong> {test.expected}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* AI Code Review */}
              <GlassCard hover={false}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  AI Code Review
                </h3>
                <div className="space-y-3">
                  {aiReview.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-2 p-3 rounded-lg ${
                        review.type === "good"
                          ? "bg-green-500/5 border border-green-500/30"
                          : review.type === "warning"
                          ? "bg-yellow-500/5 border border-yellow-500/30"
                          : "bg-blue-500/5 border border-blue-500/30"
                      }`}
                    >
                      {review.type === "good" ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : review.type === "warning" ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Zap className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm">{review.message}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Complexity Analysis */}
                <div className="mt-4 p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Complexity Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Time Complexity</p>
                      <p className="font-mono text-primary">O(n)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Space Complexity</p>
                      <p className="font-mono text-accent">O(n)</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Code Editor */}
            <div className="flex flex-col gap-6">
              {/* Language Selector & Controls */}
              <GlassCard className="p-4" hover={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm"
                    >
                      {languages.map((lang) => (
                        <option key={lang.name} value={lang.name}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRun}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-primary to-accent"
                    >
                      {isRunning ? (
                        <>
                          <div className="h-4 w-4 mr-1 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="default">
                      <Send className="h-4 w-4 mr-1" />
                      Submit
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {/* Code Editor */}
              <GlassCard className="flex-1 p-0 overflow-hidden" hover={false}>
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-secondary/20">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">solution.js</span>
                </div>
                <div className="relative h-[calc(100%-40px)]">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-4 bg-transparent resize-none font-mono text-sm leading-relaxed focus:outline-none"
                    spellCheck={false}
                    style={{
                      tabSize: 2,
                    }}
                  />
                  {/* Line Numbers Overlay */}
                  <div className="absolute top-0 left-0 p-4 pointer-events-none font-mono text-sm leading-relaxed text-muted-foreground/50 select-none">
                    {code.split("\n").map((_, i) => (
                      <div key={i} className="pr-4 text-right w-8">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Output Console */}
              <GlassCard className="h-40 p-0 overflow-hidden" hover={false}>
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-secondary/20">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Output</span>
                </div>
                <div className="p-4 h-[calc(100%-40px)] overflow-y-auto">
                  {output ? (
                    <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                      {output}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click &quot;Run&quot; to see output...
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
