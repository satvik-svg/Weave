'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VerificationDemoModal from '@/components/VerificationDemoModal'
import VerificationFeed from '@/components/VerificationFeed'
import { CheckCircle, AlertCircle, Shield, MapPin, Brain, Activity, Users } from 'lucide-react'

export default function ImpactPage() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Shield size={16} className="text-emerald-500" />
            <span>Trust & Transparency</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Impact <span className="text-emerald-400">Verification</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            We use advanced AI and community consensus to verify and measure the real-world outcomes of every initiative.
          </p>

          <button
            onClick={() => setDemoOpen(true)}
            className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 hover:scale-105 transition-all duration-300 group"
          >
            <span>See How It Works</span>
            <Activity size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">

        {/* Live Verification Feed */}
        <div className="mb-20">
          <VerificationFeed />
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="mb-8 inline-block">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center rotate-3 mx-auto">
                <Activity size={32} className="text-emerald-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4">Impact Verification System</h2>
            <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
              Coming Soon
            </div>

            <p className="text-slate-600 mb-12 text-lg leading-relaxed">
              This upcoming feature will enable automated verification of completed community initiatives through robust, multi-layered validation.
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <MapPin className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">GPS & Photo Evidence</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Before/after images with metadata and GPS coords to validate location and timestamp.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Community Consensus</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Peer confirmations from other volunteers and local residents to ensure authenticity.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <Brain className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">AI Analysis</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Computer vision models analyze uploaded images to detect changes and verify completion.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <CheckCircle className="text-teal-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Volunteer Check-ins</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Real-time participation tracking to verify volunteer hours and attendance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
                <AlertCircle size={24} />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-blue-900 mb-1">Under Active Development</h3>
                <p className="text-sm text-blue-800/80">
                  Our team is building the verification agent to ensure every hour contributed creates measurable impact.
                  Check back soon for the beta release.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <VerificationDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}


