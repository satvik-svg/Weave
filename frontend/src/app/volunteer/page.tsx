'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { MapPin, Clock, Users, Star, Calendar } from 'lucide-react'

// Mock data for volunteer opportunities
const volunteerOpportunities = [
  {
    id: '1',
    title: 'Park Cleanup Crew Leader',
    issue_title: 'Riverside Park Cleanup Drive',
    description: 'Lead a team of 5-8 volunteers in organizing cleanup activities',
    skills_needed: ['Leadership', 'Organization'],
    time_commitment: '4 hours',
    date: '2024-01-28',
    location: 'Riverside Park, Downtown',
    urgency: 'high',
    volunteers_needed: 2,
    volunteers_assigned: 1,
  },
  {
    id: '2',
    title: 'Safety Patrol Coordinator',
    issue_title: 'Neighborhood Watch Program',
    description: 'Help coordinate patrol schedules and community communication',
    skills_needed: ['Communication', 'Organization', 'Safety Knowledge'],
    time_commitment: '3 hours/week',
    date: '2024-01-25',
    location: 'Oak Street District',
    urgency: 'high',
    volunteers_needed: 3,
    volunteers_assigned: 1,
  },
  {
    id: '3',
    title: 'Food Distribution Helper',
    issue_title: 'Food Distribution Network',
    description: 'Assist with sorting, packing, and distributing food packages',
    skills_needed: ['Physical work', 'Customer service'],
    time_commitment: '2 hours',
    date: '2024-01-26',
    location: 'Community Center, 5th Ave',
    urgency: 'medium',
    volunteers_needed: 6,
    volunteers_assigned: 4,
  },
  {
    id: '4',
    title: 'Community Liaison',
    issue_title: 'Pothole Repair Initiative',
    description: 'Interface with city officials and track repair progress',
    skills_needed: ['Communication', 'Documentation'],
    time_commitment: '2-3 hours',
    date: '2024-01-30',
    location: 'Main Street area',
    urgency: 'low',
    volunteers_needed: 1,
    volunteers_assigned: 0,
  },
]

const urgencyColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
}

export default function VolunteerPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [timeAvailable, setTimeAvailable] = useState('all')
  
  const allSkills = ['Leadership', 'Organization', 'Communication', 'Safety Knowledge', 'Physical work', 'Customer service', 'Documentation']
  
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const filteredOpportunities = volunteerOpportunities.filter(opp => {
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => opp.skills_needed.includes(skill))
    
    const matchesTime = timeAvailable === 'all' || 
      (timeAvailable === 'short' && parseInt(opp.time_commitment) <= 3) ||
      (timeAvailable === 'medium' && parseInt(opp.time_commitment) > 3 && parseInt(opp.time_commitment) <= 6) ||
      (timeAvailable === 'long' && parseInt(opp.time_commitment) > 6)
    
    return matchesSkills && matchesTime
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">Join the Movement</h1>
          <p className="text-xl text-blue-100 mb-6">
            Make a real impact in your community. Our AI matches you to volunteer opportunities 
            based on your skills, availability, and location.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">156</div>
              <div className="text-blue-100">Active Volunteers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">43</div>
              <div className="text-blue-100">Issues Resolved</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2,847</div>
              <div className="text-blue-100">Hours Contributed</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Opportunities</h2>
              
              {/* Skills Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Skills</h3>
                <div className="space-y-2">
                  {allSkills.map(skill => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Time Commitment Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Time Available</h3>
                <select
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All timeframes</option>
                  <option value="short">1-3 hours</option>
                  <option value="medium">4-6 hours</option>
                  <option value="long">6+ hours</option>
                </select>
              </div>

              {/* Profile Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Your Volunteer Profile</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Tasks Completed</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hours Contributed</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reliability Score</span>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Opportunities ({filteredOpportunities.length})
              </h2>
            </div>

            <div className="space-y-6">
              {filteredOpportunities.map(opportunity => (
                <div key={opportunity.id} className="bg-white rounded-lg shadow-sm p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${urgencyColors[opportunity.urgency as keyof typeof urgencyColors]}`}>
                          {opportunity.urgency} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          {opportunity.volunteers_assigned}/{opportunity.volunteers_needed} volunteers assigned
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{opportunity.title}</h3>
                      <p className="text-sm text-blue-600">{opportunity.issue_title}</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{opportunity.description}</p>

                  {/* Skills Needed */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 mr-2">Skills needed:</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {opportunity.skills_needed.map(skill => (
                        <span
                          key={skill}
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedSkills.includes(skill)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{opportunity.time_commitment}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      <span>{opportunity.volunteers_needed - opportunity.volunteers_assigned} spots left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more opportunities.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}