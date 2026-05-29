import { Play, Square, Pause } from 'lucide-react'

interface RecordingControlsProps {
  status: 'idle' | 'recording' | 'paused' | 'stopped'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export default function RecordingControls({ status, onStart, onPause, onResume, onStop }: RecordingControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {status === 'idle' || status === 'stopped' ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Play className="h-4 w-4" /> Start Recording
        </button>
      ) : status === 'recording' ? (
        <>
          <button
            onClick={onPause}
            className="flex items-center gap-2 rounded-full bg-amber-500/20 px-6 py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400 transition hover:bg-amber-500/30"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
          <button
            onClick={onStop}
            className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        </>
      ) : status === 'paused' ? (
        <>
          <button
            onClick={onResume}
            className="flex items-center gap-2 rounded-full bg-cyan-500/20 px-6 py-2.5 text-sm font-semibold text-cyan-700 dark:text-cyan-400 transition hover:bg-cyan-500/30"
          >
            <Play className="h-4 w-4" /> Resume
          </button>
          <button
            onClick={onStop}
            className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        </>
      ) : null}
    </div>
  )
}
