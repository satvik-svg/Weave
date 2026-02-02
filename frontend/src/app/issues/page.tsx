'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { MapPin, Clock, Search, AlertCircle, Filter, Sparkles, ArrowRight, TrendingUp } from 'lucide-react'
import { db } from '@/lib/database'

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: number
  location?: {
    lat: number
    lng: number
    address?: string
  }
  created_at: string
}

const categoryConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  environment: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🌱' },
  safety: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '🛡️' },
  social: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '🤝' },
  infrastructure: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '🏗️' },
  civic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '🏛️' },
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  planning: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-400' },
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
}

export default function IssuesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ['issues'],
    queryFn: () => db.getIssues(),
  })

  const filteredIssues = issues.filter((issue: any) => {
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const stats = {
    total: issues.length,
    pending: issues.filter((i: Issue) => i.status === 'pending').length,
    inProgress: issues.filter((i: Issue) => i.status === 'in_progress' || i.status === 'planning').length,
    completed: issues.filter((i: Issue) => i.status === 'completed' || i.status === 'verified').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Community Issues</h1>
              <p className="text-white/80 text-lg">Track and participate in local action initiatives</p>
            </div>
            <Link
              href="/issues/submit"
              className="group flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              <Sparkles size={20} />
              <span>Report New Issue</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-white/70 text-sm">Total Issues</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="text-white/70 text-sm">Pending Analysis</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{stats.inProgress}</div>
              <div className="text-white/70 text-sm">In Progress</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{stats.completed}</div>
              <div className="text-white/70 text-sm">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 -mt-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                <option value="environment">🌱 Environment</option>
                <option value="safety">🛡️ Safety</option>
                <option value="social">🤝 Social</option>
                <option value="infrastructure">🏗️ Infrastructure</option>
                <option value="civic">🏛️ Civic</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="verified">Verified</option>
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
            <p className="text-gray-600">Loading community issues...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Connection Error</h3>
                <p className="text-red-700">Failed to load issues. Make sure the backend server is running on http://localhost:8000</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredIssues.length}</span> issues
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} />
                <span>Sorted by latest</span>
              </div>
            </div>

            {/* Issues Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredIssues.map((issue: Issue) => {
                const category = categoryConfig[issue.category] || categoryConfig.civic
                const status = statusConfig[issue.status] || statusConfig.pending
                
                return (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300"
                  >
                    {/* Category Header */}
                    <div className={`${category.bg} ${category.border} border-b px-6 py-3`}>
                      <div className="flex items-center justify-between">
                        <span className={`flex items-center gap-2 text-sm font-medium ${category.text}`}>
                          <span>{category.icon}</span>
                          <span className="capitalize">{issue.category}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          <span className={`text-xs font-medium ${status.text} capitalize`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {issue.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>

                      {/* Meta */}
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="truncate">{issue.location?.address || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span>{new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Priority Indicator */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Priority:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3].map((level) => (
                              <div 
                                key={level}
                                className={`w-2 h-2 rounded-full ${
                                  issue.priority >= level * 0.33 
                                    ? issue.priority > 0.66 ? 'bg-red-400' : issue.priority > 0.33 ? 'bg-yellow-400' : 'bg-green-400'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          View Details
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredIssues.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedStatus('all')
                    setSearchQuery('')
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
