import { supabase } from './supabase'
import { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  volunteer_profile?: VolunteerProfile
}

export interface VolunteerProfile {
  id: string
  user_id: string
  email: string
  name: string
  location?: {
    lat: number
    lng: number
    address?: string
  }
  skills: string[]
  availability: string[]
  reliability_score: number
  phone?: string
  emergency_contact?: {
    name: string
    phone: string
    relationship: string
  }
  created_at: string
  updated_at: string
}

export const auth = {
  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Get volunteer profile if exists
    const { data: profile } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return {
      ...user,
      volunteer_profile: profile || undefined
    }
  },

  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Sign up new user
  async signUp(email: string, password: string, userData: {
    name: string
    phone?: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        data: {
          name: userData.name,
          phone: userData.phone
        }
      }
    })

    if (error) throw error
    
    // Check if email confirmation is required
    if (data.user && !data.session) {
      console.log('⚠️ Email confirmation required')
    }
    
    return data
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Create volunteer profile after signup
  async createVolunteerProfile(userId: string, profileData: {
    name: string
    email: string
    phone?: string
    location?: { lat: number; lng: number; address?: string }
    skills?: string[]
    availability?: string[]
    emergency_contact?: { name: string; phone: string; relationship: string }
  }): Promise<VolunteerProfile> {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([{
        user_id: userId,
        email: profileData.email,
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        skills: profileData.skills || [],
        availability: profileData.availability || [],
        emergency_contact: profileData.emergency_contact,
        reliability_score: 0.8
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update volunteer profile
  async updateVolunteerProfile(userId: string, updates: Partial<VolunteerProfile>) {
    const { data, error } = await supabase
      .from('volunteers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get volunteer profile by user ID
  async getVolunteerProfile(userId: string): Promise<VolunteerProfile | null> {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Request password reset
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
    return data
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return data
  }
}