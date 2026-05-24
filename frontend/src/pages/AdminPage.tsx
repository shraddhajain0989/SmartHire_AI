import { useEffect, useState } from 'react'
import { fetchAdminData } from '../services/interview'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Admin dashboard</h1>
        <p className="mt-2 text-slate-400">Manage student accounts, review interview sessions, and view platform adoption metrics.</p>
      </section>
      <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-white">Users</h2>
        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80">
          <table className="w-full border-collapse text-left text-sm text-slate-200">
            <thead className="bg-slate-950/90 text-slate-400">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-t border-slate-800">
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-800 hover:bg-slate-950/80">
                    <td className="px-5 py-4">{user.name}</td>
                    <td className="px-5 py-4">{user.email}</td>
                    <td className="px-5 py-4">{user.role}</td>
                    <td className="px-5 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-slate-800">
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
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
