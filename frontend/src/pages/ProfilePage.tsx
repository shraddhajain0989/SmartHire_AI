import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, FileText, Camera, Check, Briefcase, Award, Sparkles, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  
  // Form State
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [role, setRole] = useState('')
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = () => {
    api.get('/user/profile')
      .then((res) => {
        setProfile(res.data)
        setBio(res.data.bio || '')
        setSkills(res.data.skills?.join(', ') || '')
        setRole(res.data.preferred_role || '')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File validation
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowed.includes(file.type)) {
      setErrorMsg('Invalid file type. Please upload a JPG, PNG, or WEBP image.')
      setTimeout(() => setErrorMsg(''), 4000)
      return
    }

    const formData = new FormData()
    formData.append('profile_image', file)

    setUploadingPhoto(true)
    setErrorMsg('')
    try {
      await api.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.response?.data?.message || 'Failed to upload photo.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErrorMsg('')
    try {
      await api.put('/user/profile', {
        bio,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        preferred_role: role
      })
      setSaved(true)
      fetchProfile()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to update profile details.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto font-body pb-12"
    >
      {/* Header card with glassmorphism */}
      <section className="glass-panel p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
        <div className="glow-background-glow absolute top-[-50px] right-[-50px] w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />

        <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
          <div className="w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-slate-900/60 flex items-center justify-center relative shadow-2xl transition-all duration-300 group-hover:border-cyan-455 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            {uploadingPhoto ? (
              <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center backdrop-blur-xs z-20">
                <LoadingSpinner />
              </div>
            ) : null}
            
            {profile?.profile_image ? (
              <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <User className="w-14 h-14 text-slate-500" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-full text-white hover:scale-110 transition shadow-lg shadow-indigo-500/20 border border-white/20">
            <Camera className="w-4 h-4" />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            accept="image/jpeg,image/png,image/webp,image/jpg" 
            className="hidden" 
          />
        </div>

        <div className="text-center md:text-left flex-1 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 justify-center md:justify-start font-display">
                {user?.name || 'User'}
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse text-glow-cyan" />
              </h1>
              <p className="text-slate-650 dark:text-slate-400 mt-1.5 font-medium text-sm">{user?.email}</p>
            </div>
          </div>
          
          <div className="mt-5 flex flex-wrap gap-2.5 justify-center md:justify-start">
            <span className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-white/5">
              Joined {new Date(profile?.created_at || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
            <span className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/10">
              {profile?.role || 'student'}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-12 relative z-10">
        {/* Profile Form */}
        <section className="md:col-span-7 glass-panel p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 font-display">
            <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-455 text-glow-cyan" />
            Profile Details
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Preferred Role</label>
              <input 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full glass-input px-4.5 py-3.5 text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Skills (comma separated)</label>
              <input 
                value={skills} 
                onChange={e => setSkills(e.target.value)} 
                placeholder="React, Python, MongoDB"
                className="w-full glass-input px-4.5 py-3.5 text-sm" 
              />
              
              {/* Dynamic Skills Chips */}
              <AnimatePresence>
                {skillList.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {skillList.map((skill, idx) => (
                      <motion.span 
                        key={idx}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-750 dark:text-slate-355 rounded-lg text-xs font-semibold"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-display">Professional Bio</label>
              <textarea 
                rows={4}
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Tell us about your experience..."
                className="w-full glass-input px-4.5 py-3.5 text-sm leading-relaxed" 
              />
            </div>
            
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-xl text-sm font-medium"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2 flex items-center justify-between">
              {saved ? (
                <span className="text-emerald-450 font-semibold flex items-center gap-2 text-sm"><Check className="w-5 h-5"/> Changes saved!</span>
              ) : <span />}
              <button 
                type="submit" 
                disabled={saving}
                className="glass-btn-primary px-8 py-3.5 text-sm"
              >
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Sidebar Info cards */}
        <section className="md:col-span-5 space-y-6">
          <div className="glass-panel p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/15">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">Active Resume</h2>
            </div>
            
            {profile?.resume ? (
              <div className="p-5 glass-card border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate text-sm">{profile.resume.filename || 'resume.pdf'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1.5 font-bold uppercase tracking-wider">Uploaded {new Date(profile.resume.uploaded_at).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="text-center p-8 border border-slate-200 dark:border-white/5 border-dashed bg-slate-50 dark:bg-white/[0.01] rounded-2xl text-slate-600 dark:text-slate-500 text-sm font-medium">
                No active resume found. Upload one from the Resume page.
              </div>
            )}
          </div>

          <div className="glass-panel p-8 font-display">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/15">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Preferences</h2>
            </div>
            <div className="space-y-4 text-xs font-semibold tracking-tight">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-600 dark:text-slate-455">Account Type</span>
                <span className="text-slate-800 dark:text-slate-200 capitalize">{profile?.role || 'Student'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-600 dark:text-slate-455">Resume Status</span>
                <span className={profile?.resume ? "text-emerald-650 dark:text-emerald-455 font-semibold" : "text-amber-600 dark:text-amber-500"}>
                  {profile?.resume ? "Uploaded" : "Pending"}
                </span>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full mt-4 glass-btn-danger py-3.5 text-xs"
              >
                <LogOut className="w-4 h-4" /> <span>Sign Out</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
