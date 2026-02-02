'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { issuesApi, plansApi } from '@/lib/api';
import { Users } from 'lucide-react';

const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  pending: { color: 'text-gray-700', bg: 'bg-gray-100', icon: '⏳' },
  planning: { color: 'text-blue-700', bg: 'bg-blue-100', icon: '📋' },
  in_progress: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: '⚙️' },
  completed: { color: 'text-green-700', bg: 'bg-green-100', icon: '✅' },
  verified: { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '✓' },
};

const categoryConfig: Record<string, { color: string; bg: string; icon: string; gradient: string }> = {
  environment: { color: 'text-green-700', bg: 'bg-green-100', icon: '🌱', gradient: 'from-green-500 to-emerald-600' },
  safety: { color: 'text-red-700', bg: 'bg-red-100', icon: '⚠️', gradient: 'from-red-500 to-rose-600' },
  social: { color: 'text-purple-700', bg: 'bg-purple-100', icon: '👥', gradient: 'from-purple-500 to-violet-600' },
  infrastructure: { color: 'text-orange-700', bg: 'bg-orange-100', icon: '🏗️', gradient: 'from-orange-500 to-amber-600' },
  civic: { color: 'text-blue-700', bg: 'bg-blue-100', icon: '🏛️', gradient: 'from-blue-500 to-indigo-600' },
};

