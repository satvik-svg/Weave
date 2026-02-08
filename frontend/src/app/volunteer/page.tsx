'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Star, Award, AlertCircle, Search, Users, Zap, Calendar, CheckCircle } from 'lucide-react'
import { volunteersApi, Volunteer } from '@/lib/api'

const skillColors: Record<string, string> = {
  'gardening': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'manual labor': 'bg-amber-100 text-amber-700 border-amber-200',
  'construction': 'bg-orange-100 text-orange-700 border-orange-200',
  'coordination': 'bg-teal-100 text-teal-700 border-teal-200',
  'event planning': 'bg-rose-100 text-rose-700 border-rose-200',
  'social media': 'bg-blue-100 text-blue-700 border-blue-200',
  'photography': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'communication': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'first aid': 'bg-red-100 text-red-700 border-red-200',
  'driving': 'bg-slate-100 text-slate-700 border-slate-200',
  'cooking': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'teaching': 'bg-lime-100 text-lime-700 border-lime-200',
}

const getSkillColor = (skill: string) => {
  const lowercaseSkill = skill.toLowerCase()
  for (const [key, value] of Object.entries(skillColors)) {
    if (lowercaseSkill.includes(key)) return value
  }
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export default function VolunteerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('all')

  const { data: volunteers = [], isLoading, error } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => volunteersApi.getAll(100),
  })

  // Get all unique skills
  const allSkills = [...new Set(volunteers.flatMap((v: Volunteer) => v.skills || []))]

  const filteredVolunteers = volunteers.filter((volunteer: Volunteer) => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (volunteer.skills || []).some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSkill = selectedSkill === 'all' || (volunteer.skills || []).includes(selectedSkill)
    return matchesSearch && matchesSkill
  })

  // Safe checks for stats to avoid NaN
  const safeTotal = volunteers.length || 0;
  const safeAvailable = volunteers.filter((v: Volunteer) => (v.availability || []).length > 0).length || 0;
  const avgReliabilityRaw = safeTotal > 0
    ? volunteers.reduce((sum: number, v: Volunteer) => sum + (v.reliability_score || 0), 0) / safeTotal * 100
    : 0;
  const safeAvgReliability = Math.round(avgReliabilityRaw);
  const safeUniqueSkills = allSkills.length || 0;

  const stats = {
    total: safeTotal,
    available: safeAvailable,
    avgReliability: safeAvgReliability,
    totalSkills: safeUniqueSkills,
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Users size={16} />
                <span>Community Force</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Meet the <span className="text-emerald-400">Changemakers</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Connect with local heroes dedicated to making a difference.
                Matched by AI for maximum impact in your neighborhood.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                <Zap size={24} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">AI Powered</div>
                <div className="text-white font-semibold">Smart Matching Active</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.total}</div>
                  <div className="text-slate-400 text-sm">Volunteers</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.available}</div>
                  <div className="text-slate-400 text-sm">Available Now</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                  <Star size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.avgReliability}%</div>
                  <div className="text-slate-400 text-sm">Reliability</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <Award size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalSkills}</div>
                  <div className="text-slate-400 text-sm">Unique Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12 -mt-20 relative z-10 mx-4 lg:mx-0">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search volunteers by name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-600 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Skill Filter */}
            <div className="md:w-64">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none bg-white text-slate-600 outline-none cursor-pointer"
              >
                <option value="all">All Skills</option>
                {allSkills.sort().map((skill: string) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500">Finding volunteers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-rose-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-rose-800 mb-1">Connection Error</h3>
                <p className="text-rose-600">Failed to load volunteers. Please check your connection.</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-600">
                Showing <span className="font-bold text-slate-900">{filteredVolunteers.length}</span> volunteers
              </p>
            </div>

            {/* Volunteers Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVolunteers.map((volunteer: Volunteer) => (
                <div
                  key={volunteer.id}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col"
                >
                  {/* Header with Avatar */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 pb-12 relative border-b border-slate-100 group-hover:from-emerald-50/50 group-hover:to-teal-50/50 transition-colors">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg ring-4 ring-white">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                          {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-12 pb-8 px-6 flex-grow flex flex-col">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{volunteer.name}</h3>
                      <p className="text-slate-500 text-sm">{volunteer.email}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-center gap-6 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="truncate max-w-[120px]">{volunteer.location?.address || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="font-medium">{((volunteer.reliability_score || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {(volunteer.skills || []).slice(0, 3).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getSkillColor(skill)}`}
                        >
                          {skill}
                        </span>
                      ))}
                      {(volunteer.skills || []).length > 3 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          +{(volunteer.skills || []).length - 3}
                        </span>
                      )}
                    </div>

                    {/* Availability Footer */}
                    <div className="mt-auto pt-6 border-t border-slate-100 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Calendar size={16} className={(volunteer.availability || []).length > 0 ? 'text-emerald-500' : 'text-slate-300'} />
                        <span className={(volunteer.availability || []).length > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                          {(volunteer.availability || []).length > 0 ? `${(volunteer.availability || []).length} Slots Open` : 'No Availability'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredVolunteers.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No volunteers found</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  We couldn't find anyone matching your criteria. Try adjusting filters or search for a different skill.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSkill('all')
                  }}
                  className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
