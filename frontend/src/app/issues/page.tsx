'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { MapPin, Users, Clock, Filter, Search } from 'lucide-react'

// Mock data - replace with Supabase queries
const mockIssues = [
  {
    id: '1',
    title: 'Riverside Park Cleanup Drive',
    description: 'Large amount of trash and debris has accumulated along the walking trails...',
    category: 'environment',
    status: 'in_progress',
    location: { address: 'Riverside Park, Downtown' },
    created_at: '2024-01-20',
    volunteers_count: 12,
    priority: 0.85,
  },
  {
    id: '2',
    title: 'Neighborhood Watch Program',
    description: 'Establishing safety patrols for residential area after recent incidents...',
    category: 'safety',
    status: 'planning',
    location: { address: 'Oak Street District' },
    created_at: '2024-01-18',
    volunteers_count: 8,
    priority: 0.92,
  },
  {
    id: '3',
    title: 'Food Distribution Network',
    description: 'Weekly food distribution for families in need during winter months...',
    category: 'social',
    status: 'completed',
    location: { address: 'Community Center, 5th Ave' },
    created_at: '2024-01-15',
    volunteers_count: 15,
    priority: 0.78,
  },
  {
    id: '4',
    title: 'Pothole Repair Initiative',
    description: 'Multiple dangerous potholes on Main Street affecting traffic safety...',
    category: 'infrastructure',
    status: 'pending',
    location: { address: 'Main Street, Mile 2-4' },
    created_at: '2024-01-22',
    volunteers_count: 3,
    priority: 0.67,
  },
]

const categoryColors = {
  environment: 'bg-green-100 text-green-800',
  safety: 'bg-red-100 text-red-800',
  social: 'bg-purple-100 text-purple-800',
  infrastructure: 'bg-yellow-100 text-yellow-800',
  civic: 'bg-blue-100 text-blue-800',
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  planning: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  verified: 'bg-emerald-100 text-emerald-800',
}

export default function IssuesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIssues = mockIssues.filter(issue => {
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Issues</h1>
            <p className="text-gray-600">Track and participate in local action initiatives</p>
          </div>
          <Link
            href="/issues/submit"
            className="mt-4 sm:mt-0 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Report New Issue
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="environment">Environment</option>
                <option value="safety">Safety</option>
                <option value="social">Social</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="civic">Civic</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Issues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[issue.category as keyof typeof categoryColors]}`}>
                    {issue.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[issue.status as keyof typeof statusColors]}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${issue.priority > 0.8 ? 'bg-red-400' : issue.priority > 0.6 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{issue.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{issue.description}</p>

              {/* Meta */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  <span>{issue.location.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{issue.volunteers_count} volunteers</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/issues/${issue.id}`}
                  className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}