// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
    throw new Error(error.detail || `API error: ${response.status}`)
  }

  return response.json()
}

// Issues API
export const issuesApi = {
  async getAll(limit = 50) {
    const response = await apiFetch<{ issues: Issue[]; count: number }>(
      `/api/issues?limit=${limit}`
    )
    return response.issues
  },

  async getById(id: string) {
    return apiFetch<Issue>(`/api/issues/${id}`)
  },

  async create(issue: Partial<Issue>) {
    return apiFetch<Issue>('/api/issues', {
      method: 'POST',
      body: JSON.stringify(issue),
    })
  },

  async update(id: string, updates: Partial<Issue>) {
    return apiFetch<Issue>(`/api/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }
}

// Action Plans API
export const plansApi = {
  async getAll(limit = 50) {
    const response = await apiFetch<{ action_plans: ActionPlan[]; count: number }>(
      `/api/action-plans?limit=${limit}`
    )
    return response.action_plans
  },

  async getById(id: string) {
    return apiFetch<ActionPlan>(`/api/action-plans/${id}`)
  },

  async getByIssueId(issueId: string) {
    const response = await apiFetch<{ action_plans: ActionPlan[]; count: number }>(
      `/api/action-plans?issue_id=${issueId}`
    )
    return response.action_plans
  },

  async getTasks(planId: string) {
    const response = await apiFetch<{ tasks: any[]; count: number }>(
      `/api/action-plans/${planId}/tasks`
    )
    console.log('API getTasks raw response:', response)
    console.log('API getTasks returning:', response.tasks)
    return response
  }
}

// Volunteers API
export const volunteersApi = {
  async getAll(limit = 50) {
    const response = await apiFetch<{ volunteers: Volunteer[]; count: number }>(
      `/api/volunteers?limit=${limit}`
    )
    return response.volunteers
  },

  async getById(id: string) {
    return apiFetch<Volunteer>(`/api/volunteers/${id}`)
  },

  async getAssignments(volunteerId: string) {
    const response = await apiFetch<{ assignments: any[]; count: number }>(
      `/api/volunteers/${volunteerId}/assignments`
    )
    return response.assignments
  },

  async getTaskAssignments(taskId: string) {
    const response = await apiFetch<{ assignments: any[]; count: number }>(
      `/api/tasks/${taskId}/assignments`
    )
    return response.assignments
  }
}

// Agent Logs API
export const logsApi = {
  async getAll(limit = 50) {
    const response = await apiFetch<{ logs: any[]; count: number }>(
      `/api/agent-logs?limit=${limit}`
    )
    return response.logs
  }
}

// Type definitions
export interface Issue {
  id: string
  title: string
  description: string
  category: string
  location: {
    address: string
    lat: number
    lng: number
  }
  priority: number
  status: string
  created_at: string
  images?: string[]
  metadata?: any
}

export interface ActionPlan {
  id: string
  issue_id: string
  title: string
  description: string
  status: string
  priority: string
  estimated_duration_days: number
  required_volunteers: number
  assigned_volunteers: number
  progress_percentage: number
  created_at: string
  metadata?: any
}

export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  location: {
    address: string
    lat: number
    lng: number
  }
  skills: string[]
  availability: string[]
  reliability_score: number
  created_at: string
}