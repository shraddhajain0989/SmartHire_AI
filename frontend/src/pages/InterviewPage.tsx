import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Webcam from 'react-webcam'
import InterviewRecorder, { InterviewRecorderRef } from '../components/InterviewRecorder'
import AudioRecorder, { AudioRecorderRef } from '../components/AudioRecorder'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'
import { startInterview, fetchQuestion, submitAnswer } from '../services/interview'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  ArrowRight, 
  SkipForward, 
  Square, 
  Clock, 
  Award, 
  Video, 
  Sparkles, 
  Volume2, 
  MessageSquare,
  History
} from 'lucide-react'

const CATEGORIES = [
  'HR', 'Technical', 'DSA', 'DBMS', 'OOPs', 'Operating Systems', 'CN', 
  'Aptitude', 'Data Analytics', 'Machine Learning', 'React', 'Python', 'Java', 'SQL'
]
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

interface SessionQuestionFeedback {
  question: string
  answer: string
  feedback: string
  technical_score: number
  communication_score: number
  confidence_score: number
}

export default function InterviewPage() {
  const [type, setType] = useState('Technical')
  const [role, setRole] = useState('Software Engineer')
  const [difficulty, setDifficulty] = useState('Medium')
  
  // Interview state
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState('Configure your interview and click start.')
  const [answer, setAnswer] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [maxQuestions, setMaxQuestions] = useState(3)
  
  // Media inputs
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  // Loading & Flow control
  const [loading, setLoading] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewEnded, setInterviewEnded] = useState(false)
  
  // Transcripts list
  const [transcript, setTranscript] = useState<SessionQuestionFeedback[]>([])
  
  // Timers
  const [timer, setTimer] = useState(0)

  // Refs for recorders
  const recorderRef = useRef<InterviewRecorderRef>(null)
  const audioRecorderRef = useRef<AudioRecorderRef>(null)

  // Overall session timer trigger
  useEffect(() => {
    let interval: any
    if (interviewStarted && !interviewEnded) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewStarted, interviewEnded])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = async () => {
    setLoading(true)
    setInterviewEnded(false)
    setTranscript([])
    setTimer(0)
    try {
      const session = await startInterview({ type, role, difficulty })
      setSessionId(session.session_id)
      setMaxQuestions(session.max_questions || 3)
      
      const payload = await fetchQuestion(session.session_id)
      setQuestion(payload.question)
      setCurrentQuestionIndex(payload.index)
      
      setInterviewStarted(true)
    } catch (err) {
      console.error(err)
      setQuestion('Failed to connect to the backend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNextOrSubmit = async (isSkip: boolean = false) => {
    if (!sessionId) return
    setLoading(true)

    // Auto-stop and fetch file pointers from active recorders
    let finalVideoBlob = videoBlob
    if (recorderRef.current && recorderRef.current.isCapturing()) {
      try {
        finalVideoBlob = await recorderRef.current.stopAndGetBlob()
        if (finalVideoBlob) {
          setVideoBlob(finalVideoBlob)
        }
      } catch (err) {
        console.error("Auto-stopping video recorder failed:", err)
      }
    }

    let finalAudioFile = audioFile
    if (audioRecorderRef.current && audioRecorderRef.current.isRecording()) {
      try {
        finalAudioFile = await audioRecorderRef.current.stopAndGetFile()
        if (finalAudioFile) {
          setAudioFile(finalAudioFile)
        }
      } catch (err) {
        console.error("Auto-stopping audio recorder failed:", err)
      }
    }

    const formData = new FormData()
    formData.append('session_id', sessionId)
    formData.append('question', question)
    formData.append('answer', isSkip ? '[Question Skipped]' : answer)
    
    if (finalAudioFile && !isSkip) {
      formData.append('audio', finalAudioFile)
    }
    if (finalVideoBlob && !isSkip) {
      const ext = finalVideoBlob.type.includes('mp4') ? 'mp4' : 'webm'
      formData.append('video', finalVideoBlob, `video.${ext}`)
    }

    try {
      // Submit answer and fetch scoring
      const evaluation = await submitAnswer(formData)
      
      // Save item to page transcript list
      const newItem: SessionQuestionFeedback = {
        question,
        answer: isSkip ? 'Skipped' : (answer || (audioFile ? '[Audio response submitted]' : 'No response')),
        feedback: evaluation.feedback,
        technical_score: evaluation.technical_score,
        communication_score: evaluation.communication_score,
        confidence_score: evaluation.confidence_score || 80
      }
      setTranscript(prev => [...prev, newItem])

      const nextIndex = currentQuestionIndex + 1
      if (nextIndex >= maxQuestions || evaluation.ended) {
        // End session
        setInterviewEnded(true)
        setSessionId(null)
      } else {
        // Fetch next question
        const res = await api.post('/interview/next_question', { session_id: sessionId })
        if (res.data.ended) {
          setInterviewEnded(true)
          setSessionId(null)
        } else {
          setQuestion(res.data.question)
          setCurrentQuestionIndex(res.data.index)
          // Reset buffers for the next question
          setAnswer('')
          setVideoBlob(null)
          setAudioFile(null)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const endSessionEarly = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      await api.post('/interview/end', { session_id: sessionId })
      setInterviewEnded(true)
      setSessionId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Render setup configurations page
  if (!interviewStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8 font-body pb-12"
      >
        <section className="glass-panel p-8 md:p-10 overflow-hidden relative">
          <div className="glow-background-glow absolute top-[-50px] right-[-50px] w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Mock Interview Studio
            </h1>
            <p className="text-slate-650 dark:text-slate-450 font-medium text-sm leading-relaxed">
              Initiate an interactive AI mock interview. Answer technical, architectural, or organizational behavior questions using speech or text to receive deep communication metrics and technical advice.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Category</label>
              <select 
                className="w-full glass-select px-4 py-3.5 text-sm"
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Target Role</label>
              <input 
                className="w-full glass-input px-4 py-3.5 text-sm"
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="Software Engineer" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Difficulty</label>
              <select 
                className="w-full glass-select px-4 py-3.5 text-sm"
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff} className="bg-slate-900 text-white">{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button 
              onClick={startSession} 
              disabled={loading}
              className="glass-btn-primary px-8 py-4 text-sm"
            >
              <Play className="w-4 h-4 fill-current" /> <span>Start Mock Session</span>
            </button>
          </div>
        </section>
      </motion.div>
    )
  }

  if (interviewEnded) {
    const avgTech = transcript.length ? Math.round(transcript.reduce((a, b) => a + b.technical_score, 0) / transcript.length) : 0
    const avgComm = transcript.length ? Math.round(transcript.reduce((a, b) => a + b.communication_score, 0) / transcript.length) : 0
    const avgConf = transcript.length ? Math.round(transcript.reduce((a, b) => a + b.confidence_score, 0) / transcript.length) : 0

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-8 font-body pb-12"
      >
        <section className="glass-panel p-8 text-center overflow-hidden">
          <div className="glow-background-glow absolute top-[-50px] right-[-50px] w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Interview Summary</h1>
          <p className="text-slate-650 dark:text-slate-455 mt-1.5 font-medium text-sm">Excellent work! Review your average mock performance statistics below.</p>
          
          <div className="grid gap-4 sm:grid-cols-3 mt-8 max-w-2xl mx-auto font-display">
            <div className="glass-card p-6 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Avg Technical</div>
              <div className="text-4xl font-extrabold mt-2 text-slate-900 dark:text-white">{avgTech}/100</div>
            </div>
            
            <div className="glass-card p-6 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
              <div className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">Avg Communication</div>
              <div className="text-4xl font-extrabold mt-2 text-slate-900 dark:text-white">{avgComm}/100</div>
            </div>
            
            <div className="glass-card p-6 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
              <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">Avg Confidence</div>
              <div className="text-4xl font-extrabold mt-2 text-slate-900 dark:text-white">{avgConf}/100</div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={() => {
                setInterviewStarted(false)
                setInterviewEnded(false)
              }} 
              className="glass-btn-secondary px-6 py-3.5 text-xs"
            >
              <span>Start New Interview</span>
            </button>
            <Link 
              to="/playback" 
              className="glass-btn-primary px-6 py-3.5 text-xs"
            >
              <History className="w-4 h-4" /> <span>View Recorded Playbacks</span>
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white px-2 font-display">Detailed Transcript & AI Analysis</h2>
          {transcript.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm font-bold text-cyan-400 font-display">Question {idx + 1}</span>
                <div className="flex items-center gap-2 font-display">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-[10px] font-bold rounded-lg text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-white/5">
                    Tech: {item.technical_score}/100
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-[10px] font-bold rounded-lg text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-white/5">
                    Comm: {item.communication_score}/100
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-[10px] font-bold rounded-lg text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-white/5">
                    Conf: {item.confidence_score}/100
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-wider text-slate-550 dark:text-slate-500 font-bold font-display">Question</h4>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{item.question}</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-wider text-slate-550 dark:text-slate-500 font-bold font-display">Your Answer</h4>
                <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">{item.answer}</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <h4 className="text-[10px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400 font-bold mb-1.5 flex items-center gap-1.5 font-display">
                  <MessageSquare className="w-3.5 h-3.5" /> AI Feedback Remarks
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{item.feedback}</p>
              </div>
            </motion.div>
          ))}
        </section>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body pb-12">
      <section className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3.5 py-1.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-white/10 font-display">
            Q {currentQuestionIndex + 1} of {maxQuestions}
          </span>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white font-display text-base">Active Interview Session</h1>
            <p className="text-[10px] font-semibold text-slate-550 dark:text-slate-455 uppercase tracking-wide mt-0.5">{type} • {difficulty} • {role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-2 rounded-xl text-slate-750 dark:text-slate-300 font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{formatTime(timer)}</span>
          </div>
          <button 
            onClick={endSessionEarly} 
            className="glass-btn-danger px-4 py-2.5 text-xs"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> <span>End Session</span>
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-12 items-start relative z-10">
        <div className="md:col-span-4 space-y-6">
          <InterviewRecorder ref={recorderRef} onRecordingComplete={(blob) => setVideoBlob(blob)} />
          <AudioRecorder ref={audioRecorderRef} onSave={(file) => setAudioFile(file)} />
        </div>

        <div className="md:col-span-8 space-y-6">
          <motion.div 
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold font-display">AI Interview Question</h2>
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed font-display">
                {loading ? 'Analyzing and generating next...' : question}
              </p>
            </div>

            <div className="border-t border-white/5 pt-5 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Your Answer</label>
              <textarea
                rows={7}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your response here or use voice/video recorders to transcribe your answer..."
                className="w-full glass-input px-4.5 py-3.5 text-sm leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {videoBlob && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/10">
                  <Video className="w-3.5 h-3.5" /> Video Response Saved
                </span>
              )}
              {audioFile && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/10">
                  <Volume2 className="w-3.5 h-3.5" /> Audio Response Saved
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-between border-t border-white/5 pt-5">
              <button
                disabled={loading}
                onClick={() => handleNextOrSubmit(true)}
                className="glass-btn-secondary px-6 py-3.5 text-xs"
              >
                <SkipForward className="w-4 h-4" /> <span>Skip Question</span>
              </button>

              <button
                disabled={loading}
                onClick={() => handleNextOrSubmit(false)}
                className="glass-btn-primary px-6 py-3.5 text-xs"
              >
                {currentQuestionIndex + 1 === maxQuestions ? (
                  <><span>Finish & View Score</span> <Award className="w-4 h-4" /></>
                ) : (
                  <><span>Next Question</span> <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {loading && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="glass-panel p-8 flex flex-col items-center gap-4 text-center max-w-sm">
            <LoadingSpinner />
            <p className="font-semibold text-sm text-white font-display">Evaluating your answer using AI...</p>
          </div>
        </div>
      )}
    </div>
  )
}
