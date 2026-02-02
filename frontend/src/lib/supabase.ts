import { createClient } from '@supabase/supabase-js'

// Get environment variables and clean them
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

// Validate URL format
const isValidSupabaseUrl = (url: string): boolean => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('supabase.co') && parsed.protocol.startsWith('http')
  } catch {
    return false
  }
}

// Check if configuration is valid
const hasValidConfig = isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey.length > 20

if (!hasValidConfig && typeof window !== 'undefined') {
  console.warn(
    '🔧 Supabase configuration missing or invalid!\n' +
    'Current URL: "' + supabaseUrl + '"\n' +
    'Please check your .env.local file:\n' +
    '- NEXT_PUBLIC_SUPABASE_URL (should be https://yourproject.supabase.co)\n' +
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY (should be a long JWT token)'
  )
}

// Create client with proper fallback
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      'https://example.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY1ODg4NCwiZXhwIjoxOTU5MjM0ODg0fQ.fake'
    )

export const isSupabaseConfigured = hasValidConfig

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