import { useState } from 'react'
import api from '../services/api'

interface ResumeUploaderProps {
  onUpload: (summary: any) => void
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
      <div className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Upload your resume</div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 px-4 py-3 text-slate-800 dark:text-slate-100 outline-none transition focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950"
      />
      {error && <div className="mt-3 text-sm text-rose-500 dark:text-rose-400">{error}</div>}
      <button
        type="button"
        onClick={upload}
        disabled={loading}
        className="mt-5 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Resume'}
      </button>
    </div>
  )
}
