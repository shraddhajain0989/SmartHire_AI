import api from './api'

export interface CodingQuestion {
  id: string
  title: string
  difficulty: string
  category?: string
  description: string
  templates: {
    python: string
    javascript: string
    c: string
    cpp: string
    java: string
  }
}

export interface TestCaseResult {
  test_case: number
  inputs: string
  expected: string
  output?: string
  error?: string
  passed: boolean
}

export interface RunCodeResponse {
  success: boolean
  all_passed: boolean
  results?: TestCaseResult[]
  error?: string
  stdout: string
}

export async function fetchCodingQuestions(): Promise<CodingQuestion[]> {
  const response = await api.get('/coding/questions')
  return response.data.questions
}

export async function submitCodingSolution(payload: { question_id: string; code: string; language: string }): Promise<RunCodeResponse> {
  const response = await api.post('/coding/run', payload)
  return response.data
}
