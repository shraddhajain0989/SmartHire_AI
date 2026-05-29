import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Sparkles,
  BookOpen,
  HelpCircle,
  Play
} from 'lucide-react'

interface MCQQuestion {
  id: string
  topic: string
  difficulty: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const TOPICS = [
  'DBMS', 'OOPs', 'Operating Systems', 'CN', 'SQL', 'Python', 'Java', 'React', 'JavaScript', 'Data Analytics', 'Aptitude'
]
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function MCQPage() {
  // Config state
  const [quizStarted, setQuizStarted] = useState(false)
  const [topic, setTopic] = useState('DBMS')
  const [difficulty, setDifficulty] = useState('Medium')
  const [mode, setMode] = useState<'practice' | 'quiz'>('practice')
  const [aiGenerate, setAiGenerate] = useState(false)
  
  // Quiz state
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Question Timer (Quiz mode only)
  useEffect(() => {
    let interval: any
    if (quizStarted && !quizCompleted && !isAnswered && mode === 'quiz' && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1)
      }, 1000)
    } else if (timer === 0 && !isAnswered && mode === 'quiz') {
      handleOptionSelect(-1) // Timeout registers as wrong choice
    }
    return () => clearInterval(interval)
  }, [timer, quizStarted, quizCompleted, isAnswered, mode])

  const startQuiz = async () => {
    setLoading(true)
    setQuizCompleted(false)
    setCurrentIdx(0)
    setScore(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setTimer(30)
    try {
      let res
      if (aiGenerate) {
        res = await api.post('/practice/mcq/ai-generate', { topic, difficulty })
      } else {
        res = await api.get(`/practice/mcq/questions?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&limit=5`)
      }
      setQuestions(res.data.questions)
      setQuizStarted(true)
    } catch (err) {
      console.error("Failed to fetch MCQs", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return
    setSelectedOption(index)
    setIsAnswered(true)
    
    const q = questions[currentIdx]
    const isCorrect = index === q.correctIndex
    if (isCorrect) setScore(s => s + 1)
    
    // Save attempt asynchronously in background
    api.post('/practice/mcq', {
      mcq_id: q.id,
      selected_option: index,
      correct_option: q.correctIndex,
      score: isCorrect ? 1 : 0,
      topic: q.topic
    }).catch(err => console.error("Failed to log MCQ attempt", err))
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setTimer(30)
    } else {
      setQuizCompleted(true)
    }
  }

  // Configuration Setup Interface
  if (!quizStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <section className="glass-panel p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="text-center max-w-md mx-auto space-y-3 mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <BookOpen className="w-8 h-8 text-cyan-500" /> MCQ Practice Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Validate your technical knowledge. Select a topic, select a mode, and solve dynamic quizzes.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject / Topic</label>
                <select 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full glass-select px-4 py-3.5 text-sm outline-none"
                >
                  {TOPICS.map(t => (
                    <option key={t} value={t} className="bg-slate-900 text-slate-200">{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full glass-select px-4 py-3.5 text-sm outline-none"
                >
                  {DIFFICULTIES.map(d => (
                    <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">Practice Mode</label>
              <div className="grid gap-3 grid-cols-2">
                <button
                  onClick={() => setMode('practice')}
                  className={`glass-card p-4 text-left font-bold ${
                    mode === 'practice'
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="text-sm">Practice Mode</div>
                  <div className="text-[10px] font-normal text-slate-400 mt-1">Instant explanations after choosing. No timers.</div>
                </button>

                <button
                  onClick={() => setMode('quiz')}
                  className={`glass-card p-4 text-left font-bold ${
                    mode === 'quiz'
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="text-sm">Timed Quiz Mode</div>
                  <div className="text-[10px] font-normal text-slate-400 mt-1">30 seconds per question. Explanations hidden until final review.</div>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 glass-card p-4 border border-white/5">
              <input 
                type="checkbox" 
                id="ai-gen-check" 
                checked={aiGenerate} 
                onChange={e => setAiGenerate(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500 focus:ring-offset-slate-900" 
              />
              <label htmlFor="ai-gen-check" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 fill-current animate-pulse" /> Synthesize new questions dynamically using AI
              </label>
            </div>

            <div className="pt-4">
              <button
                onClick={startQuiz}
                disabled={loading}
                className="w-full glass-btn-primary py-4 text-sm font-bold disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : <><Play className="w-4.5 h-4.5 fill-current" /> Start Challenge</>}
              </button>
            </div>
          </div>
        </section>
      </motion.div>
    )
  }

  // Render final score dashboard on finish
  if (quizCompleted) {
    const accuracy = Math.round((score / questions.length) * 100)
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto space-y-8 py-12"
      >
        <section className="glass-panel p-8 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Quiz Completed!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Review your performance details below.</p>
          
          <div className="text-6xl font-black text-glow-cyan text-cyan-500 my-8">
            {score} <span className="text-2xl text-slate-400">/ {questions.length}</span>
          </div>

          <p className="text-sm font-semibold text-slate-600 dark:text-slate-350 mb-8">
            You achieved an accuracy of {accuracy}%. {accuracy >= 80 ? 'Incredible job!' : 'Good effort, keep practicing!'}
          </p>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setQuizStarted(false)} 
              className="glass-btn-secondary px-6 py-3 font-bold"
            >
              Configure Quiz
            </button>
            <button 
              onClick={startQuiz} 
              className="glass-btn-primary px-6 py-3 font-bold"
            >
              Try Again
            </button>
          </div>
        </section>
      </motion.div>
    )
  }

  const q = questions[currentIdx]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Progress & Timer Header */}
      <section className="flex items-center justify-between gap-4">
        <button 
          onClick={() => setQuizStarted(false)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> Quit Challenge
        </button>

        {mode === 'quiz' && (
          <div className="flex items-center gap-2 glass-card px-4 py-2 border-white/10">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span className={`font-mono font-bold ${timer <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
              00:{timer.toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </section>

      {/* Main Question Card */}
      {q && (
        <section className="glass-panel p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 uppercase tracking-widest">
                {q.topic}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-400">
                {q.difficulty}
              </span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {q.question}
          </h2>

          <div className="space-y-3.5 pt-2">
            {q.options.map((opt, idx) => {
              let btnClass = "glass-card text-slate-300 hover:border-cyan-400/50"
              let icon = null
              
              if (isAnswered) {
                if (idx === q.correctIndex) {
                  btnClass = "glass-card border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                } else if (idx === selectedOption) {
                  btnClass = "glass-card border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                  icon = <XCircle className="w-5 h-5 text-rose-500" />
                } else {
                  btnClass = "glass-card border-white/5 opacity-40 text-slate-400"
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full flex items-center justify-between p-5 text-left font-medium ${btnClass}`}
                >
                  <span>{opt}</span>
                  {icon}
                </button>
              )
            })}
          </div>

          {/* AI Explanation details */}
          <AnimatePresence>
            {isAnswered && (mode === 'practice' || quizCompleted) && q.explanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.08)] space-y-1.5"
              >
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5 text-glow-cyan">
                  <HelpCircle className="w-4 h-4" /> Explanation
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isAnswered && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleNext} 
                className="glass-btn-primary px-8 py-3.5 text-sm font-bold"
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
