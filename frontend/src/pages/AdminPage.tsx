import { useEffect, useState } from 'react'
import { fetchAdminData } from '../services/interview'
import { Users, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <section className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-cyan-500" />
          Admin Command Center
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Manage student accounts, review interview sessions, and view platform adoption metrics.</p>
        
        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="glass-card p-5 border-none bg-slate-900/40">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-cyan-500" /> Total Users
            </div>
            <div className="text-2xl font-black text-white">{users.length}</div>
          </div>
          <div className="glass-card p-5 border-none bg-slate-900/40 opacity-70">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Active Sessions
            </div>
            <div className="text-2xl font-black text-white">--</div>
          </div>
        </div>
      </section>

      {/* Users Table */}
      <section className="glass-panel p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-500" /> Users Directory
          </h2>
        </div>
        
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-widest text-[10px] font-bold border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${user.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all duration-200">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
