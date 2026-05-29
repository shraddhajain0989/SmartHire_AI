import { useState } from 'react'
import api from '../services/api'
import { FileUp, Sparkles, UploadCloud } from 'lucide-react'

interface ResumeUploaderProps {
  onUpload: (summary: any) => void
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const upload = async () => {
    if (!file) {
      setError('Please choose a PDF resume file.')
      return
    }

    const formData = new FormData()
    formData.append('resume', file)
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onUpload(response.data)
    } catch (err) {
      setError('Upload failed. Make sure your PDF is valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-cyan-500" />
          Upload Your Resume
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We support PDF files up to 5MB.</p>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ${
          dragActive 
            ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
            : 'border-white/10 bg-black/20 hover:bg-black/30'
        }`}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="p-4 rounded-full bg-cyan-500/20 text-cyan-400 mb-4 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <FileUp className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold text-slate-300">
          {file ? file.name : 'Drag and drop your PDF here, or click to browse'}
        </p>
      </div>

      {error && <div className="mt-4 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{error}</div>}
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={upload}
          disabled={loading || !file}
          className="flex items-center gap-2 glass-btn-primary px-8 py-3.5 font-bold disabled:opacity-50"
        >
          {loading ? 'Processing Document...' : <><Sparkles className="w-4 h-4" /> Extract Intelligence</>}
        </button>
      </div>
    </div>
  )
}
