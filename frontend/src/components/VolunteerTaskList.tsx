'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/database'
import { useAuth } from '@/providers/AuthProvider'
import CheckInCard from './CheckInCard'
import { Loader2, ClipboardList } from 'lucide-react'

type TaskStatus = 'all' | 'assigned' | 'accepted' | 'in_progress' | 'completed'

export default function VolunteerTaskList() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<TaskStatus>('all')

  const loadAssignments = async () => {
    if (!user?.volunteer_profile?.id) {
      setError('Volunteer profile not found')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await db.getTaskAssignments(user.volunteer_profile.id)
      setAssignments(data || [])
    } catch (err: any) {
      console.error('Failed to load task assignments:', err)
      setError(err.message || 'Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [user])

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter)

  const statusCounts = {
    all: assignments.length,
    assigned: assignments.filter(a => a.status === 'assigned').length,
    accepted: assignments.filter(a => a.status === 'accepted').length,
    in_progress: assignments.filter(a => a.status === 'in_progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Error loading tasks</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={loadAssignments}
          className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <ClipboardList size={48} className="mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Tasks Assigned</h3>
        <p className="text-gray-600 text-sm">
          You don't have any tasks assigned yet. Check back later or browse available tasks.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1 overflow-x-auto">
        {(['all', 'assigned', 'in_progress', 'completed'] as TaskStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All Tasks' : status.replace('_', ' ').toUpperCase()}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              filter === status
                ? 'bg-blue-500'
                : 'bg-gray-200'
            }`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
            No tasks with status: {filter}
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <CheckInCard
              key={assignment.id}
              assignment={assignment}
              onCheckInComplete={loadAssignments}
            />
          ))
        )}
      </div>
    </div>
  )
}
