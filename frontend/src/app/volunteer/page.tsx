'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/Navbar'
import { MapPin, Star, Award, AlertCircle, Search, Users, Zap, Calendar, CheckCircle } from 'lucide-react'
import { volunteersApi, Volunteer } from '@/lib/api'

const skillColors: Record<string, string> = {
  'gardening': 'bg-green-100 text-green-700 border-green-200',
  'manual labor': 'bg-amber-100 text-amber-700 border-amber-200',
  'construction': 'bg-orange-100 text-orange-700 border-orange-200',
  'coordination': 'bg-purple-100 text-purple-700 border-purple-200',
  'event planning': 'bg-pink-100 text-pink-700 border-pink-200',
  'social media': 'bg-blue-100 text-blue-700 border-blue-200',
  'photography': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'communication': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'first aid': 'bg-red-100 text-red-700 border-red-200',
  'driving': 'bg-slate-100 text-slate-700 border-slate-200',
  'cooking': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'teaching': 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const getSkillColor = (skill: string) => {
  const lowercaseSkill = skill.toLowerCase()
  for (const [key, value] of Object.entries(skillColors)) {
    if (lowercaseSkill.includes(key)) return value
  }
  return 'bg-gray-100 text-gray-700 border-gray-200'
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

  const stats = {
    total: volunteers.length,
    available: volunteers.filter((v: Volunteer) => (v.availability || []).length > 0).length,
    avgReliability: volunteers.length > 0 
      ? Math.round(volunteers.reduce((sum: number, v: Volunteer) => sum + (v.reliability_score || 0), 0) / volunteers.length * 100) 
      : 0,
    totalSkills: allSkills.length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Volunteers</h1>
              <p className="text-white/80 text-lg">Meet our amazing volunteers matched by AI to community needs</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-5 py-3">
              <Zap className="text-yellow-300" size={24} />
              <div>
                <div className="text-sm text-white/70">AI-Powered Matching</div>
                <div className="font-semibold">Skills • Location • Reliability</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Users className="text-white/70" size={24} />
                <div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-white/70 text-sm">Total Volunteers</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-300" size={24} />
                <div>
                  <div className="text-3xl font-bold">{stats.available}</div>
                  <div className="text-white/70 text-sm">Available Now</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-300" size={24} />
                <div>
                  <div className="text-3xl font-bold">{stats.avgReliability}%</div>
                  <div className="text-white/70 text-sm">Avg Reliability</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Award className="text-purple-300" size={24} />
                <div>
                  <div className="text-3xl font-bold">{stats.totalSkills}</div>
                  <div className="text-white/70 text-sm">Unique Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 -mt-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search volunteers by name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            
            {/* Skill Filter */}
            <div className="md:w-64">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none bg-white"
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
          <div className="text-center py-16">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Connection Error</h3>
                <p className="text-red-700">Failed to load volunteers. Make sure the backend server is running on http://localhost:8000</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredVolunteers.length}</span> volunteers
              </p>
            </div>

            {/* Volunteers Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVolunteers.map((volunteer: Volunteer) => (
                <div
                  key={volunteer.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300"
                >
                  {/* Header with Avatar */}
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 pb-12 relative">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                          {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-12 pb-6 px-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{volunteer.name}</h3>
                      <p className="text-gray-500 text-sm">{volunteer.email}</p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{volunteer.location?.address || 'Location not specified'}</span>
                    </div>

                    {/* Reliability Score */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= Math.round((volunteer.reliability_score || 0) * 5) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {((volunteer.reliability_score || 0) * 100).toFixed(0)}% reliable
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {(volunteer.skills || []).slice(0, 4).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getSkillColor(skill)}`}
                        >
                          {skill}
                        </span>
                      ))}
                      {(volunteer.skills || []).length > 4 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{(volunteer.skills || []).length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                      <Calendar size={14} className="text-gray-400" />
                      <span className={`text-sm ${(volunteer.availability || []).length > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        {(volunteer.availability || []).length > 0 
                          ? `${(volunteer.availability || []).length} time slots available` 
                          : 'No availability set'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredVolunteers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No volunteers found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSkill('all')
                  }}
                  className="text-purple-600 font-medium hover:text-purple-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
