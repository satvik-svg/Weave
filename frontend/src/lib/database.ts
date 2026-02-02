import { supabase } from './supabase'

// Database utility functions for WEAVE platform

export const db = {
  // Issues
  async createIssue(issue: {
    title: string
    description: string
    category: string
    location: { lat: number; lng: number; address?: string }
    priority?: number
    created_by?: string
    images?: string[]
  }) {
    const { data, error } = await supabase
      .from('issues')
      .insert([{
        title: issue.title,
        description: issue.description,
        category: issue.category,
        location: issue.location,
        priority: issue.priority || 0.5,
        created_by: issue.created_by,
        images: issue.images || [],
        status: 'pending'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getIssues() {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getIssue(id: string) {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Action Plans
  async createActionPlan(plan: {
    issue_id: string
    title: string
    description?: string
    estimated_duration_days?: number
    required_volunteers?: number
  }) {
    const { data, error } = await supabase
      .from('action_plans')
      .insert([{
        issue_id: plan.issue_id,
        title: plan.title,
        description: plan.description,
        estimated_duration_days: plan.estimated_duration_days || 7,
        required_volunteers: plan.required_volunteers || 1,
        status: 'draft'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getActionPlans() {
    const { data, error } = await supabase
      .from('action_plans')
      .select(`
        *,
        issues (
          title,
          category,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Tasks
  async createTask(task: {
    action_plan_id: string
    name: string
    description?: string
    required_people?: number
    estimated_hours?: number
    skills_required?: string[]
    location?: { lat: number; lng: number; address?: string }
    deadline?: string
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        action_plan_id: task.action_plan_id,
        name: task.name,
        description: task.description,
        required_people: task.required_people || 1,
        estimated_hours: task.estimated_hours,
        skills_required: task.skills_required || [],
        location: task.location,
        deadline: task.deadline,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getTasks(actionPlanId?: string) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        action_plans (
          title,
          issue_id
        )
      `)

    if (actionPlanId) {
      query = query.eq('action_plan_id', actionPlanId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Volunteers
  async createVolunteer(volunteer: {
    email: string
    name: string
    location?: { lat: number; lng: number }
    skills?: string[]
    availability?: string[]
    phone?: string
    emergency_contact?: object
  }) {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([{
        email: volunteer.email,
        name: volunteer.name,
        location: volunteer.location,
        skills: volunteer.skills || [],
        availability: volunteer.availability || [],
        phone: volunteer.phone,
        emergency_contact: volunteer.emergency_contact,
        reliability_score: 0.8
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getVolunteers() {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Task Assignments
  async assignVolunteerToTask(taskId: string, volunteerId: string) {
    const { data, error } = await supabase
      .from('task_assignments')
      .insert([{
        task_id: taskId,
        volunteer_id: volunteerId,
        status: 'assigned'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getTaskAssignments(volunteerId?: string) {
    let query = supabase
      .from('task_assignments')
      .select(`
        *,
        tasks (
          id,
          name,
          description,
          location,
          deadline,
          action_plan_id
        ),
        volunteers (
          name,
          email,
          phone
        )
      `)

    if (volunteerId) {
      query = query.eq('volunteer_id', volunteerId)
    }

    const { data, error } = await query.order('assigned_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateTaskAssignmentStatus(
    assignmentId: string, 
    status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'withdrawn',
    additionalData?: {
      started_at?: string
      completed_at?: string
      notes?: string
    }
  ) {
    const updateData: any = { status }
    
    if (additionalData?.started_at) updateData.started_at = additionalData.started_at
    if (additionalData?.completed_at) updateData.completed_at = additionalData.completed_at
    if (additionalData?.notes) updateData.notes = additionalData.notes

    const { data, error } = await supabase
      .from('task_assignments')
      .update(updateData)
      .eq('id', assignmentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async checkInToTask(assignmentId: string, location: { lat: number; lng: number; address?: string }) {
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('task_assignments')
      .update({
        status: 'in_progress',
        started_at: now,
        notes: JSON.stringify({ check_in_location: location, check_in_time: now })
      })
      .eq('id', assignmentId)
      .select(`
        *,
        tasks (
          id,
          name,
          description,
          location
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async checkOutFromTask(assignmentId: string, location: { lat: number; lng: number; address?: string }, notes?: string) {
    const now = new Date().toISOString()
    
    // Get existing notes to preserve check-in data
    const { data: existing } = await supabase
      .from('task_assignments')
      .select('notes')
      .eq('id', assignmentId)
      .single()

    let combinedNotes = existing?.notes || '{}'
    try {
      const parsed = JSON.parse(combinedNotes)
      parsed.check_out_location = location
      parsed.check_out_time = now
      if (notes) parsed.completion_notes = notes
      combinedNotes = JSON.stringify(parsed)
    } catch {
      combinedNotes = JSON.stringify({ check_out_location: location, check_out_time: now, completion_notes: notes })
    }

    const { data, error } = await supabase
      .from('task_assignments')
      .update({
        status: 'completed',
        completed_at: now,
        notes: combinedNotes
      })
      .eq('id', assignmentId)
      .select(`
        *,
        tasks (
          id,
          name,
          description
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  // Impact Verifications
  async createVerification(verification: {
    action_plan_id: string
    verification_type: 'photo_evidence' | 'gps_checkin' | 'peer_validation' | 'survey_response' | 'metric_data'
    evidence_data: object
    submitted_by: string
    notes?: string
  }) {
    const { data, error } = await supabase
      .from('impact_verifications')
      .insert([{
        action_plan_id: verification.action_plan_id,
        verification_type: verification.verification_type,
        evidence_data: verification.evidence_data,
        submitted_by: verification.submitted_by,
        notes: verification.notes,
        verification_status: 'pending'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Notifications
  async createNotification(notification: {
    user_id: string
    type: string
    title: string
    message: string
    data?: object
  }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}