import api from './api'

export interface InterviewSession {
  _id: string
  type: string
  role: string
  difficulty: string
  created_at: string
}

export interface InterviewAnswerResponse {
  similarity: number
  technical_score: number
  communication_score: number
  feedback: string
}

export async function startInterview(payload: { type: string; role: string; difficulty: string }) {
  const response = await api.post('/interview/start', payload)
  return response.data
}

export async function fetchQuestion(sessionId: string) {
  const response = await api.get(`/interview/questions?session_id=${sessionId}`)
  return response.data
}

export async function submitAnswer(data: FormData) {
  const response = await api.post('/interview/answer', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function fetchAnalytics() {
  const response = await api.get('/analytics/summary')
  return response.data
}

export async function fetchAdminData() {
  const response = await api.get('/admin/users')
  return response.data
}
