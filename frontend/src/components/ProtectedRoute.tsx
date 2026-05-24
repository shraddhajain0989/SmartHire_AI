import { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactElement
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
