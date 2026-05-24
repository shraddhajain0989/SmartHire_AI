import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
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

  return (
    <header className="backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/80 sticky top-0 z-50 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div>
          <Link to="/" className="font-semibold text-slate-900 dark:text-white text-lg">
            SmartHire AI
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
          {user ? (
            <>
              <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/interview" className="hover:text-slate-900 dark:hover:text-white transition">
                Interview
              </Link>
              <Link to="/coding" className="hover:text-slate-900 dark:hover:text-white transition">
                Coding
              </Link>
              <Link to="/resume" className="hover:text-slate-900 dark:hover:text-white transition">
                Resume
              </Link>
              <Link to="/analytics" className="hover:text-slate-900 dark:hover:text-white transition">
                Analytics
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-slate-900 dark:hover:text-white transition">
                  Admin
                </Link>
              )}
              
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Toggle Theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition mr-2"
                title="Toggle Theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              
              <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
