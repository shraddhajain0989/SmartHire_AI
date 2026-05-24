import { useMemo, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import useAuth from '../hooks/useAuth'
import { fetchQuestion, startInterview, submitAnswer } from '../services/interview'
import AudioRecorder from '../components/AudioRecorder'
import LoadingSpinner from '../components/LoadingSpinner'

const interviewTypes = ['Technical', 'Behavioral', 'HR', 'Company-specific']
const difficulties = ['Beginner', 'Intermediate', 'Advanced']

export default function InterviewPage() {
  const { token } = useAuth()
  const webcamRef = useRef<Webcam>(null)
  const [type, setType] = useState('Technical')
  const [role, setRole] = useState('Software Engineer')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState<string>('Choose your interview settings and start.')
  const [answer, setAnswer] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  const videoStyle = useMemo(() => ({ borderRadius: '1rem' }), [])

  const startSession = async () => {
    setLoading(true)
    setFeedback(null)
    try {
      const session = await startInterview({ type, role, difficulty })
      setSessionId(session.session_id)
      const payload = await fetchQuestion(session.session_id)
      setQuestion(payload.question)
    } catch {
      setQuestion('Failed to generate a question. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!sessionId) return
    const formData = new FormData()
    formData.append('session_id', sessionId)
    formData.append('question', question)
    formData.append('answer', answer)
    if (audioFile) {
      formData.append('audio', audioFile)
    }
    setLoading(true)
    try {
      const result = await submitAnswer(formData)
      setFeedback(result)
    } catch {
      setFeedback({ feedback: 'There was an error processing your response.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl transition-all duration-300">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Mock Interview Studio</h1>
            <p className="text-slate-500 dark:text-slate-400">Generate AI interview questions based on your role and resume, then submit answers with text or voice.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <select className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 px-4 py-3 text-slate-800 dark:text-white outline-none transition focus:border-cyan-400" value={type} onChange={(event) => setType(event.target.value)}>
                {interviewTypes.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
              <input className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 px-4 py-3 text-slate-800 dark:text-white outline-none transition focus:border-cyan-400 placeholder-slate-400" value={role} onChange={(event) => setRole(event.target.value)} placeholder="Target role" />
              <select className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 px-4 py-3 text-slate-800 dark:text-white outline-none transition focus:border-cyan-400" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                {difficulties.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={startSession} className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Start interview
              </button>
              <button disabled={!sessionId} onClick={handleSubmit} className="rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-3 text-sm text-slate-800 dark:text-white transition disabled:opacity-50">
                Submit response
              </button>
            </div>
          </div>
          <div className="space-y-4 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6 transition-all duration-300">
            <h2 className="text-lg font-semibold text-slate-850 dark:text-white">Live webcam preview</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-300 dark:border-slate-700 bg-black">
              <Webcam audio={false} mirrored ref={webcamRef} style={videoStyle} className="h-72 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI interview question</h2>
          <p className="mt-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-6 text-slate-700 dark:text-slate-200 transition-colors duration-300 leading-relaxed">{loading ? <span>Generating question...</span> : question}</p>
          <textarea
            rows={10}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer here..."
            className="mt-5 w-full rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 px-4 py-4 text-slate-800 dark:text-white outline-none transition focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950"
          />
        </div>
        <div className="space-y-6">
          <AudioRecorder onSave={(file) => setAudioFile(file)} />
          {feedback && (
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI feedback</h2>
              <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-4 transition-colors duration-300">
                  <div className="text-sm uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-350">Technical score</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{feedback.technical_score ?? 'N/A'}</div>
                </div>
                <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-4 transition-colors duration-300">
                  <div className="text-sm uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-350">Communication</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{feedback.communication_score ?? 'N/A'}</div>
                </div>
                <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-4 transition-colors duration-300">
                  <div className="font-semibold text-slate-900 dark:text-white">Suggestions</div>
                  <p className="mt-2 text-slate-650 dark:text-slate-300 text-sm leading-relaxed">{feedback.feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {loading && <LoadingSpinner />}
    </div>
  )
}
