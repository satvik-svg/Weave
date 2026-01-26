'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Target, Users, Clock, CheckCircle, AlertCircle, MapPin, Calendar } from 'lucide-react'

// Mock data for action plans
const actionPlans = [
  {
    id: '1',
    title: 'Riverside Park Restoration Plan',
    issue_title: 'Riverside Park Cleanup Drive',
    status: 'in_progress',
    priority: 'high',
    created_at: '2024-01-20',
    estimated_completion: '2024-01-28',
    progress: 65,
    total_volunteers_needed: 15,
    assigned_volunteers: 12,
    location: 'Riverside Park, Downtown',
    tasks: [
      { id: '1', name: 'Area Assessment & Planning', status: 'completed', assignees: 2 },
      { id: '2', name: 'Supply Gathering', status: 'completed', assignees: 1 },
      { id: '3', name: 'Volunteer Recruitment', status: 'in_progress', assignees: 3 },
      { id: '4', name: 'Cleanup Execution', status: 'pending', assignees: 8 },
      { id: '5', name: 'Progress Documentation', status: 'pending', assignees: 1 },
      { id: '6', name: 'Impact Verification', status: 'pending', assignees: 2 },
    ],
  },
  {
    id: '2',
    title: 'Oak Street Safety Initiative',
    issue_title: 'Neighborhood Watch Program',
    status: 'planning',
    priority: 'high',
    created_at: '2024-01-18',
    estimated_completion: '2024-02-15',
    progress: 25,
    total_volunteers_needed: 10,
    assigned_volunteers: 3,
    location: 'Oak Street District',
    tasks: [
      { id: '1', name: 'Community Needs Assessment', status: 'completed', assignees: 2 },
      { id: '2', name: 'Safety Training Program Design', status: 'in_progress', assignees: 1 },
      { id: '3', name: 'Volunteer Coordinator Recruitment', status: 'pending', assignees: 2 },
      { id: '4', name: 'Patrol Schedule Creation', status: 'pending', assignees: 1 },
      { id: '5', name: 'Community Launch Event', status: 'pending', assignees: 4 },
    ],
  },
  {
    id: '3',
    title: 'Winter Food Distribution Program',
    issue_title: 'Food Distribution Network',
    status: 'completed',
    priority: 'medium',
    created_at: '2024-01-10',
    estimated_completion: '2024-01-22',
    progress: 100,
    total_volunteers_needed: 20,
    assigned_volunteers: 20,
    location: 'Community Center, 5th Ave',
    tasks: [
      { id: '1', name: 'Partner Organization Outreach', status: 'completed', assignees: 3 },
      { id: '2', name: 'Logistics Planning', status: 'completed', assignees: 2 },
      { id: '3', name: 'Volunteer Training', status: 'completed', assignees: 2 },
      { id: '4', name: 'Weekly Distribution Events', status: 'completed', assignees: 12 },
      { id: '5', name: 'Impact Assessment', status: 'completed', assignees: 1 },
    ],
  },
]

const statusColors = {
  planning: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  verified: 'bg-emerald-100 text-emerald-800',
}

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

const taskStatusIcons = {
  completed: <CheckCircle size={16} className="text-green-500" />,
  in_progress: <Clock size={16} className="text-yellow-500" />,
  pending: <AlertCircle size={16} className="text-gray-400" />,
}

export default function PlansPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const filteredPlans = actionPlans.filter(plan => 
    selectedStatus === 'all' || plan.status === selectedStatus
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Action Plans</h1>
          <p className="text-gray-600">
            AI-generated plans turning community issues into coordinated action
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {actionPlans.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <Target className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {actionPlans.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {actionPlans.reduce((sum, plan) => sum + plan.assigned_volunteers, 0)}
                </p>
              </div>
              <Users className="text-purple-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(actionPlans.reduce((sum, plan) => sum + plan.progress, 0) / actionPlans.length)}%
                </p>
              </div>
              <Clock className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm">
              {/* Plan Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[plan.status as keyof typeof statusColors]}`}>
                        {plan.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[plan.priority as keyof typeof priorityColors]}`}>
                        {plan.priority} priority
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{plan.title}</h2>
                    <p className="text-sm text-blue-600">{plan.issue_title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {selectedPlan === plan.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{plan.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{plan.assigned_volunteers}/{plan.total_volunteers_needed} volunteers</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>Due: {new Date(plan.estimated_completion).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Plan Details (Expandable) */}
              {selectedPlan === plan.id && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks & Progress</h3>
                  <div className="space-y-3">
                    {plan.tasks.map((task, index) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
                            <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{task.name}</p>
                            <div className="flex items-center mt-1">
                              {taskStatusIcons[task.status as keyof typeof taskStatusIcons]}
                              <span className="ml-2 text-sm text-gray-600 capitalize">
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span>{task.assignees} assigned</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Join This Plan
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Share Progress
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No plans found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}