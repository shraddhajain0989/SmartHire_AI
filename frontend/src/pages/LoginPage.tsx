import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-10 shadow-glass backdrop-blur-xl transition-all duration-300">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">Login to practice interviews and track your placement performance.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-950/80 px-4 py-3 text-slate-800 dark:text-white outline-none transition focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-950/80 px-4 py-3 text-slate-800 dark:text-white outline-none transition focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950"
            />
          </label>
          {error && <div className="text-sm text-rose-500 dark:text-rose-400">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Don’t have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-cyan-600 dark:text-cyan-300 hover:underline">
            Register now
          </button>
        </p>
      </div>
    </div>
  )
}
