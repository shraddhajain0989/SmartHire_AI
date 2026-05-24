import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import ResumeUploader from '../components/ResumeUploader'

export default function ResumePage() {
  const { user } = useAuth()
  const [parsed, setParsed] = useState<any>(null)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl transition-all duration-300">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Resume parser</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Upload your PDF and SmartHire AI will extract skills, projects, and role signals.</p>
      </section>
      
      <ResumeUploader onUpload={(data) => setParsed(data)} />
      
      {parsed && (
        <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Resume summary</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-6 text-slate-700 dark:text-slate-200 transition-colors duration-300">
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Extracted skills</h3>
              <div className="flex flex-wrap gap-2">
                {parsed.skills.map((skill: string) => (
                  <span key={skill} className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-sm text-cyan-700 dark:text-cyan-200 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-6 text-slate-700 dark:text-slate-200 transition-colors duration-300">
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Detected projects</h3>
              <ul className="space-y-3">
                {parsed.projects.map((project: string, index: number) => (
                  <li key={`${project}-${index}`} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 transition-colors duration-300 shadow-sm">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 p-6 text-slate-700 dark:text-slate-200 transition-colors duration-300">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Resume preview</h3>
            <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-650 dark:text-slate-300 font-mono pr-2">{parsed.summary}</pre>
          </div>
        </section>
      )}
      {!parsed && (
        <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 text-slate-500 dark:text-slate-400 shadow-glass backdrop-blur-xl transition-all duration-300">
          {user?.name ? `Hello ${user.name}, upload your resume to capture your career story and optimize your mock interview profile.` : 'Upload your resume to extract skills, projects and practice-focused input.'}
        </div>
      )}
    </div>
  )
}
