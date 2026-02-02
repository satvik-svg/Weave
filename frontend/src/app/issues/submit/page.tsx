'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/components/Navbar'
import LocationPicker from '@/components/LocationPicker'
import ImageUploader from '@/components/ImageUploader'
import { Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { db } from '@/lib/database'

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['environment', 'civic', 'social', 'safety', 'infrastructure']),
  address: z.string().min(3, 'Location is required'),
})

type IssueFormData = z.infer<typeof issueSchema>

interface LocationData {
  address: string
  coordinates?: { lat: number; lng: number }
}

export default function SubmitIssuePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [locationData, setLocationData] = useState<LocationData>({ address: '' })
  const [agentProgress, setAgentProgress] = useState<{
    discovery: 'pending' | 'running' | 'done'
    planning: 'pending' | 'running' | 'done'
    matching: 'pending' | 'running' | 'done'
  }>({ discovery: 'pending', planning: 'pending', matching: 'pending' })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  })

  const onSubmit = async (data: IssueFormData) => {
    setIsSubmitting(true)
    setAgentProgress({ discovery: 'running', planning: 'pending', matching: 'pending' })
    
    try {
      console.log('=== SUBMITTING ISSUE TO BACKEND API ===')
      console.log('Form data:', data)
      
      // Call backend API which triggers REAL AI agents
      const { issuesApi } = await import('@/lib/api')
      const newIssue = await issuesApi.create({
        title: data.title,
        description: data.description,
        category: data.category,
        location: {
          address: data.address,
          lat: locationData.coordinates?.lat || 40.7128,
          lng: locationData.coordinates?.lng || -74.0060
        },
        images: imageUrls,
      })
      
      console.log('✅ Issue created, AI agents processing in background:', newIssue)
      console.log('Issue ID:', newIssue.id)
      console.log('=====================================')
      
      // UI progress indicators (real AI agents run in background)
      setTimeout(() => setAgentProgress(prev => ({ ...prev, discovery: 'done', planning: 'running' })), 3000)
      setTimeout(() => setAgentProgress(prev => ({ ...prev, planning: 'done', matching: 'running' })), 6000)
      setTimeout(() => setAgentProgress(prev => ({ ...prev, matching: 'done' })), 9000)
      
      // Wait a bit for UI feedback
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      alert('✅ Issue submitted! AI agents are processing it now. Check the issue page for real-time updates!')
      router.push(`/issues/${newIssue.id}`)
    } catch (error) {
      console.error('❌ Error submitting issue:', error)
      alert('❌ Error submitting issue: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setAgentProgress({ discovery: 'pending', planning: 'pending', matching: 'pending' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Community Issue</h1>
            <p className="text-gray-600">
              Help us identify local problems that need community action. Our AI will analyze your submission 
              and create a coordinated action plan to address it.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Trash accumulation in Riverside Park"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="environment">Environment</option>
                <option value="civic">Civic</option>
                <option value="social">Social</option>
                <option value="safety">Safety</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue in detail. What's happening? How long has it been a problem? Who is affected?"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <LocationPicker
              onLocationChange={(location) => {
                setLocationData(location)
                // Update the form's address field
                setValue('address', location.address)
              }}
              initialAddress={locationData.address}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.address.message}
              </p>
            )}

            {/* Image Upload */}
            <ImageUploader
              onImagesChange={setImageUrls}
              maxFiles={5}
              bucket="images"
              folder="issues"
              disabled={isSubmitting}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing with AI Agents...
                  </>
                ) : 'Submit Issue'}
              </button>
            </div>

            {/* Agent Progress Indicator */}
            {isSubmitting && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
                <h3 className="font-semibold text-purple-900 mb-3">🤖 AI Agent Pipeline</h3>
                
                {/* Discovery Agent */}
                <div className="flex items-center gap-3">
                  {agentProgress.discovery === 'done' ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : agentProgress.discovery === 'running' ? (
                    <Loader2 size={20} className="text-purple-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium text-sm">Discovery Agent</div>
                    <div className="text-xs text-gray-600">Analyzing issue and determining category</div>
                  </div>
                </div>

                {/* Planning Agent */}
                <div className="flex items-center gap-3">
                  {agentProgress.planning === 'done' ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : agentProgress.planning === 'running' ? (
                    <Loader2 size={20} className="text-purple-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium text-sm">Planning Agent</div>
                    <div className="text-xs text-gray-600">Creating action plan with tasks</div>
                  </div>
                </div>

                {/* Matching Agent */}
                <div className="flex items-center gap-3">
                  {agentProgress.matching === 'done' ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : agentProgress.matching === 'running' ? (
                    <Loader2 size={20} className="text-purple-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium text-sm">Matching Agent</div>
                    <div className="text-xs text-gray-600">Assigning volunteers to tasks</div>
                  </div>
                </div>
              </div>
            )}
          </form>

          {!isSubmitting && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our AI agents will analyze your submission</li>
                <li>• An action plan will be generated with specific tasks</li>
                <li>• Community volunteers will be notified and matched to tasks</li>
                <li>• You'll receive updates on progress and impact verification</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}