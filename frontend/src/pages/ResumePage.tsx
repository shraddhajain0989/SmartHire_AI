import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import ResumeUploader from '../components/ResumeUploader'
import { FileText, Cpu, CheckCircle2, Box } from 'lucide-react'

export default function ResumePage() {
  const { user } = useAuth()
  const [parsed, setParsed] = useState<any>(null)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <section className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-cyan-500" />
          Resume Intelligence Parser
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Upload your PDF and SmartHire AI will extract skills, projects, and role signals to tailor your mock interviews.</p>
      </section>
      
      <ResumeUploader onUpload={(data) => setParsed(data)} />
      
      {parsed && (
        <section className="glass-panel p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-500" />
            AI Extraction Summary
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card border-none bg-slate-900/40 p-6">
              <h3 className="mb-4 text-sm uppercase tracking-widest font-bold text-cyan-400 flex items-center gap-2 text-glow-cyan">
                <CheckCircle2 className="w-4 h-4" /> Detected Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsed.skills.map((skill: string) => (
                  <span key={skill} className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)] px-3 py-1.5 text-xs text-cyan-400 font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="glass-card border-none bg-slate-900/40 p-6">
              <h3 className="mb-4 text-sm uppercase tracking-widest font-bold text-cyan-400 flex items-center gap-2 text-glow-cyan">
                <Box className="w-4 h-4" /> Identified Projects
              </h3>
              <ul className="space-y-3">
                {parsed.projects.map((project: string, index: number) => (
                  <li key={`${project}-${index}`} className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300 font-medium">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="glass-card border-none bg-slate-900/40 p-6">
            <h3 className="mb-4 text-sm uppercase tracking-widest font-bold text-cyan-400 text-glow-cyan">Resume Text Preview</h3>
            <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-400 font-mono pr-2 scrollbar-thin bg-black/40 p-4 rounded-xl border border-white/5">{parsed.summary}</pre>
          </div>
        </section>
      )}
      
      {!parsed && (
        <div className="glass-panel p-8 text-center text-slate-400 font-medium flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <FileText className="w-8 h-8 text-cyan-500" />
          </div>
          {user?.name ? `Hello ${user.name}, upload your resume to capture your career story and optimize your mock interview profile.` : 'Upload your resume to extract skills, projects and practice-focused input.'}
        </div>
      )}
    </div>
  )
}
