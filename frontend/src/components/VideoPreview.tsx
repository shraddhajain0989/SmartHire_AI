import { useEffect, useRef } from 'react'

interface VideoPreviewProps {
  stream: MediaStream | null
  videoBlobUrl: string | null
}

export default function VideoPreview({ stream, videoBlobUrl }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream && !videoBlobUrl) {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoBlobUrl])

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-300 dark:border-slate-700 bg-black relative flex items-center justify-center h-72">
      {videoBlobUrl ? (
        <video src={videoBlobUrl} controls className="h-full w-full object-cover" />
      ) : stream ? (
        <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover scale-x-[-1]" />
      ) : (
        <div className="text-slate-500 dark:text-slate-400 font-medium">Camera not active</div>
      )}
    </div>
  )
}
