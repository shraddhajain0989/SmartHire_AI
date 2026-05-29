import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import AudioRecorder from '../components/AudioRecorder'
import { ChevronLeft, MessageSquare, Sparkles } from 'lucide-react'

export default function VerbalPracticePage() {
  const [question, setQuestion] = useState('Explain the concept of Dependency Injection.')
  const [answer, setAnswer] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  const handleSubmit = async () => {
    if (!answer.trim() && !audioFile) return
    setLoading(true)
    setFeedback(null)

    const formData = new FormData()
    formData.append('question', question)
    formData.append('answer', answer)
    if (audioFile) {
      formData.append('audio', audioFile)
    }

    try {
      const res = await api.post('/practice/verbal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFeedback(res.data)
    } catch (err) {
      console.error(err)
      setFeedback({ feedback: 'Error processing your response.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section className="flex items-center justify-between">
        <Link to="/practice" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">
          <ChevronLeft className="w-4 h-4" /> Back to Practice
        </Link>
      </section>

      <section className="glass-panel p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Verbal & Theory Practice</h1>
            <p className="text-slate-500 dark:text-slate-400">Answer theory questions and get instant AI feedback on communication and accuracy.</p>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Practice Question</label>
            <textarea
              rows={2}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full glass-input px-5 py-4 transition"
              placeholder="Type a question you want to practice..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Your Answer</label>
            <div className="grid gap-6 md:grid-cols-2">
              <textarea
                rows={8}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                className="w-full glass-input px-5 py-4 transition"
                placeholder="Type your answer here..."
              />
              <div className="flex flex-col justify-center items-center p-6 glass-card border-none bg-slate-950/40">
                <p className="text-slate-400 text-sm mb-6 text-center">Prefer to speak? Record your answer verbally.</p>
                <AudioRecorder onSave={(f) => setAudioFile(f)} />
                {audioFile && <p className="text-emerald-400 text-sm mt-4 font-medium text-glow-cyan shadow-[0_0_15px_rgba(16,185,129,0.1)]">Audio recorded successfully!</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || (!answer.trim() && !audioFile)}
              className="glass-btn-primary px-8 py-3 font-semibold disabled:opacity-50"
            >
              {loading ? 'Evaluating...' : <><Sparkles className="w-4 h-4" /> Evaluate Answer</>}
            </button>
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      )}

      {feedback && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel p-8 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">AI Evaluation</h2>
          <div className="grid gap-6 sm:grid-cols-2 mb-6">
            <div className="glass-card border-none p-5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-400 font-semibold text-glow-cyan">Technical Accuracy</div>
              <div className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{feedback.technical_score ?? 'N/A'}</div>
            </div>
            <div className="glass-card border-none p-5 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
              <div className="text-sm uppercase tracking-[0.2em] text-cyan-400 font-semibold text-glow-cyan">Communication</div>
              <div className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{feedback.communication_score ?? 'N/A'}</div>
            </div>
          </div>
          <div className="glass-card border-none p-6 bg-slate-900/30">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-lg">Detailed Feedback</h4>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{feedback.feedback}</p>
          </div>
        </section>
      )}
    </div>
  )
}
