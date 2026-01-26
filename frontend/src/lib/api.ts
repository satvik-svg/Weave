import { supabase } from './supabase'
import { Issue, ActionPlan, Volunteer } from './supabase'

// Issues API
export const issuesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Issue[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Issue
  },

  async create(issue: Partial<Issue>) {
    const { data, error } = await supabase
      .from('issues')
      .insert([issue])
      .select()
      .single()
    
    if (error) throw error
    return data as Issue
  },

  async update(id: string, updates: Partial<Issue>) {
    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Issue
  }
}

// Action Plans API
export const plansApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('action_plans')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as ActionPlan[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('action_plans')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as ActionPlan
  },

  async getByIssueId(issueId: string) {
    const { data, error } = await supabase
      .from('action_plans')
      .select('*')
      .eq('issue_id', issueId)
    
    if (error) throw error
    return data as ActionPlan[]
  }
}

// Volunteers API
export const volunteersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Volunteer[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Volunteer
  },

  async create(volunteer: Partial<Volunteer>) {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([volunteer])
      .select()
      .single()
    
    if (error) throw error
    return data as Volunteer
  },

  async update(id: string, updates: Partial<Volunteer>) {
    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Volunteer
  }
}