const priorityColors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-red-600'];

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
  console.log('Tasks response:', tasksResponse);
  console.log('Tasks data:', tasksData);
  console.log('First task details:', tasksData[0]);
  console.log('First task assigned_volunteers:', tasksData[0]?.assigned_volunteers);
  console.log('First task assigned_count:', tasksData[0]?.assigned_count);

  if (issueLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (issueError || !issue) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50'>
        <div className='text-center max-w-md'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>Issue Not Found</h2>
          <p className='text-gray-600 mb-6'>The issue you are looking for does not exist.</p>
          <Link href='/issues' className='inline-flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors'>
            <span>← Back to Issues</span>
          </Link>
        </div>
      </div>
    );
  }

  const discoveryAnalysis = issue.metadata?.discovery_analysis || {};
  const category = categoryConfig[issue.category] || categoryConfig.civic;
  const status = statusConfig[issue.status] || statusConfig.pending;
  const hasDiscovery = Object.keys(discoveryAnalysis).length > 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50'>
      {/* Hero Section */}
      <div className={'bg-gradient-to-r ' + category.gradient + ' text-white'}>
        <div className='max-w-5xl mx-auto px-4 py-12'>
          <Link href='/issues' className='inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors'>
            <span>← Back to Issues</span>
          </Link>
          
          <div className='flex flex-wrap items-start gap-3 mb-4'>
            <span className='px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium'>
              {category.icon} {issue.category}
            </span>
            <span className={'px-3 py-1 rounded-full text-sm font-medium ' + status.bg + ' ' + status.color}>
              {status.icon} {issue.status.replace('_', ' ')}
            </span>
          </div>
          
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>{issue.title}</h1>
          <p className='text-white/90 text-lg max-w-3xl mb-6'>{issue.description}</p>
          
          <div className='flex flex-wrap items-center gap-6 text-white/80 text-sm'>
            {issue.location?.address && (
              <div className='flex items-center gap-2'>
                <span>📍</span>
                <span>{issue.location.address}</span>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <span>📅</span>
              <span>{new Date(issue.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-8'>
        {/* Agent Status Cards */}
        <div className='grid md:grid-cols-3 gap-4 mb-8 -mt-16 relative z-10'>
          {/* Discovery Agent */}
          <div className={'bg-white rounded-xl shadow-lg p-5 border-t-4 ' + (hasDiscovery ? 'border-green-500' : 'border-purple-500')}>
            <div className='flex items-center gap-3 mb-3'>
              <div className={'w-10 h-10 rounded-full flex items-center justify-center text-xl ' + (hasDiscovery ? 'bg-green-100' : 'bg-purple-100 animate-pulse')}>
                {hasDiscovery ? '✅' : '🔍'}
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Discovery Agent</h3>
                <p className={'text-sm ' + (hasDiscovery ? 'text-green-600' : 'text-purple-600')}>
                  {hasDiscovery ? 'Complete' : 'Analyzing...'}
                </p>
              </div>
            </div>
          </div>

          {/* Planning Agent */}
          <div className={'bg-white rounded-xl shadow-lg p-5 border-t-4 ' + (actionPlan ? 'border-green-500' : hasDiscovery ? 'border-blue-500' : 'border-gray-300')}>
            <div className='flex items-center gap-3 mb-3'>
              <div className={'w-10 h-10 rounded-full flex items-center justify-center text-xl ' + (actionPlan ? 'bg-green-100' : hasDiscovery ? 'bg-blue-100 animate-pulse' : 'bg-gray-100')}>
                {actionPlan ? '✅' : hasDiscovery ? '📋' : '⏳'}
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Planning Agent</h3>
                <p className={'text-sm ' + (actionPlan ? 'text-green-600' : hasDiscovery ? 'text-blue-600' : 'text-gray-500')}>
                  {actionPlan ? 'Complete' : hasDiscovery ? 'Creating plan...' : 'Waiting'}
                </p>
              </div>
            </div>
          </div>

          {/* Matching Agent */}
          <div className={'bg-white rounded-xl shadow-lg p-5 border-t-4 ' + ((actionPlan?.assigned_volunteers || 0) > 0 ? 'border-green-500' : actionPlan ? 'border-teal-500' : 'border-gray-300')}>
            <div className='flex items-center gap-3 mb-3'>
              <div className={'w-10 h-10 rounded-full flex items-center justify-center text-xl ' + ((actionPlan?.assigned_volunteers || 0) > 0 ? 'bg-green-100' : actionPlan ? 'bg-teal-100 animate-pulse' : 'bg-gray-100')}>
                {(actionPlan?.assigned_volunteers || 0) > 0 ? '✅' : actionPlan ? '👥' : '⏳'}
              </div>
              <div>
                <h3 className='font-semibold text-gray-800'>Matching Agent</h3>
                <p className={'text-sm ' + ((actionPlan?.assigned_volunteers || 0) > 0 ? 'text-green-600' : actionPlan ? 'text-teal-600' : 'text-gray-500')}>
                  {(actionPlan?.assigned_volunteers || 0) > 0 ? `${actionPlan?.assigned_volunteers} Assigned` : actionPlan ? 'Finding matches...' : 'Waiting'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discovery Analysis */}
        {hasDiscovery && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8'>
            <div className='bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-800'>🔍 AI Discovery Analysis</h2>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                {discoveryAnalysis.urgency && (
                  <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className='text-2xl mb-1'>⚡</div>
                    <div className='text-sm text-gray-500'>Urgency</div>
                    <div className='font-bold text-gray-800 capitalize'>{discoveryAnalysis.urgency}</div>
                  </div>
                )}
                {discoveryAnalysis.estimated_scope && (
                  <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className='text-2xl mb-1'>📏</div>
                    <div className='text-sm text-gray-500'>Scope</div>
                    <div className='font-bold text-gray-800 capitalize'>{discoveryAnalysis.estimated_scope}</div>
                  </div>
                )}
                {discoveryAnalysis.estimated_duration_days && (
                  <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className='text-2xl mb-1'>📅</div>
                    <div className='text-sm text-gray-500'>Duration</div>
                    <div className='font-bold text-gray-800'>{discoveryAnalysis.estimated_duration_days} days</div>
                  </div>
                )}
                {discoveryAnalysis.estimated_volunteers_needed && (
                  <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className='text-2xl mb-1'>👥</div>
                    <div className='text-sm text-gray-500'>Volunteers</div>
                    <div className='font-bold text-gray-800'>{discoveryAnalysis.estimated_volunteers_needed} needed</div>
                  </div>
                )}
              </div>
              {discoveryAnalysis.reasoning && (
                <div className='bg-blue-50 rounded-xl p-5 mb-4'>
                  <h4 className='font-semibold text-gray-800 mb-2'>💡 AI Reasoning</h4>
                  <p className='text-gray-700'>{discoveryAnalysis.reasoning}</p>
                </div>
              )}
              {discoveryAnalysis.tags && Array.isArray(discoveryAnalysis.tags) && discoveryAnalysis.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {discoveryAnalysis.tags.map((tag: string, idx: number) => (
                    <span key={idx} className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
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
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8'>
            <div className='bg-gradient-to-r from-green-50 to-teal-50 p-6 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-bold text-gray-800'>📋 Action Plan</h2>
                  <p className='text-gray-600 text-sm'>{actionPlan.title}</p>
                </div>
                <span className={'px-4 py-2 rounded-full text-sm font-medium ' + statusConfig[actionPlan.status]?.bg + ' ' + statusConfig[actionPlan.status]?.color}>
                  {statusConfig[actionPlan.status]?.icon} {actionPlan.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className='p-6'>
              <p className='text-gray-700 mb-6'>{actionPlan.description}</p>
              
              {/* Volunteer Progress */}
              <div className='mb-6'>
                <div className='flex items-center justify-between text-sm mb-2'>
                  <span className='text-gray-600'>Volunteer Assignment Progress</span>
                  <span className='font-semibold text-gray-800'>
                    {actionPlan.assigned_volunteers || 0} / {actionPlan.required_volunteers || 0}
                  </span>
                </div>
                <div className='h-3 bg-gray-100 rounded-full overflow-hidden'>
                  <div 
                    className='h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500' 
                    style={{ width: `${actionPlan.required_volunteers > 0 ? Math.min((actionPlan.assigned_volunteers / actionPlan.required_volunteers) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Tasks List */}
              {tasksLoading ? (
                <div className='text-center py-8'>
                  <div className='w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3'></div>
                  <p className='text-gray-500'>Loading tasks...</p>
                </div>
              ) : tasksData.length > 0 ? (
                <div>
                  <h4 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
                    Tasks ({tasksData.length})
                  </h4>
                  <div className='space-y-3'>
                    {tasksData.map((task: any, idx: number) => (
                      <div key={task.id} className='flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                        <div className={'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ' + (priorityColors[(task.priority || 1) - 1] || priorityColors[0])}>
                          {idx + 1}
                        </div>
                        
                        <div className='flex-1 min-w-0'>
                          <h5 className='font-semibold text-gray-800 mb-1'>{task.name}</h5>
                          {task.description && (
                            <p className='text-gray-600 text-sm mb-2'>{task.description}</p>
                          )}
                          
                          {/* Assigned Volunteers */}
                          {task.assigned_volunteers && task.assigned_volunteers.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-2'>
                              {task.assigned_volunteers.map((assignment: any) => {
                                const statusColor = 
                                  assignment.status === 'completed' ? 'border-green-500 bg-green-50' :
                                  assignment.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                                  'border-gray-200 bg-white';
                                const statusIcon = 
                                  assignment.status === 'completed' ? '✅' :
                                  assignment.status === 'in_progress' ? '⚙️' : '';
                                
                                return (
                                  <div key={assignment.assignment_id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${statusColor} transition-all`}>
                                    <div className='w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold'>
                                      {assignment.volunteer?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '?'}
                                    </div>
                                    <span className='text-sm font-medium text-gray-700'>
                                      {assignment.volunteer?.name || 'Unknown'}
                                    </span>
                                    {statusIcon && (
                                      <span className='text-xs ml-1'>{statusIcon}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className='flex flex-col items-end gap-2'>
                          <span className={'px-3 py-1 rounded-full text-xs font-medium ' + 
                            (task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                             task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                             task.assigned_count > 0 ? 'bg-teal-100 text-teal-700' :
                             'bg-gray-100 text-gray-600')}>
                            {task.status === 'completed' ? '✅ Completed' :
                             task.status === 'in_progress' ? '⚙️ In Progress' :
                             task.assigned_count > 0 ? `${task.assigned_count} assigned` : 
                             'pending'}
                          </span>
                          {task.required_people && (
                            <span className='text-xs text-gray-500'>
                              <Users size={12} className='inline mr-1' />
                              {task.assigned_count || 0}/{task.required_people} needed
                            </span>
                          )}
                          {/* Show active volunteers count */}
                          {task.assigned_volunteers && task.assigned_volunteers.some((a: any) => a.status === 'in_progress') && (
                            <span className='text-xs text-blue-600 font-medium'>
                              ⚙️ {task.assigned_volunteers.filter((a: any) => a.status === 'in_progress').length} working
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <span className='text-4xl block mb-2'>📋</span>
                  <p>No tasks created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading States */}
        {!plansLoading && !actionPlan && !hasDiscovery && issue.status === 'pending' && (
          <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center animate-pulse'>
            <div className='text-5xl mb-4'>🤖</div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>AI Agents are Analyzing</h3>
            <p className='text-gray-600'>Our intelligent agents are working on understanding this issue and creating an action plan.</p>
          </div>
        )}

        {!plansLoading && !actionPlan && hasDiscovery && (
          <div className='bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center'>
            <div className='text-5xl mb-4'>✅</div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>Discovery Complete!</h3>
            <p className='text-gray-600'>The Planning Agent is now creating an action plan with tasks...</p>
            <div className='w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mt-4'></div>
          </div>
        )}
      </div>
    </div>
  );
}
