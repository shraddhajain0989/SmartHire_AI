import { useEffect, useState } from 'react'
import { fetchCodingQuestions, submitCodingSolution, CodingQuestion, RunCodeResponse } from '../services/coding'
import LoadingSpinner from '../components/LoadingSpinner'
import Editor from '@monaco-editor/react'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Terminal, 
  RefreshCw, 
  Play, 
  Flame, 
  Dices,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react'

type SupportedLanguage = 'python' | 'javascript' | 'c' | 'cpp' | 'java'

const TOPICS = [
  'All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 
  'Sorting', 'Searching', 'Stack', 'Queue', 'Recursion', 'Sliding Window', 'Greedy', 
  'Binary Search', 'Hashing'
]
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

export default function CodingPage() {
  const [questions, setQuestions] = useState<CodingQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<CodingQuestion | null>(null)
  
  // Filters & State
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [dailyMode, setDailyMode] = useState(false)
  
  const [language, setLanguage] = useState<SupportedLanguage>('python')
  const [codes, setCodes] = useState<Record<SupportedLanguage, string>>({
    python: '',
    javascript: '',
    c: '',
    cpp: '',
    java: '',
  })
  const [running, setRunning] = useState<boolean>(false)
  const [result, setResult] = useState<RunCodeResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadQuestions()
  }, [selectedTopic, selectedDifficulty])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      let url = '/coding/questions'
      const params: string[] = []
      if (selectedTopic !== 'All') params.push(`category=${encodeURIComponent(selectedTopic)}`)
      if (selectedDifficulty !== 'All') params.push(`difficulty=${selectedDifficulty}`)
      
      if (params.length > 0) {
        url += `?${params.join('&')}`
      }
      
      const response = await api.get(url)
      const data = response.data.questions
      
      setQuestions(data)
      if (data.length > 0) {
        selectQuestionItem(data[0])
      } else {
        setSelectedQuestion(null)
      }
    } catch (err) {
      console.error('Failed to load questions', err)
    } finally {
      setLoading(false)
    }
  }

  const selectQuestionItem = (q: any) => {
    setSelectedQuestion(q)
    setCodes({
      python: q.templates?.python || "def solution():\n    pass",
      javascript: q.templates?.javascript || "function solution() {\n}",
      c: q.templates?.c || "",
      cpp: q.templates?.cpp || "",
      java: q.templates?.java || "",
    })
    setLanguage('python')
    setResult(null)
  }

  const handleLoadDaily = async () => {
    setLoading(true)
    setDailyMode(true)
    try {
      const res = await api.get('/coding/daily')
      selectQuestionItem(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadRandom = async () => {
    setLoading(true)
    setDailyMode(false)
    try {
      const res = await api.get('/coding/random')
      selectQuestionItem(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    setAiGenerating(true)
    setResult(null)
    setDailyMode(false)
    try {
      const topic = selectedTopic === 'All' ? 'Arrays' : selectedTopic
      const diff = selectedDifficulty === 'All' ? 'Medium' : selectedDifficulty
      
      const res = await api.post('/coding/ai-generate', {
        category: topic,
        difficulty: diff
      })
      selectQuestionItem(res.data)
      // Re-fetch question list in background
      loadQuestions()
    } catch (err) {
      console.error(err)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleResetCode = () => {
    if (selectedQuestion) {
      setCodes({
        ...codes,
        [language]: selectedQuestion.templates[language] || '',
      })
    }
  }

  const handleRunCode = async () => {
    if (!selectedQuestion) return
    setRunning(true)
    setResult(null)
    try {
      const response = await submitCodingSolution({
        question_id: selectedQuestion.id,
        code: codes[language],
        language: language,
      })
      setResult(response)
    } catch {
      setResult({
        success: false,
        all_passed: false,
        error: 'Failed to communicate with compiling server. Please try again.',
        stdout: '',
      })
    } finally {
      setRunning(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-body pb-12"
    >
      {/* Configuration Header Card */}
      <section className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="glow-background-glow absolute top-[-50px] right-[-50px] w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Terminal className="w-8 h-8 text-cyan-600 dark:text-cyan-400 text-glow-cyan" />
            Coding Practice Arena
          </h1>
          <p className="mt-2 text-sm text-slate-650 dark:text-slate-400 font-medium leading-relaxed">
            Hone your algorithmic execution. Solve daily challenges, run compiled test cases, or generate dynamic challenges tailored by AI.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 relative z-10">
          <button 
            onClick={handleLoadDaily}
            className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-5 py-2.5 text-xs font-bold text-amber-450 hover:bg-amber-500/10 transition hover:scale-102"
          >
            <Flame className="w-3.5 h-3.5 fill-current" /> Daily Challenge
          </button>
          <button 
            onClick={handleLoadRandom}
            className="glass-btn-secondary px-5 py-2.5 text-xs"
          >
            <Dices className="w-4 h-4" /> Random Question
          </button>
          <button 
            onClick={handleAIGenerate}
            disabled={aiGenerating}
            className="glass-btn-primary px-5 py-2.5 text-xs"
          >
            <Sparkles className="w-4 h-4 fill-current" /> <span>{aiGenerating ? 'Generating...' : 'AI Generate'}</span>
          </button>
        </div>
      </section>

      {/* Primary Editor Workspace */}
      <div className="grid gap-6 lg:grid-cols-12 items-start relative z-10">
        {/* Left Column: Question Selection sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Filter className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Filter & Search
            </h2>
            
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">Topic</label>
                <select 
                  value={selectedTopic} 
                  onChange={e => { setSelectedTopic(e.target.value); setDailyMode(false); }}
                  className="w-full glass-select px-3 py-2 text-xs font-semibold"
                >
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic} className="bg-slate-900 text-white">{topic}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-display">Difficulty</label>
                <select 
                  value={selectedDifficulty} 
                  onChange={e => { setSelectedDifficulty(e.target.value); setDailyMode(false); }}
                  className="w-full glass-select px-3 py-2 text-xs font-semibold"
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff} className="bg-slate-900 text-white">{diff}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-white/5" />

            <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="flex items-center gap-2 justify-center py-6 text-slate-400 text-xs">
                  <LoadingSpinner /> Loading list...
                </div>
              ) : questions.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500 font-medium">No questions found matching criteria.</p>
              ) : (
                questions.map((q) => {
                  const isSelected = selectedQuestion?.id === q.id && !dailyMode
                  const diffColor =
                    q.difficulty === 'Easy'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : q.difficulty === 'Hard'
                      ? 'text-rose-450 bg-rose-500/10 border-rose-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  return (
                    <button
                      key={q.id}
                      onClick={() => { selectQuestionItem(q); setDailyMode(false); }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? 'bg-slate-900/10 dark:bg-white/10 border-slate-900/15 dark:border-white/15 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-white/[0.01] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="max-w-[70%]">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate font-display">{q.title}</h3>
                        <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-1 block font-display">{q.category}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border shrink-0 ${diffColor}`}>
                        {q.difficulty}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Detailed Question Description view */}
          {selectedQuestion && (
            <motion.div 
              key={selectedQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">{selectedQuestion.title}</h2>
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mt-0.5 block font-display">{selectedQuestion.category}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    selectedQuestion.difficulty === 'Easy'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : selectedQuestion.difficulty === 'Hard'
                      ? 'text-rose-450 bg-rose-500/10 border-rose-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
              
              <div className="text-slate-700 dark:text-slate-300 text-xs whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[35vh] pr-1.5 font-medium scrollbar-thin">
                {selectedQuestion.description}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Code Editor Console */}
        <div className="space-y-6 lg:col-span-8">
          <div className="glass-panel p-6 flex flex-col h-[550px]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-display">Language:</span>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value as SupportedLanguage)
                    setResult(null)
                  }}
                  className="glass-select px-3.5 py-2 text-xs font-bold font-mono"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (Node)</option>
                  <option value="c">C (GCC)</option>
                  <option value="cpp">C++ (G++)</option>
                  <option value="java">Java (JDK)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleResetCode}
                  className="glass-btn-secondary px-4.5 py-2 text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="glass-btn-primary px-5 py-2 text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> <span>{running ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Monaco code workspace container */}
            <div className="flex-1 rounded-2xl border border-white/5 bg-[#12121e] overflow-hidden relative shadow-inner">
              <Editor
                height="100%"
                language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                theme="vs-dark"
                value={codes[language]}
                onChange={(value) => setCodes({ ...codes, [language]: value || '' })}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  padding: { top: 16 }
                }}
              />
            </div>
          </div>

          {/* Compile stdout / Result details */}
          <AnimatePresence>
            {(result || running) && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-6 space-y-4"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                  <Terminal className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400 text-glow-cyan" />
                  Console Outputs
                </h3>
                
                {running ? (
                  <div className="flex items-center gap-2.5 py-4 text-slate-400 font-medium text-sm">
                    <LoadingSpinner /> Compiling and verifying tests...
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {result.success ? (
                      result.all_passed ? (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400 font-bold flex items-center gap-2 text-sm font-display">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Success: All test cases passed!
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-450 font-bold flex items-center gap-2 text-sm font-display">
                          <XCircle className="w-5 h-5 text-rose-500" /> Failure: Some test cases failed!
                        </div>
                      )
                    ) : (
                      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 font-mono text-xs text-rose-450 overflow-x-auto whitespace-pre">
                        {result.error}
                      </div>
                    )}

                    {result.stdout && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-display">Standard Output</span>
                        <pre className="rounded-2xl bg-slate-950 p-4 text-slate-300 font-mono text-xs overflow-x-auto border border-white/5 leading-relaxed">
                          {result.stdout}
                        </pre>
                      </div>
                    )}

                    {result.success && result.results && (
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-display block">Test Cases Summary</span>
                        <div className="grid gap-3">
                          {result.results.map((tc) => (
                            <div 
                              key={tc.test_case}
                              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                tc.passed 
                                  ? 'bg-emerald-500/5 border-emerald-500/10'
                                  : 'bg-rose-500/5 border-rose-500/10'
                              }`}
                            >
                              <div className="font-mono text-xs text-slate-300 space-y-1">
                                <div><span className="text-slate-500">Inputs:</span> {tc.inputs}</div>
                                {tc.error ? (
                                  <div className="text-rose-450 font-semibold"><span className="text-slate-500">Error:</span> {tc.error}</div>
                                ) : (
                                  <>
                                    <div><span className="text-slate-500">Expected:</span> {tc.expected}</div>
                                    <div>
                                      <span className="text-slate-500">Output:</span>{' '}
                                      <span className={tc.passed ? "text-emerald-400 font-bold" : "text-rose-450 font-bold"}>
                                        {tc.output}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold border self-start sm:self-center ${
                                tc.passed
                                  ? 'text-emerald-450 bg-emerald-500/10 border-emerald-500/25'
                                  : 'text-rose-450 bg-rose-500/10 border-rose-500/25'
                              }`}>
                                {tc.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
