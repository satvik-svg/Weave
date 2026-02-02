'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  name?: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: number;
  assigned_volunteer?: {
    id: string;
    name: string;
    email: string;
    skills: string[];
    assignment_status: string;
    assigned_at: string;
  };
}

interface ActionPlan {
  id: string;
  issue_id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'in_progress' | 'completed';
  assigned_volunteers?: number;
  required_volunteers?: number;
  estimated_duration_days?: number;
  created_at: string;
  tasks?: Task[];
  issue?: {
    title: string;
    category: string;
    location: string;
  };
}

const statusConfig: Record<string, { color: string; bg: string; icon: string; borderColor: string }> = {
  draft: { color: 'text-gray-600', bg: 'bg-gray-100', icon: '📝', borderColor: 'border-gray-300' },
  active: { color: 'text-blue-600', bg: 'bg-blue-100', icon: '🚀', borderColor: 'border-blue-300' },
  in_progress: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚡', borderColor: 'border-yellow-300' },
  completed: { color: 'text-green-600', bg: 'bg-green-100', icon: '✅', borderColor: 'border-green-300' },
};

const taskStatusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  pending: { color: 'text-gray-600', bg: 'bg-gray-100', icon: '⏳' },
  in_progress: { color: 'text-blue-600', bg: 'bg-blue-100', icon: '🔄' },
  completed: { color: 'text-green-600', bg: 'bg-green-100', icon: '✅' },
};

const priorityColors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-red-600'];

export default function PlansPage() {
  const [filter, setFilter] = useState<string>('all');
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch plans from database
  const { data: plans, isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ['action-plans-with-tasks'],
    queryFn: async () => {
      console.log('Fetching plans from database...');
      const result = await db.getActionPlans();
      console.log('Plans fetched:', result.length);
      
      // Fetch tasks for each plan
      const plansWithTasks = await Promise.all(
        result.map(async (plan) => {
          const tasks = await db.getTasks(plan.id);
          return {
            ...plan,
            tasks: tasks || []
          };
        })
      );
      
      console.log('Plans with tasks:', plansWithTasks);
      return plansWithTasks;
    },
    refetchInterval: 10000,
    staleTime: 0, // Always fetch fresh data
  });

  const toggleExpand = (planId: string) => {
    setExpandedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (plans) {
      setExpandedPlans(new Set(plans.map(p => p.id)));
    }
  };

  const collapseAll = () => {
    setExpandedPlans(new Set());
  };

  // Filter plans
  const filteredPlans = plans?.filter((plan: ActionPlan) => {
    const matchesFilter = filter === 'all' || plan.status === filter;
    const matchesSearch = searchQuery === '' || 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const stats = {
    total: plans?.length || 0,
    active: plans?.filter((p: ActionPlan) => p.status === 'active' || p.status === 'in_progress').length || 0,
    completed: plans?.filter((p: ActionPlan) => p.status === 'completed').length || 0,
    totalTasks: plans?.reduce((acc: number, p: ActionPlan) => acc + (p.tasks?.length || 0), 0) || 0,
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading action plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Plans</h2>
            <p className="text-gray-600 mb-6">Failed to fetch action plans. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              <span>🔄</span>
              <span>Retry</span>
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📋</span>
              <h1 className="text-3xl md:text-4xl font-bold">Action Plans</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-lg transition-colors"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                href="/issues/submit"
                className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                <span>+</span>
                <span>New Issue</span>
              </Link>
            </div>
          </div>
          <p className="text-green-100 text-lg max-w-2xl mb-8">
            AI-generated action plans with assigned volunteers. Each plan breaks down complex issues into manageable tasks.
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`text-left rounded-xl p-4 transition-all ${filter === 'all' ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-green-100 text-sm">Total Plans</div>
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`text-left rounded-xl p-4 transition-all ${filter === 'active' ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="text-3xl font-bold">{stats.active}</div>
              <div className="text-green-100 text-sm">Active</div>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`text-left rounded-xl p-4 transition-all ${filter === 'completed' ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="text-3xl font-bold">{stats.completed}</div>
              <div className="text-green-100 text-sm">Completed</div>
            </button>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold">{stats.totalTasks}</div>
              <div className="text-green-100 text-sm">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              {['all', 'active', 'in_progress', 'completed', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Expand/Collapse */}
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredPlans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery || filter !== 'all' ? 'No Matching Plans' : 'No Action Plans Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Action plans are created when issues are analyzed by our AI agents.'}
            </p>
            <div className="flex items-center justify-center gap-4">
              {(searchQuery || filter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setFilter('all'); }}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
                >
                  <span>Clear Filters</span>
                </button>
              )}
              <Link
                href="/issues"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <span>View Issues</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 mb-2">
              Showing {filteredPlans.length} of {plans?.length || 0} plans
            </div>
            
            {filteredPlans.map((plan: ActionPlan, index: number) => {
              const status = statusConfig[plan.status] || statusConfig.draft;
              const completedTasks = plan.tasks?.filter((t: Task) => t.status === 'completed').length || 0;
              const totalTasks = plan.tasks?.length || 0;
              const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
              const isExpanded = expandedPlans.has(plan.id);
              
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-300 animate-slide-up ${status.borderColor}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Plan Header - Clickable */}
                  <button
                    onClick={() => toggleExpand(plan.id)}
                    className="w-full text-left bg-gradient-to-r from-green-50 to-teal-50 p-5 border-b border-gray-100 hover:from-green-100 hover:to-teal-100 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                            {status.icon} {plan.status.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(plan.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{plan.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-1">{plan.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Progress */}
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {completedTasks}/{totalTasks} tasks
                          </div>
                        </div>
                        
                        {/* Expand Icon */}
                        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <span>▼</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-5 animate-slide-up">
                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <Link
                          href={`/issues/${plan.issue_id}`}
                          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                          <span>📍</span>
                          <span>View Issue</span>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>👥</span>
                          <span>{plan.assigned_volunteers || 0} / {plan.required_volunteers || 0} volunteers assigned</span>
                        </div>
                        {plan.estimated_duration_days && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>📅</span>
                            <span>{plan.estimated_duration_days} days estimated</span>
                          </div>
                        )}
                      </div>

                      {/* Tasks Section */}
                      {plan.tasks && plan.tasks.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            Tasks ({plan.tasks.length})
                          </h4>
                          <div className="space-y-3">
                            {plan.tasks.map((task: Task, taskIndex: number) => {
                              const taskStatus = taskStatusConfig[task.status] || taskStatusConfig.pending;
                              return (
                                <div
                                  key={task.id}
                                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                >
                                  {/* Task Number & Priority */}
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${priorityColors[task.priority - 1] || priorityColors[0]}`}>
                                      {taskIndex + 1}
                                    </div>
                                    <span className="text-xs text-gray-400">P{task.priority}</span>
                                  </div>

                                  {/* Task Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-semibold text-gray-800">{task.title || task.name}</h5>
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${taskStatus.bg} ${taskStatus.color}`}>
                                        {taskStatus.icon} {task.status.replace('_', ' ')}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{task.description}</p>
                                  </div>

                                  {/* Assigned Volunteer */}
                                  {task.assigned_volunteer ? (
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                                        {task.assigned_volunteer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-800">{task.assigned_volunteer.name}</div>
                                        <div className="text-xs text-gray-500">
                                          {task.assigned_volunteer.skills?.slice(0, 2).join(', ')}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                                      <span className="text-yellow-600">⏳</span>
                                      <span className="text-sm text-yellow-700">Awaiting volunteer</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl block mb-2">📝</span>
                          <p>No tasks created yet - AI is still processing</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
