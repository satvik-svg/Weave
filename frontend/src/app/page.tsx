'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Users, Target, CheckCircle, ArrowRight, Sparkles, Zap, Shield, Globe, ChevronRight, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { issuesApi, plansApi, volunteersApi } from '@/lib/api'

export default function Home() {
  // Fetch real stats
  const { data: issues = [] } = useQuery({
    queryKey: ['issues-home'],
    queryFn: () => issuesApi.getAll(100),
  })

  const { data: plans = [] } = useQuery({
    queryKey: ['plans-home'],
    queryFn: () => plansApi.getAll(100),
  })

  const { data: volunteers = [] } = useQuery({
    queryKey: ['volunteers-home'],
    queryFn: () => volunteersApi.getAll(100),
  })

  const stats = {
    issues: issues.length,
    plans: plans.length,
    volunteers: volunteers.length,
    completed: issues.filter((i: any) => i.status === 'completed' || i.status === 'verified').length
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-pattern">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                <span>AI-Powered Community Action</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Ideas Into
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Real Impact
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                WEAVE uses AI agents to turn community issues into coordinated action plans, 
                intelligently match volunteers, and verify real-world outcomes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/issues/submit"
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  <MapPin size={20} />
                  <span className="font-semibold">Report an Issue</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/issues"
                  className="group flex items-center justify-center space-x-2 bg-white text-gray-800 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
                >
                  <Play size={18} />
                  <span className="font-semibold">See It In Action</span>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.issues}</div>
                  <div className="text-sm text-gray-500">Issues Reported</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.volunteers}</div>
                  <div className="text-sm text-gray-500">Active Volunteers</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{stats.plans}</div>
                  <div className="text-sm text-gray-500">Action Plans</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Issue Resolved!</div>
                      <div className="text-sm text-gray-500">Park Cleanup Complete</div>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">12</div>
                      <div className="text-sm text-gray-500">Volunteers Participated</div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="text-purple-600" size={16} />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">AI Analysis</div>
                      <div className="text-green-500 text-xs">95% confidence</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-lg p-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="text-blue-600" size={16} />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Volunteers Matched</div>
                      <div className="text-blue-500 text-xs">5 people assigned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">How It Works</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Action Pipeline</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From identifying problems to verifying solutions, our AI agents handle every step.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                color: 'purple',
                title: 'Report Issues',
                description: 'Community members identify and report local problems with photos and location.',
                step: '01'
              },
              {
                icon: Sparkles,
                color: 'blue',
                title: 'AI Analysis',
                description: 'Discovery Agent analyzes urgency, scope, and requirements automatically.',
                step: '02'
              },
              {
                icon: Target,
                color: 'cyan',
                title: 'Smart Planning',
                description: 'Planning Agent creates detailed action plans with tasks and timelines.',
                step: '03'
              },
              {
                icon: Users,
                color: 'green',
                title: 'Auto Matching',
                description: 'Matching Agent assigns optimal volunteers based on skills & location.',
                step: '04'
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 h-full border border-transparent hover:border-gray-100">
                  <div className="absolute -top-4 -left-2 text-6xl font-bold text-gray-100 group-hover:text-purple-100 transition-colors">
                    {item.step}
                  </div>
                  <div className={`relative w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`text-${item.color}-600`} size={28} />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="text-gray-300" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">Live Activity</h2>
              <h3 className="text-3xl font-bold text-gray-900">Recent Community Actions</h3>
            </div>
            <Link 
              href="/issues" 
              className="group flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <span>View All Issues</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {issues.slice(0, 3).map((issue: any, index: number) => (
              <Link 
                key={issue.id} 
                href={`/issues/${issue.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    issue.category === 'environment' ? 'bg-green-100 text-green-700' :
                    issue.category === 'safety' ? 'bg-red-100 text-red-700' :
                    issue.category === 'social' ? 'bg-purple-100 text-purple-700' :
                    issue.category === 'infrastructure' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {issue.category}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    issue.status === 'completed' || issue.status === 'verified' ? 'bg-green-400' :
                    issue.status === 'in_progress' ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}></span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {issue.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{issue.location?.address || 'Location not specified'}</span>
                </div>
              </Link>
            ))}
            
            {issues.length === 0 && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="animate-pulse">
                      <div className="h-6 w-20 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-100 rounded mb-4"></div>
                      <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">Why WEAVE</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Built for Real Impact</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                <Zap className="text-purple-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Real-Time AI</h4>
              <p className="text-gray-600">
                Three specialized AI agents work together to analyze, plan, and coordinate in seconds.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                <Globe className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Location Smart</h4>
              <p className="text-gray-600">
                Volunteers are matched based on proximity, ensuring efficient local response.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-green-50 border border-cyan-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="text-cyan-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Verified Outcomes</h4>
              <p className="text-gray-600">
                Every completed action is verified with evidence and community validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join our growing community of changemakers. Report issues, volunteer for tasks, 
            and see real impact in your neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/issues/submit"
              className="group flex items-center justify-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              <Sparkles size={20} />
              <span>Report an Issue</span>
            </Link>
            <Link
              href="/volunteer"
              className="group flex items-center justify-center space-x-2 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/50 hover:bg-white/10 transition-all"
            >
              <Users size={20} />
              <span>Browse Volunteers</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
