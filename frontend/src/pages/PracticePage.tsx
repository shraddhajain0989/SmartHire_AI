import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  BookOpen, 
  MessageSquare, 
  Brain, 
  Edit3, 
  Trash2, 
  Play, 
  History, 
  X, 
  Plus,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react'

interface Attempt {
  code?: string
  selected_option?: number
  answer?: string
  passed: boolean
  score: number
  stdout?: string
  completed_at: string
}

interface CustomQuestion {
  _id: string
  title: string
  description: string
  type: string
  difficulty: string
  category: string
  options?: string[]
  correctIndex?: number
  explanation?: string
  attempts?: Attempt[]
  best_score?: number
  created_at: string
}

export default function PracticePage() {
  const [questions, setQuestions] = useState<CustomQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Edit state
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('coding')
  const [difficulty, setDifficulty] = useState('Medium')
  const [category, setCategory] = useState('General')
  
  // MCQ specific fields
  const [mcqOptions, setMcqOptions] = useState('Option A, Option B, Option C, Option D')
  const [correctIndex, setCorrectIndex] = useState(0)
  const [explanation, setExplanation] = useState('')

  // Modals state
  const [solvingQuestion, setSolvingQuestion] = useState<CustomQuestion | null>(null)
  const [historyQuestion, setHistoryQuestion] = useState<CustomQuestion | null>(null)
  const [solveCode, setSolveCode] = useState('')
  const [solveOption, setSolveOption] = useState<number | null>(null)
  const [solveText, setSolveText] = useState('')
  const [solving, setSolving] = useState(false)
  const [solveResult, setSolveResult] = useState<any>(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = () => {
    setLoading(true)
    api.get('/practice/custom')
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    const payload: any = {
      title,
      description,
      type,
      difficulty,
      category
    }

    if (type === 'mcq') {
      payload.options = mcqOptions.split(',').map(o => o.trim()).filter(Boolean)
      payload.correctIndex = Number(correctIndex)
      payload.explanation = explanation
    }

    try {
      if (editMode && editId) {
        await api.put(`/practice/custom/${editId}`, payload)
        setEditMode(false)
        setEditId(null)
      } else {
        await api.post('/practice/custom', payload)
      }
      
      setTitle('')
      setDescription('')
      setExplanation('')
      setMcqOptions('Option A, Option B, Option C, Option D')
      fetchQuestions()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (q: CustomQuestion) => {
    setEditMode(true)
    setEditId(q._id)
    setTitle(q.title)
    setDescription(q.description)
    setType(q.type)
    setDifficulty(q.difficulty)
    setCategory(q.category)
    if (q.type === 'mcq') {
      setMcqOptions(q.options?.join(', ') || '')
      setCorrectIndex(q.correctIndex || 0)
      setExplanation(q.explanation || '')
    }
    // Scroll to form
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this custom question?")) return
    try {
      await api.delete(`/practice/custom/${id}`)
      fetchQuestions()
    } catch (err) {
      console.error(err)
    }
  }

  const openSolveModal = (q: CustomQuestion) => {
    setSolvingQuestion(q)
    setSolveResult(null)
    setSolveOption(null)
    setSolveText('')
    
    if (q.type === 'coding') {
      setSolveCode(
        q.difficulty === 'Easy' 
          ? "def solution():\n    # Write Python solution here\n    print('Hello World')\n    return True\n" 
          : "def solution():\n    # Write Python solution here\n    pass\n"
      )
    }
  }

  const handleSolveSubmit = async () => {
    if (!solvingQuestion) return
    setSolving(true)
    setSolveResult(null)
    try {
      let res
      if (solvingQuestion.type === 'coding') {
        res = await api.post('/coding/run', {
          question_id: solvingQuestion._id,
          code: solveCode,
          language: 'python'
        })
      } else {
        res = await api.post(`/practice/custom/${solvingQuestion._id}/attempt`, {
          selected_option: solveOption,
          answer: solveText
        })
      }
      setSolveResult(res.data)
      // Refetch custom question list in background to update attempts
      fetchQuestions()
    } catch (err) {
      console.error(err)
    } finally {
      setSolving(false)
    }
  }

  const practiceAreas = [
    { name: 'Coding Arena', desc: 'Solve algorithmic challenges', icon: Code, link: '/coding', color: 'text-emerald-500', bg: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-500/20' },
    { name: 'MCQ Tests', desc: 'Test your knowledge', icon: BookOpen, link: '/mcq', color: 'text-amber-500', bg: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/20' },
    { name: 'Verbal Practice', desc: 'Speak your answers', icon: MessageSquare, link: '/verbal', color: 'text-rose-500', bg: 'shadow-[0_0_15px_rgba(244,63,94,0.15)] border-rose-500/20' },
    { name: 'Mock Interviews', desc: 'Full simulated interviews', icon: Brain, link: '/interview', color: 'text-cyan-500', bg: 'shadow-[0_0_15px_rgba(6,182,212,0.15)] border-cyan-500/20' }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Practice Center</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Hone your skills with standard coding arenas, timed MCQs, or build custom question sets.</p>
        
        <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {practiceAreas.map((area) => (
            <Link key={area.name} to={area.link} className={`glass-card p-6 flex flex-col items-start ${area.bg}`}>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-4 border border-white/5">
                <area.icon className={`w-6 h-6 ${area.color}`} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{area.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{area.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create / Edit Custom Question Form */}
        <section className="glass-panel p-8 h-fit">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-500" />
            {editMode ? 'Edit Custom Question' : 'Create Custom Question'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Question Title</label>
              <input 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., Reverse an array in Python"
                className="w-full glass-input px-4 py-3 text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Problem Statement / Description</label>
              <textarea 
                required 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Explain the question requirements or test benchmarks..."
                className="w-full glass-input px-4 py-3 text-sm leading-relaxed" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
                <select 
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  className="w-full glass-select px-4 py-3 text-sm font-medium"
                >
                  <option value="coding" className="bg-slate-900 text-slate-200">Coding</option>
                  <option value="mcq" className="bg-slate-900 text-slate-200">MCQ</option>
                  <option value="verbal" className="bg-slate-900 text-slate-200">Verbal Practice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={e => setDifficulty(e.target.value)} 
                  className="w-full glass-select px-4 py-3 text-sm font-medium"
                >
                  <option value="Easy" className="bg-slate-900 text-slate-200">Easy</option>
                  <option value="Medium" className="bg-slate-900 text-slate-200">Medium</option>
                  <option value="Hard" className="bg-slate-900 text-slate-200">Hard</option>
                </select>
              </div>
            </div>

            {/* Custom MCQ inputs */}
            <AnimatePresence>
              {type === 'mcq' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Choices Options (comma separated)</label>
                    <input 
                      required 
                      value={mcqOptions} 
                      onChange={e => setMcqOptions(e.target.value)} 
                      placeholder="Option 1, Option 2, Option 3, Option 4" 
                      className="w-full glass-input px-4 py-3 text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Correct Option Index</label>
                      <select 
                        value={correctIndex} 
                        onChange={e => setCorrectIndex(Number(e.target.value))} 
                        className="w-full glass-select px-4 py-3 text-sm"
                      >
                        <option value={0} className="bg-slate-900 text-slate-200">Option 1 (Index 0)</option>
                        <option value={1} className="bg-slate-900 text-slate-200">Option 2 (Index 1)</option>
                        <option value={2} className="bg-slate-900 text-slate-200">Option 3 (Index 2)</option>
                        <option value={3} className="bg-slate-900 text-slate-200">Option 4 (Index 3)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject Category</label>
                      <input 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        placeholder="DBMS, OS, OOPs..." 
                        className="w-full glass-input px-4 py-3 text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">AI Explanation Remark</label>
                    <input 
                      value={explanation} 
                      onChange={e => setExplanation(e.target.value)} 
                      placeholder="Why is this option correct?" 
                      className="w-full glass-input px-4 py-3 text-sm" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {type !== 'mcq' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <input 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  placeholder="e.g. System Design, Recursion" 
                  className="w-full glass-input px-4 py-3 text-sm" 
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {editMode && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditMode(false)
                    setEditId(null)
                    setTitle('')
                    setDescription('')
                  }}
                  className="flex-1 glass-btn-secondary px-6 py-3.5 text-sm font-bold"
                >
                  Cancel
                </button>
              )}
              <button 
                disabled={submitting} 
                type="submit" 
                className="flex-1 glass-btn-primary px-6 py-3.5 text-sm font-bold disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editMode ? 'Update Question' : 'Save Question'}
              </button>
            </div>
          </form>
        </section>

        {/* My Custom Questions list */}
        <section className="glass-panel p-8 flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            My Created Questions
          </h2>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12"><LoadingSpinner /></div>
          ) : questions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 text-sm font-medium">
              No custom questions created yet. Use the editor to draft one!
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-1 max-h-[600px] scrollbar-thin">
              {questions.map(q => (
                <div key={q._id} className="glass-card p-5 space-y-3.5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{q.title}</h3>
                      <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest text-glow-cyan">{q.category}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className="px-2 py-0.5 text-[9px] rounded bg-cyan-500/10 text-cyan-400 font-bold capitalize tracking-wider">{q.type}</span>
                      <span className={`px-2 py-0.5 text-[9px] rounded font-bold tracking-wider ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{q.difficulty}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">{q.description}</p>
                  
                  {/* Action buttons */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[10px] font-bold text-slate-400">Best Score: {q.best_score ?? 0}%</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setHistoryQuestion(q)}
                        className="p-2 bg-slate-900 text-slate-400 rounded-xl hover:text-cyan-400 hover:bg-slate-800 transition" 
                        title="View Attempts"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(q)}
                        className="p-2 bg-slate-900 text-slate-400 rounded-xl hover:text-cyan-400 hover:bg-slate-800 transition" 
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(q._id)}
                        className="p-2 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500/20 transition" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openSolveModal(q)}
                        className="glass-btn-primary px-4 py-1.5 text-xs font-bold"
                      >
                        <Play className="w-3 h-3 fill-current" /> Solve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODAL 1: SOLVING DRAWER */}
      <AnimatePresence>
        {solvingQuestion && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{solvingQuestion.title}</h3>
                  <p className="text-[10px] text-cyan-400 text-glow-cyan font-bold uppercase tracking-widest mt-0.5">{solvingQuestion.category} • {solvingQuestion.difficulty}</p>
                </div>
                <button 
                  onClick={() => { setSolvingQuestion(null); setSolveResult(null); }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1.5">Problem Statement</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed glass-card border-none p-4 rounded-xl">
                    {solvingQuestion.description}
                  </p>
                </div>

                {/* Solving Workspace based on Type */}
                <div className="space-y-4">
                  {solvingQuestion.type === 'coding' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Python Solution Code</label>
                      <div className="h-64 border border-white/10 rounded-2xl overflow-hidden bg-[#1e1e1e]">
                        <Editor
                          height="100%"
                          language="python"
                          theme="vs-dark"
                          value={solveCode}
                          onChange={value => setSolveCode(value || '')}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            wordWrap: 'on',
                            scrollBeyondLastLine: false
                          }}
                        />
                      </div>
                    </div>
                  ) : solvingQuestion.type === 'mcq' && solvingQuestion.options ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Answer Choice</label>
                      <div className="grid gap-2">
                        {solvingQuestion.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSolveOption(idx)}
                            className={`glass-card p-4 transition text-left text-sm font-semibold ${
                              solveOption === idx 
                                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                                : 'text-slate-300 hover:border-white/20'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Answer Response</label>
                      <textarea
                        rows={6}
                        value={solveText}
                        onChange={e => setSolveText(e.target.value)}
                        placeholder="Type your answer response here..."
                        className="w-full glass-input px-4 py-3 text-sm leading-relaxed"
                      />
                    </div>
                  )}
                </div>

                {/* Solving result outputs */}
                <AnimatePresence>
                  {solveResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-4 border-t border-white/10"
                    >
                      <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Execution Result</h4>
                      
                      {solvingQuestion.type === 'coding' ? (
                        <div className="space-y-3">
                          {solveResult.success ? (
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)] rounded-xl text-sm font-bold flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" /> Compilation finished successfully!
                            </div>
                          ) : (
                            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)] rounded-xl text-xs font-mono whitespace-pre overflow-x-auto">
                              {solveResult.error}
                            </div>
                          )}
                          {solveResult.stdout && (
                            <pre className="p-4 bg-[#0a081c] border border-white/5 rounded-xl font-mono text-xs text-slate-300 max-h-40 overflow-y-auto">
                              {solveResult.stdout}
                            </pre>
                          )}
                        </div>
                      ) : solvingQuestion.type === 'mcq' ? (
                        <div className="space-y-3">
                          {solveResult.passed ? (
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)] rounded-xl text-sm font-bold flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" /> Correct! Score: 100/100
                            </div>
                          ) : (
                            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)] rounded-xl text-sm font-bold flex items-center gap-2">
                              <XCircle className="w-5 h-5" /> Incorrect answer choice.
                            </div>
                          )}
                          {solveResult.explanation && (
                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)] rounded-xl text-sm text-slate-300">
                              <span className="font-bold text-xs uppercase tracking-widest text-cyan-400 block mb-1 text-glow-cyan">Explanation</span>
                              {solveResult.explanation}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Verbal / Theory response
                        <div className="space-y-3">
                          <div className="grid gap-3 grid-cols-2">
                            <div className="p-3.5 glass-card border-none rounded-xl text-center">
                              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Technical Score</div>
                              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{solveResult.technical_score ?? solveResult.score}/100</div>
                            </div>
                            <div className="p-3.5 glass-card border-none rounded-xl text-center">
                              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Communication Score</div>
                              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{solveResult.communication_score ?? 80}/100</div>
                            </div>
                          </div>
                          {solveResult.feedback && (
                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)] rounded-xl text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                              <span className="font-bold text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-1 text-glow-cyan">AI Suggestions</span>
                              {solveResult.feedback}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer buttons */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => { setSolvingQuestion(null); setSolveResult(null); }}
                  className="glass-btn-secondary px-6 py-2.5 text-xs font-bold"
                >
                  Close
                </button>
                <button 
                  onClick={handleSolveSubmit}
                  disabled={solving || (solvingQuestion.type === 'mcq' && solveOption === null)}
                  className="glass-btn-primary px-6 py-2.5 text-xs font-extrabold disabled:opacity-50"
                >
                  {solving ? 'Submitting...' : <><Play className="w-3 h-3 fill-current" /> Run & Submit</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ATTEMPTS LIST DRAWER */}
      <AnimatePresence>
        {historyQuestion && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attempt History</h3>
                  <p className="text-[10px] text-cyan-400 text-glow-cyan font-bold uppercase tracking-widest mt-0.5">{historyQuestion.title}</p>
                </div>
                <button 
                  onClick={() => setHistoryQuestion(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {!historyQuestion.attempts || historyQuestion.attempts.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 text-sm font-semibold">No reattempts logged for this question yet.</p>
                ) : (
                  historyQuestion.attempts.map((att, idx) => (
                    <div 
                      key={idx}
                      className={`glass-card p-4 border-none ${
                        att.passed 
                          ? 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(att.completed_at).toLocaleDateString()} at {new Date(att.completed_at).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          att.passed 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          Score: {att.score ?? (att.passed ? 100 : 0)}%
                        </span>
                      </div>

                      {att.code && (
                        <pre className="p-3 bg-[#0a081c] rounded-xl font-mono text-[10px] text-slate-350 max-h-24 overflow-y-auto border border-white/5">
                          {att.code}
                        </pre>
                      )}
                      
                      {att.answer && (
                        <p className="text-xs text-slate-300 font-medium italic mt-1 truncate">"{att.answer}"</p>
                      )}

                      {att.selected_option !== undefined && historyQuestion.options && (
                        <p className="text-xs text-slate-300 font-semibold mt-1">
                          Chosen: <span className="text-slate-100 font-bold">{historyQuestion.options[att.selected_option] || 'Unknown'}</span>
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end shrink-0">
                <button 
                  onClick={() => setHistoryQuestion(null)}
                  className="glass-btn-secondary px-6 py-2.5 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
