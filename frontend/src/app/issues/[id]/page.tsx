'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { issuesApi, plansApi } from '@/lib/api';
import { Users, Clock, CheckCircle, Brain, MapPin, Calendar, ArrowLeft, Target, Shield, Zap, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  pending: { color: 'text-slate-600', bg: 'bg-slate-100', icon: Clock },
  planning: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Brain },
  in_progress: { color: 'text-amber-600', bg: 'bg-amber-100', icon: Zap },
  completed: { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
  verified: { color: 'text-teal-600', bg: 'bg-teal-100', icon: Shield },
};

const categoryConfig: Record<string, { color: string; bg: string; icon: string; gradient: string }> = {
  environment: { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🌱', gradient: 'from-emerald-600 to-teal-500' },
  safety: { color: 'text-rose-700', bg: 'bg-rose-100', icon: '⚠️', gradient: 'from-rose-500 to-pink-600' },
  social: { color: 'text-purple-700', bg: 'bg-purple-100', icon: '👥', gradient: 'from-purple-500 to-indigo-600' },
  infrastructure: { color: 'text-amber-700', bg: 'bg-amber-100', icon: '🏗️', gradient: 'from-amber-500 to-orange-600' },
  civic: { color: 'text-blue-700', bg: 'bg-blue-100', icon: '🏛️', gradient: 'from-blue-500 to-cyan-600' },
};

const priorityColors = ['bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-rose-600'];

export default function IssueDetailPage() {
  const params = useParams();
  const issueId = params.id as string;

  const { data: issue, isLoading: issueLoading, error: issueError } = useQuery({
    queryKey: ['issue', issueId],
    queryFn: () => issuesApi.getById(issueId),
    refetchInterval: 5000,
  });

  const { data: actionPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['plans', issueId],
    queryFn: () => plansApi.getAll(50),
    enabled: !!issue,
    refetchInterval: 5000,
  });

  const actionPlan = actionPlans.find((plan: any) => plan.issue_id === issueId);

  const { data: tasksResponse, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', actionPlan?.id],
    queryFn: () => plansApi.getTasks(actionPlan!.id),
    enabled: !!actionPlan?.id,
    refetchInterval: 5000,
  });

  // Handle both array response and {tasks: []} object response
  const tasksData = Array.isArray(tasksResponse) ? tasksResponse : (tasksResponse?.tasks || []);

  if (issueLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600 font-medium'>Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (issueError || !issue) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='text-center max-w-md p-8 bg-white rounded-2xl shadow-sm'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>Issue Not Found</h2>
          <p className='text-slate-600 mb-6'>The issue you are looking for does not exist.</p>
          <Link href='/issues' className='inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors'>
            <ArrowLeft size={18} />
            <span>Back to Issues</span>
          </Link>
        </div>
      </div>
    );
  }

  const discoveryAnalysis = issue.metadata?.discovery_analysis || {};
  const category = categoryConfig[issue.category] || categoryConfig.civic;
  const status = statusConfig[issue.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const hasDiscovery = Object.keys(discoveryAnalysis).length > 0;

  return (
    <div className='min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900'>
      <Navbar />

      {/* Hero Section */}
      <div className={`relative pt-32 pb-24 overflow-hidden bg-gradient-to-br ${category.gradient}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <Link href='/issues' className='inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group'>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Issues</span>
          </Link>

          <div className='flex flex-wrap items-start gap-4 mb-6 animate-fade-in'>
            <span className='px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold text-white flex items-center gap-2 border border-white/10 shadow-sm'>
              <span>{category.icon}</span>
              <span className="capitalize">{issue.category}</span>
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 bg-white text-slate-900 shadow-sm`}>
              <StatusIcon size={14} className={status.color.replace('text-', 'text-')} />
              <span className="capitalize">{issue.status.replace('_', ' ')}</span>
            </span>
          </div>

          <h1 className='text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl animate-slide-up'>{issue.title}</h1>
          <p className='text-white/90 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed animate-slide-up' style={{ animationDelay: '0.1s' }}>{issue.description}</p>

          <div className='flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium animate-slide-up' style={{ animationDelay: '0.2s' }}>
            {issue.location?.address && (
              <div className='flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm'>
                <MapPin size={18} />
                <span>{issue.location.address}</span>
              </div>
            )}
            <div className='flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm'>
              <Calendar size={18} />
              <span>{new Date(issue.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Agent Activity Flow */}
        <div className='mb-16 -mt-24 relative z-20'>
          <h2 className="sr-only">Agent Workflow</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            {/* Discovery Agent */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 border transition-all duration-300 ${hasDiscovery ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-100'}`}>
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${hasDiscovery ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600 animate-pulse'}`}>
                  {hasDiscovery ? <CheckCircle size={24} /> : <Brain size={24} />}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${hasDiscovery ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'}`}>
                  Step 1
                </div>
              </div>
              <h3 className='font-bold text-slate-900 text-lg mb-1'>Discovery Agent</h3>
              <p className={`text-sm font-medium mb-3 ${hasDiscovery ? 'text-emerald-600' : 'text-purple-600'}`}>
                {hasDiscovery ? 'Analysis Complete' : 'Analyzing Context...'}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Analyzes the issue using AI to determine urgency, scope, and resource requirements.
              </p>
            </div>

            {/* Planning Agent */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 border transition-all duration-300 ${actionPlan ? 'border-emerald-500 ring-1 ring-emerald-500/20' : hasDiscovery ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-100 opacity-60'}`}>
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${actionPlan ? 'bg-emerald-100 text-emerald-600' : hasDiscovery ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                  {actionPlan ? <CheckCircle size={24} /> : hasDiscovery ? <Target size={24} /> : <Clock size={24} />}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${actionPlan ? 'bg-emerald-50 text-emerald-700' : hasDiscovery ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  Step 2
                </div>
              </div>
              <h3 className='font-bold text-slate-900 text-lg mb-1'>Planning Agent</h3>
              <p className={`text-sm font-medium mb-3 ${actionPlan ? 'text-emerald-600' : hasDiscovery ? 'text-blue-600' : 'text-slate-500'}`}>
                {actionPlan ? 'Plan Created' : hasDiscovery ? 'Generating Tasks...' : 'Waiting'}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Breaks down the solution into actionable tasks and estimates volunteer needs.
              </p>
            </div>

            {/* Matching Agent */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 border transition-all duration-300 ${((actionPlan?.assigned_volunteers || 0) > 0) ? 'border-emerald-500 ring-1 ring-emerald-500/20' : actionPlan ? 'border-amber-500 ring-1 ring-amber-500/20' : 'border-slate-100 opacity-60'}`}>
              <div className='flex items-start justify-between mb-4'>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${((actionPlan?.assigned_volunteers || 0) > 0) ? 'bg-emerald-100 text-emerald-600' : actionPlan ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                  {((actionPlan?.assigned_volunteers || 0) > 0) ? <CheckCircle size={24} /> : actionPlan ? <Users size={24} /> : <Clock size={24} />}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${((actionPlan?.assigned_volunteers || 0) > 0) ? 'bg-emerald-50 text-emerald-700' : actionPlan ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  Step 3
                </div>
              </div>
              <h3 className='font-bold text-slate-900 text-lg mb-1'>Matching Agent</h3>
              <p className={`text-sm font-medium mb-3 ${((actionPlan?.assigned_volunteers || 0) > 0) ? 'text-emerald-600' : actionPlan ? 'text-amber-600' : 'text-slate-500'}`}>
                {((actionPlan?.assigned_volunteers || 0) > 0) ? `${actionPlan?.assigned_volunteers} Assigned` : actionPlan ? 'Matching Volunteers...' : 'Waiting'}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Identifies and notifies the best-suited local volunteers for each task.
              </p>
            </div>
          </div>
        </div>

        {/* Discovery Analysis */}
        {hasDiscovery && (
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 animate-fade-in'>
            <div className='bg-slate-50/50 p-6 border-b border-slate-200 flex items-center gap-3'>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Brain className="text-purple-600" size={24} />
              </div>
              <h2 className='text-xl font-bold text-slate-900'>AI Discovery Analysis</h2>
            </div>
            <div className='p-6 md:p-8'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                {discoveryAnalysis.urgency && (
                  <div className='bg-slate-50 rounded-xl p-4 text-center border border-slate-100'>
                    <div className='text-2xl mb-2'>⚡</div>
                    <div className='text-xs text-slate-500 uppercase font-bold tracking-wider mb-1'>Urgency</div>
                    <div className='font-bold text-slate-900 capitalize text-lg'>{discoveryAnalysis.urgency}</div>
                  </div>
                )}
                {discoveryAnalysis.estimated_scope && (
                  <div className='bg-slate-50 rounded-xl p-4 text-center border border-slate-100'>
                    <div className='text-2xl mb-2'>📏</div>
                    <div className='text-xs text-slate-500 uppercase font-bold tracking-wider mb-1'>Scope</div>
                    <div className='font-bold text-slate-900 capitalize text-lg'>{discoveryAnalysis.estimated_scope}</div>
                  </div>
                )}
                {discoveryAnalysis.estimated_duration_days && (
                  <div className='bg-slate-50 rounded-xl p-4 text-center border border-slate-100'>
                    <div className='text-2xl mb-2'>📅</div>
                    <div className='text-xs text-slate-500 uppercase font-bold tracking-wider mb-1'>Duration</div>
                    <div className='font-bold text-slate-900 text-lg'>{discoveryAnalysis.estimated_duration_days} days</div>
                  </div>
                )}
                {discoveryAnalysis.estimated_volunteers_needed && (
                  <div className='bg-slate-50 rounded-xl p-4 text-center border border-slate-100'>
                    <div className='text-2xl mb-2'>👥</div>
                    <div className='text-xs text-slate-500 uppercase font-bold tracking-wider mb-1'>Volunteers</div>
                    <div className='font-bold text-slate-900 text-lg'>{discoveryAnalysis.estimated_volunteers_needed} needed</div>
                  </div>
                )}
              </div>

              {discoveryAnalysis.reasoning && (
                <div className='bg-blue-50/50 rounded-xl p-6 border border-blue-100 mb-6'>
                  <h4 className='font-bold text-blue-900 mb-2 flex items-center gap-2'>
                    <Info size={18} /> AI Reasoning
                  </h4>
                  <p className='text-blue-800 leading-relaxed'>{discoveryAnalysis.reasoning}</p>
                </div>
              )}

              {discoveryAnalysis.tags && Array.isArray(discoveryAnalysis.tags) && discoveryAnalysis.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {discoveryAnalysis.tags.map((tag: string, idx: number) => (
                    <span key={idx} className='px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors cursor-default'>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Plan & Tasks */}
        {actionPlan && (
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12 animate-fade-in'>
            <div className='bg-slate-50/50 p-6 border-b border-slate-200'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Target className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h2 className='text-xl font-bold text-slate-900'>Action Plan</h2>
                    <p className='text-slate-500 text-sm'>{actionPlan.title}</p>
                  </div>
                </div>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold items-center gap-2 ${statusConfig[actionPlan.status]?.bg} ${statusConfig[actionPlan.status]?.color}`}>
                  {statusConfig[actionPlan.status]?.icon && <ActionStatusIcon icon={statusConfig[actionPlan.status].icon} size={16} />}
                  <span className="capitalize">{actionPlan.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>

            <div className='p-6 md:p-8'>
              <p className='text-slate-700 mb-8 leading-relaxed text-lg'>{actionPlan.description}</p>

              {/* Volunteer Progress */}
              <div className='mb-10 bg-slate-50 rounded-xl p-6 border border-slate-100'>
                <div className='flex items-center justify-between text-sm mb-3'>
                  <span className='font-bold text-slate-700 flex items-center gap-2'>
                    <Users size={16} className="text-slate-400" /> Volunteer Coverage
                  </span>
                  <span className='font-bold text-slate-900 bg-white px-3 py-1 rounded shadow-sm'>
                    {actionPlan.assigned_volunteers || 0} <span className="text-slate-400 font-normal">/</span> {actionPlan.required_volunteers || 0}
                  </span>
                </div>
                <div className='h-4 bg-slate-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out relative'
                    style={{ width: `${actionPlan.required_volunteers > 0 ? Math.min((actionPlan.assigned_volunteers / actionPlan.required_volunteers) * 100, 100) : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              {tasksLoading ? (
                <div className='text-center py-12'>
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mb-4" />
                  <p className='text-slate-500'>Loading tasks...</p>
                </div>
              ) : tasksData.length > 0 ? (
                <div>
                  <h4 className='text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2'>
                    <span>Action Items</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{tasksData.length}</span>
                  </h4>
                  <div className='space-y-4'>
                    {tasksData.map((task: any, idx: number) => (
                      <div key={task.id} className='group flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all duration-300'>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm ${priorityColors[(task.priority || 1) - 1] || priorityColors[0]}`}>
                          {idx + 1}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className="flex justify-between items-start mb-1">
                            <h5 className='font-bold text-slate-900 group-hover:text-emerald-700 transition-colors'>{task.name}</h5>
                            <div className='flex flex-col items-end gap-2'>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                task.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                                  task.assigned_count > 0 ? 'bg-teal-100 text-teal-700' :
                                    'bg-slate-100 text-slate-600'}`}>
                                {task.status === 'completed' ? <CheckCircle size={12} /> :
                                  task.status === 'in_progress' ? <Zap size={12} /> :
                                    ''}
                                <span className="capitalize">
                                  {task.status === 'completed' ? 'Completed' :
                                    task.status === 'in_progress' ? 'In Progress' :
                                      task.assigned_count > 0 ? `${task.assigned_count} Assigned` :
                                        'Pending'}
                                </span>
                              </span>
                            </div>
                          </div>

                          {task.description && (
                            <p className='text-slate-600 text-sm mb-4 leading-relaxed'>{task.description}</p>
                          )}

                          {/* Assigned Volunteers */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            {task.assigned_volunteers && task.assigned_volunteers.length > 0 ? (
                              <div className='flex -space-x-2'>
                                {task.assigned_volunteers.map((assignment: any) => (
                                  <div key={assignment.assignment_id} className="relative group/avatar" title={assignment.volunteer?.name}>
                                    <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ${assignment.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-400'
                                      }`}>
                                      {assignment.volunteer?.name?.charAt(0) || '?'}
                                    </div>
                                  </div>
                                ))}
                                {task.assigned_volunteers.length > 5 && (
                                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                                    +{task.assigned_volunteers.length - 5}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">No volunteers assigned yet</span>
                            )}

                            {task.required_people && (
                              <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                <Users size={14} className="text-slate-400" />
                                {task.assigned_count || 0} / {task.required_people}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200'>
                  <Target size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No tasks created yet for this plan.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading States */}
        {!plansLoading && !actionPlan && !hasDiscovery && issue.status === 'pending' && (
          <div className='bg-white rounded-2xl p-12 text-center shadow-lg border border-purple-100'>
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
            <h3 className='text-2xl font-bold text-slate-900 mb-3'>AI Agents are Analyzing</h3>
            <p className='text-slate-600 max-w-lg mx-auto'>Our intelligent agents are working on understanding this issue, checking feasibility, and creating a comprehensive action plan.</p>
          </div>
        )}

        {!plansLoading && !actionPlan && hasDiscovery && (
          <div className='bg-white rounded-2xl p-12 text-center shadow-lg border border-blue-100'>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h3 className='text-2xl font-bold text-slate-900 mb-3'>Discovery Complete!</h3>
            <p className='text-slate-600 max-w-lg mx-auto'>The Planning Agent is now structuring the solution and generating specific tasks for volunteers.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// Helper component for dynamic icon rendering
function ActionStatusIcon({ icon: Icon, size }: { icon: any, size: number }) {
  return <Icon size={size} />;
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
