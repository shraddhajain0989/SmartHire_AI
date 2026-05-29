import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react'
import Webcam from 'react-webcam'
import RecordingControls from './RecordingControls'
import { Video, CameraOff } from 'lucide-react'

interface InterviewRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export interface InterviewRecorderRef {
  stopAndGetBlob: () => Promise<Blob | null>
  isCapturing: () => boolean
}

const InterviewRecorder = forwardRef<InterviewRecorderRef, InterviewRecorderProps>(
  ({ onRecordingComplete }, ref) => {
    const webcamRef = useRef<Webcam>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const resolveBlobRef = useRef<((value: Blob | null) => void) | null>(null)
    
    const [capturing, setCapturing] = useState(false)
    const [paused, setPaused] = useState(false)
    const [timer, setTimer] = useState(0)
    const [isCameraReady, setIsCameraReady] = useState(false)

    useImperativeHandle(ref, () => ({
      isCapturing: () => capturing,
      stopAndGetBlob: () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
          return Promise.resolve(null)
        }
        return new Promise<Blob | null>((resolve) => {
          resolveBlobRef.current = resolve
          try {
            mediaRecorderRef.current?.stop()
          } catch (err) {
            console.error("Error stopping media recorder via ref:", err)
            resolve(null)
          }
          setCapturing(false)
          setPaused(false)
        })
      }
    }))

    const handleStartCaptureClick = useCallback(() => {
      if (!isCameraReady || !webcamRef.current || !webcamRef.current.stream) {
        console.warn("Camera is not ready or stream is unavailable.")
        return
      }

      setCapturing(true)
      setPaused(false)
      setTimer(0)
      chunksRef.current = [] // reset chunks
      
      let options = {}
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          options = { mimeType: 'video/webm;codecs=vp9' }
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          options = { mimeType: 'video/webm' }
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          options = { mimeType: 'video/mp4' }
        }
      }
      
      try {
        let recorder: MediaRecorder
        try {
          recorder = new MediaRecorder(webcamRef.current.stream, options)
        } catch (e) {
          console.warn("Failed to instantiate MediaRecorder with options. Falling back to default format...", e)
          recorder = new MediaRecorder(webcamRef.current.stream)
        }
        
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data)
          }
        }
        
        recorder.onstop = () => {
          const mime = recorder.mimeType || 'video/webm'
          const blob = new Blob(chunksRef.current, { type: mime })
          onRecordingComplete(blob)
          if (resolveBlobRef.current) {
            resolveBlobRef.current(blob)
            resolveBlobRef.current = null
          }
        }
        
        mediaRecorderRef.current = recorder
        recorder.start(1000)
      } catch (err) {
        console.error("Failed to start MediaRecorder:", err)
        setCapturing(false)
      }
    }, [webcamRef, onRecordingComplete, isCameraReady])

    const handlePauseCaptureClick = useCallback(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause()
        setPaused(true)
      }
    }, [])

    const handleResumeCaptureClick = useCallback(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume()
        setPaused(false)
      }
    }, [])

    const handleStopCaptureClick = useCallback(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        setCapturing(false)
        setPaused(false)
      }
    }, [])

    useEffect(() => {
      let interval: any
      if (capturing && !paused) {
        interval = setInterval(() => {
          setTimer((prev) => prev + 1)
        }, 1000)
      }
      return () => clearInterval(interval)
    }, [capturing, paused])

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const status = capturing ? (paused ? 'paused' : 'recording') : 'idle'

    return (
      <div className="space-y-4 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 p-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-850 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-500" />
            Live Interview Recorder
          </h2>
          {capturing ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-900 dark:text-white font-semibold">
                {formatTime(timer)}
              </span>
              <div className={`h-3 w-3 rounded-full ${paused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
            </div>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-400">
              {isCameraReady ? 'Camera Ready' : 'Initializing Camera...'}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-300 dark:border-slate-700 bg-black relative">
          <Webcam 
            audio={true} 
            mirrored 
            ref={webcamRef} 
            muted={true}
            onUserMedia={() => setIsCameraReady(true)}
            onUserMediaError={(err) => {
              console.error("Webcam media access error:", err)
              setIsCameraReady(false)
            }}
            className="h-72 w-full object-cover" 
          />
          {!isCameraReady && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-slate-400 gap-2">
              <CameraOff className="w-8 h-8 animate-pulse text-slate-550" />
              <span className="text-sm font-semibold">Loading camera input...</span>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <RecordingControls 
            status={status}
            onStart={handleStartCaptureClick}
            onPause={handlePauseCaptureClick}
            onResume={handleResumeCaptureClick}
            onStop={handleStopCaptureClick}
          />
        </div>
      </div>
    )
  }
)

InterviewRecorder.displayName = 'InterviewRecorder'

export default InterviewRecorder

