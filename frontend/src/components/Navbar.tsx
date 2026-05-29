import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  Video, 
  Code, 
  Layers, 
  History, 
  FileText, 
  LineChart, 
  User, 
  ShieldAlert, 
  Sun, 
  Moon, 
  LogOut, 
  Sparkles
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navItemClass = (path: string) => {
    const active = isActive(path)
    return `relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold tracking-tight transition-all duration-300 ${
      active 
        ? 'text-slate-900 dark:text-white bg-slate-900/10 dark:bg-white/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-slate-900/10 dark:border-white/15'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5 border border-transparent'
    }`
  }

  return (
    <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="glass-panel mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-display font-black text-xl text-slate-900 dark:text-white tracking-tighter hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white fill-current" />
            </div>
            <span>SmartHire <span className="text-cyan-400 font-medium">AI</span></span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {user && (
            <>
              <Link to="/" className={navItemClass('/')}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/interview" className={navItemClass('/interview')}>
                <Video className="w-4 h-4" />
                <span>Interview</span>
              </Link>
              <Link to="/coding" className={navItemClass('/coding')}>
                <Code className="w-4 h-4" />
                <span>Coding</span>
              </Link>
              <Link to="/practice" className={navItemClass('/practice')}>
                <Layers className="w-4 h-4" />
                <span>Practice</span>
              </Link>
              <Link to="/playback" className={navItemClass('/playback')}>
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              <Link to="/resume" className={navItemClass('/resume')}>
                <FileText className="w-4 h-4" />
                <span>Resume</span>
              </Link>
              <Link to="/analytics" className={navItemClass('/analytics')}>
                <LineChart className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              <Link to="/profile" className={navItemClass('/profile')}>
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={navItemClass('/admin')}>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs font-semibold text-slate-650 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                {user.name}
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="glass-btn-secondary px-4 py-2 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="glass-btn-primary px-4 py-2 text-xs">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown for smaller screens */}
      {user && (
        <div className="lg:hidden mt-2 glass-panel py-2 px-4 flex flex-wrap gap-2 justify-center">
          <Link to="/" className={navItemClass('/')}>
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/interview" className={navItemClass('/interview')}>
            <Video className="w-3.5 h-3.5" />
            <span>Interview</span>
          </Link>
          <Link to="/coding" className={navItemClass('/coding')}>
            <Code className="w-3.5 h-3.5" />
            <span>Coding</span>
          </Link>
          <Link to="/practice" className={navItemClass('/practice')}>
            <Layers className="w-3.5 h-3.5" />
            <span>Practice</span>
          </Link>
          <Link to="/playback" className={navItemClass('/playback')}>
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </Link>
          <Link to="/resume" className={navItemClass('/resume')}>
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </Link>
          <Link to="/analytics" className={navItemClass('/analytics')}>
            <LineChart className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </Link>
          <Link to="/profile" className={navItemClass('/profile')}>
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
        </div>
      )}
    </header>
  )
}
