'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, CheckCircle, XCircle, Navigation, Timer, AlertCircle } from 'lucide-react'
import { db } from '@/lib/database'
import { getCurrentLocation, verifyLocationProximity, calculateTimeSpent, formatDistance } from '@/lib/gps'

interface TaskAssignment {
  id: string
  task_id: string
  volunteer_id: string
  status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'withdrawn'
  assigned_at: string
  started_at?: string
  completed_at?: string
  notes?: string
  tasks: {
    id: string
    name: string
    description: string
    location?: { lat: number; lng: number; address?: string }
    deadline?: string
  }
}

interface CheckInCardProps {
  assignment: TaskAssignment
  onCheckInComplete: () => void
}

export default function CheckInCard({ assignment, onCheckInComplete }: CheckInCardProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationStatus, setLocationStatus] = useState<{
    isValid: boolean
    distance: number
    message: string
  } | null>(null)
  const [checkOutNotes, setCheckOutNotes] = useState('')
  const [timeSpent, setTimeSpent] = useState<string>('')

  const task = assignment.tasks
  const isInProgress = assignment.status === 'in_progress'
  const isCompleted = assignment.status === 'completed'
  const canCheckIn = assignment.status === 'assigned' || assignment.status === 'accepted'

  // Update time spent timer
  useEffect(() => {
    if (isInProgress && assignment.started_at) {
      const updateTimer = () => {
        const spent = calculateTimeSpent(assignment.started_at!)
        setTimeSpent(spent.formatted)
      }
      updateTimer()
      const interval = setInterval(updateTimer, 60000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [isInProgress, assignment.started_at])

  const handleCheckIn = async () => {
    if (!task.location) {
      setError('Task location not set. Cannot verify check-in.')
      return
    }

    setIsCheckingIn(true)
    setError(null)
    setLocationStatus(null)

    try {
      // Get current location
      const currentLocation = await getCurrentLocation()

      // Verify proximity to task location
      const verification = verifyLocationProximity(
        currentLocation,
        task.location,
        100 // 100 meters tolerance
      )

      setLocationStatus(verification)

      if (!verification.isValid) {
        setError(verification.message)
        setIsCheckingIn(false)
        return
      }

      // Check in to task
      await db.checkInToTask(assignment.id, {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address: task.location.address
      })

      console.log('✅ Checked in successfully')
      onCheckInComplete()
    } catch (err: any) {
      console.error('❌ Check-in error:', err)
      setError(err.message || 'Failed to check in')
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleCheckOut = async () => {
    if (!task.location) {
      setError('Task location not set. Cannot verify check-out.')
      return
    }

    setIsCheckingOut(true)
    setError(null)

    try {
      // Get current location
      const currentLocation = await getCurrentLocation()

      // Verify proximity (optional for check-out, but recommended)
      const verification = verifyLocationProximity(
        currentLocation,
        task.location,
        100
      )

      if (!verification.isValid) {
        // Warning but allow check-out
        console.warn('Check-out location verification:', verification.message)
      }

      // Check out from task
      await db.checkOutFromTask(
        assignment.id,
        {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          address: task.location.address
        },
        checkOutNotes
      )

      console.log('✅ Checked out successfully')
      onCheckInComplete()
    } catch (err: any) {
      console.error('❌ Check-out error:', err)
      setError(err.message || 'Failed to check out')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${
      isCompleted ? 'border-green-200 bg-green-50/50' : 
      isInProgress ? 'border-blue-300' : 
      'border-gray-200'
    }`}>
      {/* Task Header */}
      <div className={`p-4 ${
        isCompleted ? 'bg-green-100' : 
        isInProgress ? 'bg-blue-100' : 
        'bg-gray-50'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{task.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCompleted ? 'bg-green-600 text-white' :
            isInProgress ? 'bg-blue-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {assignment.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="p-4 space-y-3">
        {/* Location */}
        {task.location && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{task.location.address || `${task.location.lat}, ${task.location.lng}`}</span>
          </div>
        )}

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-700">
              Due: {new Date(task.deadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}

        {/* Time Spent (when in progress) */}
        {isInProgress && timeSpent && (
          <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Timer size={16} className="text-blue-600" />
            <span className="font-medium text-blue-700">Time spent: {timeSpent}</span>
          </div>
        )}

        {/* Location Status */}
        {locationStatus && (
          <div className={`flex items-start gap-2 p-3 rounded-lg ${
            locationStatus.isValid 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            {locationStatus.isValid ? (
              <CheckCircle size={16} className="text-green-600 mt-0.5" />
            ) : (
              <XCircle size={16} className="text-amber-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                locationStatus.isValid ? 'text-green-700' : 'text-amber-700'
              }`}>
                {locationStatus.message}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Distance: {formatDistance(locationStatus.distance)}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={16} className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Check-Out Notes */}
        {isInProgress && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Completion Notes (Optional)
            </label>
            <textarea
              value={checkOutNotes}
              onChange={(e) => setCheckOutNotes(e.target.value)}
              placeholder="Add any notes about completing this task..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {canCheckIn && (
            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCheckingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Verifying Location...</span>
                </>
              ) : (
                <>
                  <Navigation size={18} />
                  <span>Check In</span>
                </>
              )}
            </button>
          )}

          {isInProgress && (
            <button
              onClick={handleCheckOut}
              disabled={isCheckingOut}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Checking Out...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Check Out & Complete</span>
                </>
              )}
            </button>
          )}

          {isCompleted && assignment.completed_at && (
            <div className="flex-1 text-center py-3 bg-green-100 text-green-700 rounded-lg font-medium">
              ✓ Completed {new Date(assignment.completed_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
