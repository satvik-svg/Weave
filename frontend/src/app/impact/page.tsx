'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { TrendingUp, CheckCircle, MapPin, Users, Calendar, Camera, Shield, Award } from 'lucide-react'

// Mock data for impact verification
const verifiedImpacts = [
  {
    id: '1',
    title: 'Riverside Park Cleanup Success',
    issue_title: 'Riverside Park Cleanup Drive',
    completion_date: '2024-01-22',
    verification_status: 'verified',
    confidence_score: 0.94,
    impact_metrics: {
      trash_bags_collected: 45,
      area_cleaned_sqft: 12500,
      volunteers_participated: 15,
      hours_contributed: 60,
    },
    evidence: {
      before_images: 3,
      after_images: 4,
      gps_checkins: 15,
      peer_validations: 8,
    },
    location: 'Riverside Park, Downtown',
    community_feedback: [
      { user: 'Sarah M.', comment: 'The park looks amazing! Great work everyone!', rating: 5 },
      { user: 'Mike R.', comment: 'Noticed the difference immediately. Thank you!', rating: 5 },
    ],
  },
  {
    id: '2',
    title: 'Food Distribution Program Impact',
    issue_title: 'Winter Food Distribution Network',
    completion_date: '2024-01-20',
    verification_status: 'verified',
    confidence_score: 0.91,
    impact_metrics: {
      families_served: 45,
      meals_distributed: 180,
      volunteers_participated: 20,
      weeks_active: 6,
    },
    evidence: {
      distribution_records: 24,
      recipient_confirmations: 42,
      volunteer_logs: 20,
      partner_validations: 3,
    },
    location: 'Community Center, 5th Ave',
    community_feedback: [
      { user: 'Maria L.', comment: 'This program was a lifesaver for our family.', rating: 5 },
      { user: 'John D.', comment: 'Well organized and respectful distribution.', rating: 5 },
    ],
  },
  {
    id: '3',
    title: 'Safety Patrol Establishment',
    issue_title: 'Neighborhood Watch Program',
    completion_date: '2024-01-18',
    verification_status: 'pending_verification',
    confidence_score: 0.76,
    impact_metrics: {
      patrol_routes_established: 4,
      volunteers_trained: 12,
      incident_reports: 2,
      community_meetings_held: 3,
    },
    evidence: {
      training_certificates: 12,
      patrol_logs: 28,
      incident_reports: 2,
      community_surveys: 15,
    },
    location: 'Oak Street District',
    community_feedback: [
      { user: 'David K.', comment: 'Feel safer walking at night now.', rating: 4 },
    ],
  },
]

const verificationStatusColors = {
  verified: 'bg-green-100 text-green-800 border-green-200',
  pending_verification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verification_failed: 'bg-red-100 text-red-800 border-red-200',
}

export default function ImpactPage() {
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredImpacts = verifiedImpacts.filter(impact => 
    filter === 'all' || impact.verification_status === filter
  )

  const totalMetrics = {
    verified_projects: verifiedImpacts.filter(i => i.verification_status === 'verified').length,
    total_volunteers: verifiedImpacts.reduce((sum, impact) => 
      sum + (impact.impact_metrics.volunteers_participated || 0), 0),
    avg_confidence: (verifiedImpacts.reduce((sum, impact) => 
      sum + impact.confidence_score, 0) / verifiedImpacts.length * 100).toFixed(1),
    community_feedback: verifiedImpacts.reduce((sum, impact) => 
      sum + impact.community_feedback.length, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Verification</h1>
          <p className="text-gray-600">
            Real-world outcomes verified through evidence and community validation
          </p>
        </div>

        {/* Impact Overview */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Community Impact Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{totalMetrics.verified_projects}</div>
              <div className="text-green-100">Verified Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{totalMetrics.total_volunteers}</div>
              <div className="text-green-100">Total Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{totalMetrics.avg_confidence}%</div>
              <div className="text-green-100">Avg. Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{totalMetrics.community_feedback}</div>
              <div className="text-green-100">Community Reviews</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Verifications</option>
              <option value="verified">Verified</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="verification_failed">Failed Verification</option>
            </select>
          </div>
        </div>

        {/* Verified Impacts List */}
        <div className="space-y-6">
          {filteredImpacts.map((impact) => (
            <div key={impact.id} className="bg-white rounded-lg shadow-sm">
              {/* Impact Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${verificationStatusColors[impact.verification_status as keyof typeof verificationStatusColors]}`}>
                        {impact.verification_status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center text-xs text-gray-600">
                        <Shield size={12} className="mr-1" />
                        <span>{Math.round(impact.confidence_score * 100)}% confidence</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{impact.title}</h2>
                    <p className="text-sm text-blue-600">{impact.issue_title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImpact(selectedImpact === impact.id ? null : impact.id)}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {selectedImpact === impact.id ? 'Hide Details' : 'View Evidence'}
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {Object.entries(impact.impact_metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{value}</div>
                      <div className="text-xs text-gray-600">{key.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{impact.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>Completed: {new Date(impact.completion_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    <span>{impact.evidence.peer_validations || 0} peer validations</span>
                  </div>
                </div>
              </div>

              {/* Evidence Details (Expandable) */}
              {selectedImpact === impact.id && (
                <div className="p-6">
                  {/* Evidence Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield size={20} className="mr-2" />
                      Verification Evidence
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(impact.evidence).map(([type, count]) => (
                        <div key={type} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Camera size={16} className="text-blue-600 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{count}</div>
                            <div className="text-xs text-gray-600">{type.replace('_', ' ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Community Feedback */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users size={20} className="mr-2" />
                      Community Feedback
                    </h3>
                    <div className="space-y-3">
                      {impact.community_feedback.map((feedback, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2">"{feedback.comment}"</p>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium mr-2">{feedback.user}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Score Breakdown */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <Award size={16} className="mr-2" />
                      Verification Confidence: {Math.round(impact.confidence_score * 100)}%
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-green-700 font-medium">Evidence Quality:</span>
                        <div className="text-green-600">High - Multiple sources verified</div>
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Community Validation:</span>
                        <div className="text-green-600">Strong - {impact.evidence.peer_validations} confirmations</div>
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Impact Measurability:</span>
                        <div className="text-green-600">Clear - Quantifiable outcomes</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredImpacts.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No verified impacts found</h3>
            <p className="text-gray-600">Check back later as projects complete verification.</p>
          </div>
        )}
      </div>
    </div>
  )
}