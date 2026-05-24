import { createContext, ReactNode, useEffect, useState } from 'react'
import { login as loginRequest, register as registerRequest, fetchProfile } from '../services/auth'
import { setAuthToken } from '../services/api'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('smarthire_token')
    if (stored) {
      setToken(stored)
      setAuthToken(stored)
      fetchProfile(stored)
        .then((result) => {
          setUser(result)
        })
        .catch(() => {
          setToken(null)
          setUser(null)
          localStorage.removeItem('smarthire_token')
          setAuthToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const response = await loginRequest(email, password)
    setToken(response.access_token)
    setAuthToken(response.access_token)
    localStorage.setItem('smarthire_token', response.access_token)
    const profile = await fetchProfile(response.access_token)
    setUser(profile)
  }

  async function register(name: string, email: string, password: string) {
    const response = await registerRequest(name, email, password)
    setToken(response.access_token)
    setAuthToken(response.access_token)
    localStorage.setItem('smarthire_token', response.access_token)
    const profile = await fetchProfile(response.access_token)
    setUser(profile)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('smarthire_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
