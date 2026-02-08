'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Users, Target, CheckCircle, ArrowRight, Sparkles, Zap, Shield, Globe, ChevronRight, Play, Heart, Leaf } from 'lucide-react'
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
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left z-10">
              <div className="inline-flex items-center space-x-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm animate-fade-in">
                <Leaf size={16} />
                <span>Empowering Local Communities</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight animate-slide-up">
                Turn Compassion Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Real Action
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl animate-slide-up bg-white/50 backdrop-blur-sm rounded-lg p-2 lg:p-0" style={{ animationDelay: '0.1s' }}>
                Weave connects neighbors, volunteers, and local leaders to solve real-world problems.
                From cleanups to care packages, verify your impact with AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  href="/issues/submit"
                  className="group flex items-center justify-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <MapPin size={20} />
                  <span className="font-semibold text-lg">Take Action Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/issues"
                  className="group flex items-center justify-center space-x-3 bg-white text-slate-700 px-8 py-4 rounded-full border border-slate-200 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300 hover:shadow-md"
                >
                  <Play size={18} className="fill-current" />
                  <span className="font-semibold text-lg">Watch Demo</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Trusted by <span className="font-semibold text-slate-900">500+</span> changemakers worldwide</p>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Abstract Background Shapes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-100/50 to-teal-50/50 rounded-full blur-3xl -z-10"></div>

                {/* Main Card */}
                <div className="relative z-10">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-700 items-start">
                    {/* Floating Image Placeholder - Replace with actual image in production */}
                    <div className="h-64 bg-slate-100 rounded-2xl mb-6 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                        <Users className="text-emerald-200 w-24 h-24" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Community Park Rewrite</h3>
                        <p className="text-slate-500">Downtown District • 2 hrs ago</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                          <div className="bg-emerald-500 h-2 rounded-full w-3/4"></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>12/15 Volunteers</span>
                          <span>80% Goal</span>
                        </div>
                      </div>
                      <button className="bg-slate-900 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Impact Score</p>
                      <p className="text-xl font-bold text-slate-900">98.5</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Issues Solved</p>
                      <p className="text-xl font-bold text-slate-900">1,240+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-slate-800">
              {[
                { label: 'Active Issues', value: stats.issues, icon: MapPin },
                { label: 'Volunteers', value: stats.volunteers, icon: Users },
                { label: 'Action Plans', value: stats.plans, icon: Target },
                { label: 'Completed', value: stats.completed, icon: CheckCircle },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="inline-flex p-3 bg-slate-800 rounded-xl text-emerald-400 mb-4">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Clean Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">Our Process</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">From Problem to Solution</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our AI agents coordinate the complex logistics so you can focus on making a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            {[
              {
                icon: MapPin,
                title: 'Report',
                desc: 'Spot a problem? Snap a photo and drop a pin.',
                color: 'bg-rose-100 text-rose-600'
              },
              {
                icon: Sparkles,
                title: 'Analyze',
                desc: 'AI assesses urgency and resource needs instantly.',
                color: 'bg-amber-100 text-amber-600'
              },
              {
                icon: Users,
                title: 'Match',
                desc: 'We connect local volunteers with the right skills.',
                color: 'bg-emerald-100 text-emerald-600'
              },
              {
                icon: CheckCircle,
                title: 'Verify',
                desc: 'Complete the task and share photo proof of impact.',
                color: 'bg-blue-100 text-blue-600'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative group bg-white pt-4">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 text-center mb-3">{step.title}</h4>
                <p className="text-slate-600 text-center leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Live Needs Near You</h2>
              <p className="text-slate-600 text-lg">Real-time opportunities to make an impact right now.</p>
            </div>
            <Link
              href="/issues"
              className="group flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700"
            >
              <span>View All Issues</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {issues.slice(0, 3).map((issue: any) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-100 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${issue.category === 'environment' ? 'bg-emerald-100 text-emerald-700' :
                      issue.category === 'safety' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                    {issue.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">2h ago</span>
                </div>

                <h4 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {issue.title}
                </h4>

                <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">{issue.description}</p>

                <div className="flex items-center text-sm text-slate-500 border-t border-slate-100 pt-4">
                  <MapPin size={16} className="mr-2 text-slate-400" />
                  <span className="truncate">{issue.location?.address || 'Location Hidden'}</span>
                </div>
              </Link>
            ))}

            {issues.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-64 flex flex-col justify-between animate-pulse">
                <div className="w-1/3 h-6 bg-slate-100 rounded-full"></div>
                <div className="space-y-4">
                  <div className="w-3/4 h-8 bg-slate-100 rounded-lg"></div>
                  <div className="w-full h-16 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="w-1/2 h-4 bg-slate-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-800 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-slate-700">
            <Users size={16} />
            <span>Join 10,000+ Volunteers</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
            Ready to <span className="text-emerald-400">Weave</span> Your Impact?
          </h2>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your skills can transform your neighborhood. Sign up today and start receiving tasks matched to your expertise and location.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/issues/submit"
              className="group flex items-center justify-center space-x-3 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all hover:scale-105 shadow-xl shadow-emerald-900/50"
            >
              <Sparkles size={20} />
              <span>Report an Issue</span>
            </Link>
            <Link
              href="/volunteer"
              className="group flex items-center justify-center space-x-3 bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-slate-700 hover:border-white hover:bg-white/5 transition-all"
            >
              <Users size={20} />
              <span>Browse Opportunities</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
