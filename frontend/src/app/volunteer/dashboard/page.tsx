'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VolunteerTaskList from '@/components/VolunteerTaskList'
import { Users, Calendar, Award, TrendingUp, Sparkles, MapPin, Clock } from 'lucide-react'

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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    )
  }

  if (!user || !user.volunteer_profile) {
    return null
  }

  const profile = user.volunteer_profile

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles size={16} className="text-emerald-500" />
                <span>Volunteer Dashboard</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                Welcome back, <span className="text-emerald-400">{profile.name}!</span>
              </h1>
              <p className="text-slate-400 text-lg">Thank you for making a difference in your community.</p>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <Award size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{Math.round(profile.reliability_score * 100)}%</div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Reliability Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">0</div>
              <div className="text-slate-500 font-medium">Active Tasks</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">0</div>
              <div className="text-slate-500 font-medium">Completed Tasks</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={28} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">0h</div>
              <div className="text-slate-500 font-medium">Hours Contributed</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={20} />
                Your Tasks
              </h2>
              <VolunteerTaskList />
            </div>
          </div>

          {/* Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Profile Details</h2>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Availability</h3>
                <div className="space-y-2">
                  {profile.availability.map((time, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <Clock size={16} className="text-emerald-500" />
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-2">Ready for more?</h3>
              <p className="text-emerald-100 text-sm mb-4">Find new opportunities to help your community.</p>
              <button
                onClick={() => router.push('/volunteer')}
                className="w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Find Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
