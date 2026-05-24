import api from './api'

export interface AuthResponse {
  access_token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await api.post('/auth/register', { name, email, password })
  return response.data
}

export async function fetchProfile(token: string) {
  const response = await api.get('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
