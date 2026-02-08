'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ClipboardList, Filter, ArrowRight, User, CheckCircle, Clock } from 'lucide-react';

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
  draft: { color: 'text-slate-600', bg: 'bg-slate-100', icon: '📝', borderColor: 'border-slate-200' },
  active: { color: 'text-sky-600', bg: 'bg-sky-100', icon: '🚀', borderColor: 'border-sky-200' },
  in_progress: { color: 'text-amber-600', bg: 'bg-amber-100', icon: '⚡', borderColor: 'border-amber-200' },
  completed: { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: '✅', borderColor: 'border-emerald-200' },
};

const taskStatusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  pending: { color: 'text-slate-500', bg: 'bg-slate-50', icon: '⏳' },
  in_progress: { color: 'text-amber-600', bg: 'bg-amber-50', icon: '🔄' },
  completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
};

const priorityColors = ['bg-emerald-500', 'bg-amber-500', 'bg-orange-500', 'bg-rose-500', 'bg-rose-600'];

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-20">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium">Loading action plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center pt-40 px-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-rose-900 mb-2">Error Loading Plans</h2>
            <p className="text-rose-700 mb-6">Failed to connect to the database. Please try again later.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors"
            >
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <ClipboardList size={16} className="text-emerald-500" />
                <span>Strategic Operations</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                AI Generated <span className="text-emerald-400">Action Plans</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Turning issues into structured tasks. Watch as our agents break down complex problems and assign them to capable volunteers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur px-5 py-3 rounded-xl transition-colors border border-white/10 font-medium"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
              <Link
                href="/issues/submit"
                className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors shadow-lg hover:shadow-emerald-500/30"
              >
                <span>+</span>
                <span>New Issue</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`text-left rounded-2xl p-5 border transition-all ${filter === 'all' ? 'bg-white/10 border-emerald-500/50 ring-2 ring-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-slate-400 text-sm font-medium">Total Plans</div>
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`text-left rounded-2xl p-5 border transition-all ${filter === 'active' ? 'bg-white/10 border-emerald-500/50 ring-2 ring-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="text-3xl font-bold text-white mb-1">{stats.active}</div>
              <div className="text-slate-400 text-sm font-medium">Active</div>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`text-left rounded-2xl p-5 border transition-all ${filter === 'completed' ? 'bg-white/10 border-emerald-500/50 ring-2 ring-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.completed}</div>
              <div className="text-slate-400 text-sm font-medium">Completed</div>
            </button>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalTasks}</div>
              <div className="text-slate-400 text-sm font-medium">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 -mt-20 relative z-10 mx-4 lg:mx-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-600 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['all', 'active', 'in_progress', 'completed', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                      ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Expand/Collapse */}
            <div className="flex items-center gap-2 hidden sm:flex">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardList className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {searchQuery || filter !== 'all' ? 'No Matching Plans' : 'No Action Plans Yet'}
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Action plans are created when issues are analyzed by our AI agents.'}
              </p>
              <div className="flex items-center justify-center gap-4">
                {(searchQuery || filter !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setFilter('all'); }}
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-all"
                  >
                    <span>Clear Filters</span>
                  </button>
                )}
                <Link
                  href="/issues"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  <span>View Issues</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-slate-500 px-2">
                Showing {filteredPlans.length} of {plans?.length || 0} plans
              </div>

              {filteredPlans.map((plan: ActionPlan) => {
                const status = statusConfig[plan.status] || statusConfig.draft;
                const completedTasks = plan.tasks?.filter((t: Task) => t.status === 'completed').length || 0;
                const totalTasks = plan.tasks?.length || 0;
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                const isExpanded = expandedPlans.has(plan.id);

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-emerald-500/20 border-emerald-500/40 shadow-xl' : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'}`}
                  >
                    {/* Plan Header - Clickable */}
                    <button
                      onClick={() => toggleExpand(plan.id)}
                      className="w-full text-left bg-gradient-to-r from-white to-slate-50 p-6 border-b border-slate-100 hover:from-slate-50 hover:to-slate-100 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${status.bg} ${status.color} ${status.borderColor}`}>
                              {status.icon} {plan.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(plan.created_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2 truncate leading-tight">{plan.title}</h3>
                          <p className="text-slate-600 text-sm line-clamp-1">{plan.description}</p>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Progress */}
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-slate-700 w-12 text-right">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-medium">
                              {completedTasks}/{totalTasks} tasks complete
                            </div>
                          </div>

                          {/* Expand Icon */}
                          <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 text-slate-400 ${isExpanded ? 'rotate-180 bg-emerald-100 text-emerald-600' : ''}`}>
                            <ArrowRight size={20} className="rotate-90" />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-6 bg-slate-50/50">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                          <Link
                            href={`/issues/${plan.issue_id}`}
                            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-700 transition-all shadow-sm"
                          >
                            <span>📍</span>
                            <span>View Original Issue</span>
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
                            <User size={16} />
                            <span>{plan.assigned_volunteers || 0} / {plan.required_volunteers || 0} volunteers assigned</span>
                          </div>
                          {plan.estimated_duration_days && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
                              <Clock size={16} />
                              <span>{plan.estimated_duration_days} days estimated</span>
                            </div>
                          )}
                        </div>

                        {/* Tasks Section */}
                        {plan.tasks && plan.tasks.length > 0 ? (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <ClipboardList size={14} />
                              Tasks Checklist
                            </h4>
                            <div className="space-y-3">
                              {plan.tasks.map((task: Task, taskIndex: number) => {
                                const taskStatus = taskStatusConfig[task.status] || taskStatusConfig.pending;
                                return (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                                  >
                                    {/* Task Number & Priority */}
                                    <div className="flex flex-col items-center gap-1 min-w-[32px]">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${priorityColors[task.priority - 1] || priorityColors[0]}`}>
                                        {taskIndex + 1}
                                      </div>
                                    </div>

                                    {/* Task Content */}
                                    <div className="flex-1 min-w-0 pt-1">
                                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <h5 className="font-bold text-slate-800 text-sm md:text-base">{task.title || task.name}</h5>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-transparent ${taskStatus.bg} ${taskStatus.color}`}>
                                          {taskStatus.icon} {task.status.replace('_', ' ')}
                                        </span>
                                      </div>
                                      <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
                                    </div>

                                    {/* Assigned Volunteer */}
                                    {task.assigned_volunteer ? (
                                      <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 min-w-[140px]">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                          {task.assigned_volunteer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-bold text-slate-700 truncate">{task.assigned_volunteer.name}</div>
                                          <div className="text-[10px] text-slate-500 truncate">
                                            {task.assigned_volunteer.skills?.slice(0, 1).join(', ')}
                                          </div>
                                        </div>
                                        <CheckCircle size={14} className="text-emerald-500" />
                                      </div>
                                    ) : (
                                      <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 text-amber-700 min-w-[140px] justify-center">
                                        <span className="text-xs font-bold">Awaiting Volunteer</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                              <ClipboardList size={24} />
                            </div>
                            <p className="text-slate-500 font-medium">No tasks created yet</p>
                            <p className="text-slate-400 text-sm">AI analysis in progress...</p>
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
    </div>
  );
}
