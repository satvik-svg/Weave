'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Clock, Search, AlertCircle, Filter, ArrowRight, TrendingUp, Leaf, Shield, Users, Building, Flag } from 'lucide-react'
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

const categoryConfig: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  environment: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Leaf },
  safety: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Shield },
  social: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Users },
  infrastructure: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Building },
  civic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Flag },
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  planning: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
  in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  verified: { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-400' },
}

export default function IssuesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ['issues'],
    queryFn: () => db.getIssues(),
  })

  // Safe filtering
  const filteredIssues = issues.filter((issue: any) => {
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus
    // Ensure title/desc exist before calling toLowerCase
    const title = issue.title || ''
    const desc = issue.description || ''
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const stats = {
    total: issues.length || 0,
    pending: issues.filter((i: Issue) => i.status === 'pending').length || 0,
    inProgress: issues.filter((i: Issue) => i.status === 'in_progress' || i.status === 'planning').length || 0,
    completed: issues.filter((i: Issue) => i.status === 'completed' || i.status === 'verified').length || 0,
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/3"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Flag size={16} className="text-emerald-500" />
                <span>Community Action Tracker</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Spot Issues. <span className="text-emerald-400">Spark Change.</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Your neighborhood's voice matters. Report local problems, track their progress,
                and watch as our AI agents coordinate real-world solutions.
              </p>
            </div>

            <Link
              href="/issues/submit"
              className="group flex items-center space-x-3 bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              <span>Report New Issue</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-slate-400 text-sm font-medium">Total Issues</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.pending}</div>
              <div className="text-slate-400 text-sm font-medium">Pending Analysis</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.inProgress}</div>
              <div className="text-slate-400 text-sm font-medium">In Progress</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.completed}</div>
              <div className="text-slate-400 text-sm font-medium">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12 -mt-20 relative z-10 mx-4 lg:mx-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search issues by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-600 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none bg-white text-slate-600 outline-none cursor-pointer"
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none bg-white text-slate-600 outline-none cursor-pointer"
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
          <div className="text-center py-20">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500">Loading community issues...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-rose-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-rose-800 mb-1">Connection Error</h3>
                <p className="text-rose-600">Failed to load issues. Please check your connection.</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-600">
                Showing <span className="font-bold text-slate-900">{filteredIssues.length}</span> issues
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <TrendingUp size={16} />
                <span>Sorted by latest</span>
              </div>
            </div>

            {/* Issues Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredIssues.map((issue: Issue) => {
                const category = categoryConfig[issue.category] || categoryConfig.civic
                const status = statusConfig[issue.status] || statusConfig.pending
                const Icon = category.icon;

                return (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.id}`}
                    className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col"
                  >
                    {/* Category Header */}
                    <div className={`${category.bg} ${category.border} border-b px-6 py-4`}>
                      <div className="flex items-center justify-between">
                        <span className={`flex items-center gap-2 text-sm font-bold ${category.text}`}>
                          <Icon size={16} />
                          <span className="capitalize">{issue.category}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          <span className={`text-xs font-bold ${status.text} uppercase tracking-wider`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                        {issue.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{issue.description}</p>

                      <div className="mt-auto">
                        {/* Meta */}
                        <div className="space-y-3 text-sm text-slate-500 mb-6">
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="truncate">{issue.location?.address || 'Location not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <Clock size={14} className="text-slate-400" />
                            <span>{new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Priority Indicator */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</span>
                            <div className="flex gap-1" title={`Priority Level: ${issue.priority}`}>
                              {[1, 2, 3].map((level) => (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded-full ${issue.priority >= level
                                      ? issue.priority >= 3 ? 'bg-rose-400' : issue.priority >= 2 ? 'bg-amber-400' : 'bg-emerald-400'
                                      : 'bg-slate-200'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-emerald-600 text-sm font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Details
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredIssues.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No issues found</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  We couldn't find any issues matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedStatus('all')
                    setSearchQuery('')
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
