import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'

interface AudioRecorderProps {
  onSave: (file: File) => void
}

export interface AudioRecorderRef {
  stopAndGetFile: () => Promise<File | null>
  isRecording: () => boolean
}

const AudioRecorder = forwardRef<AudioRecorderRef, AudioRecorderProps>(
  ({ onSave }, ref) => {
    const [recording, setRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const chunksRef = useRef<BlobPart[]>([])
    const resolveFileRef = useRef<((value: File | null) => void) | null>(null)

    useImperativeHandle(ref, () => ({
      isRecording: () => recording,
      stopAndGetFile: () => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
          return Promise.resolve(null)
        }
        return new Promise<File | null>((resolve) => {
          resolveFileRef.current = resolve
          try {
            mediaRecorder.stop()
          } catch (err) {
            console.error("Error stopping audio recorder via ref:", err)
            resolve(null)
          }
          setRecording(false)
        })
      }
    }))

    useEffect(() => {
      let currentStream: MediaStream | null = null

      async function setup() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          currentStream = stream
          const recorder = new MediaRecorder(stream)

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              chunksRef.current.push(event.data)
            }
          }

          recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
            const file = new File([blob], `response-${Date.now()}.webm`, { type: 'audio/webm' })
            setAudioUrl(URL.createObjectURL(blob))
            onSave(file)
            if (resolveFileRef.current) {
              resolveFileRef.current(file)
              resolveFileRef.current = null
            }
          }

          setMediaRecorder(recorder)
        } catch (err) {
          console.error("Failed to initialize audio recorder:", err)
          setMediaRecorder(null)
        }
      }

      setup()
      return () => {
        currentStream?.getTracks().forEach((track) => track.stop())
      }
    }, [onSave])

    const start = () => {
      if (mediaRecorder) {
        chunksRef.current = [] // Reset chunks
        setRecording(true)
        mediaRecorder.start()
      }
    }

    const stop = () => {
      if (mediaRecorder && recording) {
        setRecording(false)
        mediaRecorder.stop()
      }
    }

    return (
      <div className="space-y-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-glass backdrop-blur-xl transition-colors duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Voice response</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Record audio and send it to SmartHire AI for evaluation.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={start} disabled={recording} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50">
              Record
            </button>
            <button onClick={stop} disabled={!recording} className="rounded-full bg-slate-250 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition disabled:opacity-50">
              Stop
            </button>
          </div>
        </div>
        {audioUrl && (
          <audio controls className="w-full rounded-2xl bg-slate-100 dark:bg-slate-900/80 p-3 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <source src={audioUrl} />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    )
  }
)

AudioRecorder.displayName = 'AudioRecorder'

export default AudioRecorder

