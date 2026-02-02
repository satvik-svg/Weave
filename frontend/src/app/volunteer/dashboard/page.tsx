'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VolunteerTaskList from '@/components/VolunteerTaskList'
import { Users, Calendar, Award, TrendingUp } from 'lucide-react'

export default function VolunteerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth?mode=signin')
    } else if (!isLoading && user && !user.volunteer_profile) {
      router.push('/volunteer/register')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (!user || !user.volunteer_profile) {
    return null
  }

  const profile = user.volunteer_profile

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.name}!</h1>
          <p className="text-purple-100">Your volunteer dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-blue-600" size={24} />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-gray-600 text-sm">Active Tasks</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-green-600" size={24} />
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="text-gray-600 text-sm">Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="text-purple-600" size={24} />
              <span className="text-2xl font-bold">{Math.round(profile.reliability_score * 100)}%</span>
            </div>
            <p className="text-gray-600 text-sm">Reliability</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-amber-600" size={24} />
              <span className="text-2xl font-bold">0h</span>
            </div>
            <p className="text-gray-600 text-sm">Hours Contributed</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {profile.availability.map((time, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Tasks</h2>
          <VolunteerTaskList />
        </div>
      </div>

      <Footer />
    </div>
  )
}
