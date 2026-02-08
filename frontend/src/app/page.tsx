'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MapPin, Users, Target, CheckCircle, ArrowRight, Sparkles, Zap, Leaf, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { issuesApi, plansApi, volunteersApi } from '@/lib/api'
import { motion } from 'framer-motion'
import FeaturedCard from '@/components/FeaturedCard'

export default function Home() {
  // Fetch real stats
  const { data: issues = [] } = useQuery({
    queryKey: ['issues-home'],
    queryFn: () => issuesApi.getAll(100),
  })

  // Fetch Action Plans for the "Live Activity" section
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

  // Get top 3 plans for display
  const featuredPlans = plans.slice(0, 3)

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Abstract Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-50/50 to-teal-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-50/50 to-blue-50/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 opacity-60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left z-10"
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
                <Leaf size={16} className="fill-emerald-200" />
                <span>Empowering Local Communities</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Turn Compassion Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 relative">
                  Real Action
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Weave connects neighbors, volunteers, and local leaders to solve real-world problems.
                From cleanups to care packages, verify your impact with AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/issues/submit"
                  className="group flex items-center justify-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <MapPin size={20} />
                  <span className="font-semibold text-lg">Take Action Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/issues"
                  className="group flex items-center justify-center space-x-3 bg-white text-slate-700 px-8 py-4 rounded-full border border-slate-200 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100"
                >
                  <Play size={18} className="fill-current" />
                  <span className="font-semibold text-lg">Watch Demo</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 ring-2 ring-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-base">500+ Changemakers</span>
                  <span className="text-xs text-slate-400">Making a difference daily</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual - Dynamic Cards */}
            <div className="relative hidden lg:block h-[600px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-emerald-100/40 to-teal-50/40 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

              {/* Stacked Cards Animation */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Card 1 (Back) */}
                <motion.div
                  className="absolute top-10 right-0 w-[320px] opacity-60 scale-90 blur-[1px] -rotate-6 z-0"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 h-[280px]"></div>
                </motion.div>

                {/* Card 2 (Middle) */}
                <motion.div
                  className="absolute top-20 -right-8 w-[340px] opacity-80 scale-95 -rotate-3 z-10"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 h-[300px]"></div>
                </motion.div>

                {/* Card 3 (Front - Featured) */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] z-20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {featuredPlans[0] ? (
                    <FeaturedCard plan={featuredPlans[0]} featured={true} />
                  ) : (
                    // Fallback Mock Card if no data
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Community Park Project</h3>
                          <p className="text-slate-500 text-sm">Downtown • 2h ago</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">VERIFIED</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full mb-4">
                        <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-sm font-medium mb-6">
                        <span>12/15 Volunteers</span>
                        <span>80% Goal</span>
                      </div>
                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold">Join Now</button>
                    </div>
                  )}
                </motion.div>

                {/* Floating Stats */}
                <motion.div
                  className="absolute bottom-20 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 z-30"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Issues Solved</p>
                      <p className="text-2xl font-black text-slate-900">1,240+</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-20 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 z-30"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Impact Score</p>
                      <p className="text-2xl font-black text-slate-900">98.5</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 group-hover:bg-emerald-500/30 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 group-hover:bg-blue-500/30 transition-colors"></div>

            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                { label: 'Active Issues', value: stats.issues, icon: MapPin },
                { label: 'Volunteers', value: stats.volunteers, icon: Users },
                { label: 'Action Plans', value: stats.plans, icon: Target },
                { label: 'Completed', value: stats.completed, icon: CheckCircle },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="inline-flex p-3 bg-slate-800 rounded-2xl text-emerald-400 mb-4 ring-1 ring-slate-700/50">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Activity Feed Section */}
      <section className="py-32 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Live Community Actions
              </h2>
              <p className="text-slate-600 text-lg max-w-xl">
                Real-time projects happening in your neighborhood right now.
                Join a team and make an impact.
              </p>
            </div>
            <Link
              href="/issues"
              className="group flex items-center space-x-2 text-emerald-600 font-bold hover:text-emerald-700 bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <span>View All Projects</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlans.map((plan: any) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <FeaturedCard plan={plan} />
              </motion.div>
            ))}

            {featuredPlans.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-80 flex flex-col animate-pulse">
                <div className="h-6 bg-slate-100 rounded-full w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-50 rounded-full w-1/3 mb-8"></div>
                <div className="h-32 bg-slate-50 rounded-2xl mb-6"></div>
                <div className="mt-auto h-10 bg-slate-100 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">One Unified Platform</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">From Problem to Solution</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our AI agents coordinate the complex logistics so you can focus on making a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 -z-10"></div>
            {[
              {
                icon: MapPin,
                title: 'Report',
                desc: 'Spot a problem? Snap a photo and drop a pin.',
                color: 'bg-rose-50 text-rose-600 ring-rose-100'
              },
              {
                icon: Sparkles,
                title: 'Analyze',
                desc: 'AI assesses urgency and resource needs instantly.',
                color: 'bg-amber-50 text-amber-600 ring-amber-100'
              },
              {
                icon: Users,
                title: 'Match',
                desc: 'We connect local volunteers with the right skills.',
                color: 'bg-emerald-50 text-emerald-600 ring-emerald-100'
              },
              {
                icon: CheckCircle,
                title: 'Verify',
                desc: 'Complete the task and share photo proof of impact.',
                color: 'bg-blue-50 text-blue-600 ring-blue-100'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group bg-white pt-4"
              >
                <div className={`w-16 h-16 ${step.color} ring-4 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 text-center mb-3">{step.title}</h4>
                <p className="text-slate-600 text-center leading-relaxed px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-800 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-slate-700 shadow-lg shadow-black/20">
            <Users size={16} />
            <span>Join 10,000+ Volunteers</span>
          </div>

          <h2 className="text-4xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
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
