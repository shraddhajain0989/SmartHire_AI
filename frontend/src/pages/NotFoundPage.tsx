import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-12 shadow-glass backdrop-blur-xl">
        <h1 className="text-5xl font-semibold text-white">404</h1>
        <p className="mt-4 text-slate-400">We couldn’t find that page.</p>
        <Link to="/" className="mt-8 inline-block rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
          Return home
        </Link>
      </div>
    </div>
  )
}
