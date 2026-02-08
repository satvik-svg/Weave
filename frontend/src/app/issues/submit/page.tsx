'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/components/Navbar'
import LocationPicker from '@/components/LocationPicker'
import ImageUploader from '@/components/ImageUploader'
import { Upload, AlertCircle, CheckCircle, Loader2, Sparkles, MapPin, Camera, Info } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles size={16} className="text-emerald-500" />
            <span>Community Action</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Report a <span className="text-emerald-400">Community Issue</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Help us identify local problems that need community action. Our AI will analyze your submission
            and create a coordinated action plan to address it.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="e.g., Trash accumulation in Riverside Park"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-rose-600 flex items-center animate-fade-in">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none appearance-none"
                  >
                    <option value="">Select a category</option>
                    <option value="environment">Environment</option>
                    <option value="civic">Civic</option>
                    <option value="social">Social</option>
                    <option value="safety">Safety</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-rose-600 flex items-center animate-fade-in">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
                  placeholder="Describe the issue in detail. What's happening? How long has it been a problem? Who is affected?"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-rose-600 flex items-center animate-fade-in">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Location <span className="text-rose-500">*</span>
                </label>
                <LocationPicker
                  onLocationChange={(location) => {
                    setLocationData(location)
                    // Update the form's address field
                    setValue('address', location.address)
                  }}
                  initialAddress={locationData.address}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-rose-600 flex items-center animate-fade-in">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Photos <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <ImageUploader
                  onImagesChange={setImageUrls}
                  maxFiles={5}
                  bucket="images"
                  folder="issues"
                  disabled={isSubmitting}
                />
              </div>

              {/* Agent Progress Indicator */}
              {isSubmitting && (
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fade-in">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-500" />
                    AI Agent Pipeline
                  </h3>

                  {/* Discovery Agent */}
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${agentProgress.discovery === 'done' ? 'bg-emerald-100 text-emerald-600' :
                        agentProgress.discovery === 'running' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                          'bg-slate-200 text-slate-400'
                      }`}>
                      {agentProgress.discovery === 'done' ? <CheckCircle size={18} /> :
                        agentProgress.discovery === 'running' ? <Loader2 size={18} className="animate-spin" /> :
                          <div className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <div>
                      <div className={`font-medium text-sm transition-colors ${agentProgress.discovery === 'running' ? 'text-blue-700' : 'text-slate-700'
                        }`}>Discovery Agent</div>
                      <div className="text-xs text-slate-500">Analyzing issue and determining category</div>
                    </div>
                  </div>

                  {/* Planning Agent */}
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${agentProgress.planning === 'done' ? 'bg-emerald-100 text-emerald-600' :
                        agentProgress.planning === 'running' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                          'bg-slate-200 text-slate-400'
                      }`}>
                      {agentProgress.planning === 'done' ? <CheckCircle size={18} /> :
                        agentProgress.planning === 'running' ? <Loader2 size={18} className="animate-spin" /> :
                          <div className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <div>
                      <div className={`font-medium text-sm transition-colors ${agentProgress.planning === 'running' ? 'text-blue-700' : 'text-slate-700'
                        }`}>Planning Agent</div>
                      <div className="text-xs text-slate-500">Creating action plan with tasks</div>
                    </div>
                  </div>

                  {/* Matching Agent */}
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${agentProgress.matching === 'done' ? 'bg-emerald-100 text-emerald-600' :
                        agentProgress.matching === 'running' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                          'bg-slate-200 text-slate-400'
                      }`}>
                      {agentProgress.matching === 'done' ? <CheckCircle size={18} /> :
                        agentProgress.matching === 'running' ? <Loader2 size={18} className="animate-spin" /> :
                          <div className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <div>
                      <div className={`font-medium text-sm transition-colors ${agentProgress.matching === 'running' ? 'text-blue-700' : 'text-slate-700'
                        }`}>Matching Agent</div>
                      <div className="text-xs text-slate-500">Assigning volunteers to tasks</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Processing with AI Agents...
                    </>
                  ) : (
                    <>
                      <span>Submit Issue</span>
                      <Sparkles size={20} className="opacity-80" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {!isSubmitting && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                <Info className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      Our AI agents will analyze your submission
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      An action plan will be generated with specific tasks
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      Community volunteers will be notified and matched to tasks
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                      You'll receive updates on progress and impact verification
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}