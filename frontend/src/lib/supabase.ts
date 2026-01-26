import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Issue = {
  id: string
  title: string
  description: string
  category: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  priority: number
  status: 'pending' | 'planning' | 'in_progress' | 'completed' | 'verified'
  created_at: string
  created_by: string
  images?: string[]
}

export type ActionPlan = {
  id: string
  issue_id: string
  title: string
  tasks: Task[]
  estimated_duration_days: number
  required_volunteers: number
  status: 'draft' | 'active' | 'completed'
  created_at: string
}

export type Task = {
  id: string
  name: string
  description?: string
  required_people: number
  estimated_hours: number
  status: 'pending' | 'in_progress' | 'completed'
  assigned_volunteers?: string[]
}

export type Volunteer = {
  id: string
  email: string
  name: string
  location?: {
    lat: number
    lng: number
  }
  skills: string[]
  availability: string[]
  reliability_score: number
  created_at: string
}