'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/providers/AuthProvider'
import { auth, VolunteerProfile } from '@/lib/auth'
import { User, Mail, Phone, MapPin, Award, Clock, Users, Save, Edit } from 'lucide-react'
import LocationPicker from './LocationPicker'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  skills: z.string().optional(),
  availability: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileManager() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // Load profile data when user or editing state changes
  useEffect(() => {
    if (user?.volunteer_profile) {
      const profile = user.volunteer_profile
      form.reset({
        name: profile.name,
        phone: profile.phone || '',
        skills: profile.skills.join(', '),
        availability: profile.availability.join(', '),
        emergencyContactName: profile.emergency_contact?.name || '',
        emergencyContactPhone: profile.emergency_contact?.phone || '',
        emergencyContactRelationship: profile.emergency_contact?.relationship || '',
      })
      setLocation(profile.location || null)
    }
  }, [user?.volunteer_profile, form])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return

    setIsLoading(true)
    setMessage(null)

    try {
      const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      const availability = data.availability ? data.availability.split(',').map(s => s.trim()).filter(Boolean) : []
      
      const emergency_contact = data.emergencyContactName ? {
        name: data.emergencyContactName,
        phone: data.emergencyContactPhone || '',
        relationship: data.emergencyContactRelationship || 'Emergency Contact'
      } : undefined

      const updates = {
        name: data.name,
        phone: data.phone,
        location: location || undefined,
        skills,
        availability,
        emergency_contact
      }

      await auth.updateVolunteerProfile(user.id, updates)
      await refreshUser()
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    )
  }

  const profile = user.volunteer_profile

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Volunteer Profile</h2>
            <p className="text-gray-600">Manage your information and preferences</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Stats */}
        {profile && !isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(profile.reliability_score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Reliability Score</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {profile.skills.length}
              </div>
              <div className="text-sm text-gray-600">Skills Listed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {profile.availability.length}
              </div>
              <div className="text-sm text-gray-600">Time Slots Available</div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            {/* Email (read-only) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...form.register('name')}
                  type="text"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-300 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...form.register('phone')}
                  type="tel"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-300 bg-gray-50 text-gray-700'
                  }`}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location
              </label>
              {isEditing ? (
                <LocationPicker
                  onLocationChange={(loc) => setLocation(loc.coordinates ? { lat: loc.coordinates.lat, lng: loc.coordinates.lng, address: loc.address } : null)}
                  initialLocation={location}
                  placeholder="Enter your location"
                />
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  {location?.address || 'No location set'}
                </div>
              )}
            </div>
          </div>

          {/* Volunteer Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Volunteer Information</h3>

            {/* Skills */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills & Expertise
              </label>
              <input
                {...form.register('skills')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                }`}
                placeholder="e.g., Construction, Teaching, First Aid (comma separated)"
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
              )}
            </div>

            {/* Availability */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <input
                {...form.register('availability')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                }`}
                placeholder="e.g., Weekends, Evenings, Monday-Friday (comma separated)"
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">When are you typically available?</p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
            
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <input
                {...form.register('emergencyContactName')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                }`}
                placeholder="Contact name"
              />
              <input
                {...form.register('emergencyContactPhone')}
                type="tel"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                }`}
                placeholder="Contact phone"
              />
              <input
                {...form.register('emergencyContactRelationship')}
                type="text"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                }`}
                placeholder="Relationship (e.g., Parent, Spouse, Friend)"
              />
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}