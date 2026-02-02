'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { useAuth } from '@/providers/AuthProvider'
import { Phone, MapPin, Users, Clock, AlertCircle } from 'lucide-react'
import LocationPicker from './LocationPicker'
import { useRouter } from 'next/navigation'

const volunteerSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
  skills: z.string().min(1, 'Please enter at least one skill'),
  availability: z.string().min(1, 'Please specify your availability'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactRelationship: z.string().min(2, 'Relationship is required'),
})

type VolunteerFormData = z.infer<typeof volunteerSchema>

export default function VolunteerRegistrationForm() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  })

  const onSubmit = async (data: VolunteerFormData) => {
    if (!user) {
      setError('You must be signed in to become a volunteer')
      return
    }

    if (!location) {
      setError('Please provide your location')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean)
      const availability = data.availability.split(',').map(s => s.trim()).filter(Boolean)
      
      const emergency_contact = {
        name: data.emergencyContactName,
        phone: data.emergencyContactPhone,
        relationship: data.emergencyContactRelationship
      }

      await auth.createVolunteerProfile(user.id, {
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Volunteer',
        email: user.email!,
        phone: data.phone,
        location,
        skills,
        availability,
        emergency_contact
      })

      await refreshUser()
      
      console.log('✅ Volunteer profile created successfully')
      router.push('/volunteer/dashboard')
    } catch (error: any) {
      console.error('❌ Volunteer registration error:', error)
      setError(error.message || 'Failed to register as volunteer')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Sign In Required</h3>
            <p className="text-yellow-700">Please sign in or create an account before registering as a volunteer.</p>
          </div>
        </div>
      </div>
    )
  }

  if (user.volunteer_profile) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Users className="text-green-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-green-800 mb-1">Already a Volunteer!</h3>
            <p className="text-green-700 mb-4">You're already registered as a volunteer.</p>
            <button
              onClick={() => router.push('/volunteer/dashboard')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-purple-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Become a Volunteer</h2>
          <p className="text-gray-600">
            Join our community and make a real impact in your neighborhood
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Account</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user.user_metadata?.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Phone Number *
            </label>
            <input
              {...form.register('phone')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your phone number"
            />
            {form.formState.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location *
            </label>
            <LocationPicker
              onLocationChange={(loc) => setLocation(loc.coordinates ? { lat: loc.coordinates.lat, lng: loc.coordinates.lng, address: loc.address } : null)}
              placeholder="Enter your location"
            />
            {!location && (
              <p className="text-amber-600 text-xs mt-1">Location is required for task matching</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Expertise *
            </label>
            <input
              {...form.register('skills')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Construction, Teaching, First Aid, Gardening"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
            {form.formState.errors.skills && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.skills.message}</p>
            )}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Availability *
            </label>
            <input
              {...form.register('availability')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Weekends, Monday evenings, Flexible"
            />
            <p className="text-xs text-gray-500 mt-1">When are you typically available to volunteer?</p>
            {form.formState.errors.availability && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.availability.message}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-4">Emergency Contact *</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  {...form.register('emergencyContactName')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Full name"
                />
                {form.formState.errors.emergencyContactName && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.emergencyContactName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  {...form.register('emergencyContactPhone')}
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Phone number"
                />
                {form.formState.errors.emergencyContactPhone && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.emergencyContactPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input
                  {...form.register('emergencyContactRelationship')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Parent, Spouse, Friend"
                />
                {form.formState.errors.emergencyContactRelationship && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.emergencyContactRelationship.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Registering...' : 'Complete Registration'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By registering as a volunteer, you agree to help with community tasks and maintain reliability.
          </p>
        </form>
      </div>
    </div>
  )
}
