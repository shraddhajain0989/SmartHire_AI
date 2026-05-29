import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Video, 
  ChevronLeft, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Flame,
  Award,
  Sparkles,
  Layers
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionDetail {
  question: string
  answer: string
  expected: string
  feedback: string
  technical_score: number
  communication_score: number
  confidence_score: number
  video_url?: string
  created_at?: string
}

interface InterviewHistory {
  _id: string
  type: string
  role: string
  difficulty: string
  questions_details: QuestionDetail[]
  completed_at: string
  technical_score?: number
  communication_score?: number
}

export default function InterviewPlaybackPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [history, setHistory] = useState<InterviewHistory[]>([])
  const [selectedSession, setSelectedSession] = useState<InterviewHistory | null>(null)
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  // Custom Video Player State
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  useEffect(() => {
    api.get('/interview/history')
      .then((res) => {
        setHistory(res.data)
        if (res.data.length > 0) {
          setSelectedSession(res.data[0])
          setSelectedQuestionIdx(0)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Reset video settings when active question or video changes
  useEffect(() => {
    setIsPlaying(false)
    setPlaybackSpeed(1)
    if (videoRef.current) {
      videoRef.current.playbackRate = 1
      videoRef.current.load()
    }
  }, [selectedSession, selectedQuestionIdx])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error("Error playing video:", e))
      }
    }
  }

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Error playing video:", e))
    }
  }

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setPlaybackSpeed(speed)
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="space-y-6 text-center py-12 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">
          <Video className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Interview History</h1>
        <p className="text-slate-500 dark:text-slate-400">You haven't completed any mock interviews yet.</p>
        <Link to="/interview" className="inline-block mt-4 glass-btn-primary px-6 py-3 text-sm font-semibold">
          Start your first interview
        </Link>
      </div>
    )
  }

  const activeQuestion = selectedSession?.questions_details?.[selectedQuestionIdx]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="glass-panel p-8 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Video className="h-8 w-8 text-cyan-500" />
            Interview History & Playback
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Review your past multi-question sessions, watch video records, and examine AI metrics.</p>
        </div>
        <Link to="/interview" className="flex items-center gap-2 glass-btn-secondary px-5 py-2.5 text-sm">
          <ChevronLeft className="h-4 w-4" /> Back to Studio
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Sidebar Sessions List */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white px-2">Past Sessions</h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
            {history.map((session) => (
              <button
                key={session._id}
                onClick={() => {
                  setSelectedSession(session)
                  setSelectedQuestionIdx(0)
                }}
                className={`w-full text-left p-5 transition-all duration-300 ${
                  selectedSession?._id === session._id
                    ? 'glass-card border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-cyan-500/10'
                    : 'glass-card text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-sm tracking-tight ${selectedSession?._id === session._id ? 'text-cyan-400 text-glow-cyan' : 'text-slate-200'}`}>
                    {session.type}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)] border border-cyan-500/30">
                    {session.technical_score ?? 0}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mb-3">{session.role} • {session.difficulty}</p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(session.completed_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {selectedSession && activeQuestion && (
            <>
              {/* Question Timeline Picker */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                {selectedSession.questions_details.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedQuestionIdx(idx)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                      selectedQuestionIdx === idx
                        ? 'glass-btn-primary'
                        : 'glass-card text-slate-400 hover:text-white'
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>

              {/* Video Player */}
              <div className="glass-panel p-6 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black aspect-video relative group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  {activeQuestion.video_url ? (
                    <>
                      <video 
                        ref={videoRef}
                        src={activeQuestion.video_url} 
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      
                      {/* Custom Overlay Control Bar on hover */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <button onClick={togglePlay} className="p-2 bg-cyan-500 text-slate-950 rounded-full hover:scale-105 active:scale-95 transition shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>
                          <button onClick={handleReplay} className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 hover:scale-105 active:scale-95 transition border border-white/10" title="Replay">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Playback speed selector */}
                          <div className="flex bg-black/40 backdrop-blur-md rounded-lg p-0.5 text-xs text-slate-300 font-bold border border-white/10">
                            {[0.5, 1, 1.5, 2].map((sp) => (
                              <button
                                key={sp}
                                onClick={() => handleSpeedChange(sp)}
                                className={`px-2 py-1 rounded-md transition ${playbackSpeed === sp ? 'bg-cyan-500/20 text-cyan-400' : 'hover:text-white'}`}
                              >
                                {sp}x
                              </button>
                            ))}
                          </div>
                          <button onClick={handleFullscreen} className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 hover:scale-105 transition border border-white/10" title="Fullscreen">
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/40 backdrop-blur-md">
                      <Video className="w-12 h-12 mb-3 opacity-40" />
                      <p className="text-sm font-semibold">No video recorded for this response</p>
                    </div>
                  )}
                </div>
              </div>

              {/* QA Details Section */}
              <section className="glass-panel p-8 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2 text-glow-cyan">Question Details</h3>
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">{activeQuestion.question}</p>
                </div>
                <hr className="border-white/10" />
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2 text-glow-cyan">Your Submitted Answer</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{activeQuestion.answer}</p>
                </div>
              </section>

              {/* Scoring & Suggestions Feedback */}
              <section className="glass-panel p-8 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-500" />
                  AI Analysis & Scores
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="glass-card border-none p-5 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold text-glow-cyan">Technical Score</div>
                    <div className="text-2xl font-black mt-1.5 text-slate-900 dark:text-white">{activeQuestion.technical_score}/100</div>
                  </div>
                  <div className="glass-card border-none p-5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold text-glow-cyan">Communication</div>
                    <div className="text-2xl font-black mt-1.5 text-slate-900 dark:text-white">{activeQuestion.communication_score}/100</div>
                  </div>
                  <div className="glass-card border-none p-5 shadow-[0_0_15px_rgba(167,139,250,0.05)]">
                    <div className="text-xs uppercase tracking-wider text-purple-400 font-bold text-glow-cyan">Confidence Score</div>
                    <div className="text-2xl font-black mt-1.5 text-slate-900 dark:text-white">{activeQuestion.confidence_score || 80}/100</div>
                  </div>
                </div>

                <div className="glass-card border-none p-6 bg-slate-900/30">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Evaluation Remarks
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeQuestion.feedback}
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
