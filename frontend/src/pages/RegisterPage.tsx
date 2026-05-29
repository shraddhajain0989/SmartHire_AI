import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { Sparkles, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(name, email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg items-center justify-center px-4 py-10 font-body">
      <div className="w-full glass-panel p-8 md:p-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-black text-lg tracking-tight text-slate-900 dark:text-white">SmartHire <span className="text-cyan-400 font-medium">AI</span></span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">Sign up to access AI mock interviews and dynamic code compiles.</p>
        
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-555 dark:text-slate-450 uppercase tracking-wider font-display">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Sarah Jenkins"
              className="w-full glass-input px-4 py-3.5 text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-555 dark:text-slate-450 uppercase tracking-wider font-display">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="sarah@example.com"
              className="w-full glass-input px-4 py-3.5 text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-555 dark:text-slate-450 uppercase tracking-wider font-display">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full glass-input px-4 py-3.5 text-sm"
            />
          </div>

          {error && <div className="text-xs font-semibold text-rose-450 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full glass-btn-primary py-3.5 text-sm"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>
        
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-bold transition">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
