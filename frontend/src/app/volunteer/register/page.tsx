'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VolunteerRegistrationForm from '@/components/VolunteerRegistrationForm'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, Target, TrendingUp } from 'lucide-react'

export default function VolunteerRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <div className="pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 relative"
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Join the Movement</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Become a <span className="text-emerald-600 bg-emerald-50 px-2 rounded-lg decoration-4 decoration-emerald-200 underline underline-offset-4">Change Maker</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Join a network of driven individuals turning local challenges into verifiable impact. Your skills can build a better community.
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Matched Tasks</h3>
              <p className="text-slate-600 leading-relaxed">
                Get assigned to specific tasks that perfectly match your unique skills and availability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Local Impact</h3>
              <p className="text-slate-600 leading-relaxed">
                Make a tangible difference in your own neighborhood with verifiable results you can see.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Track Progress</h3>
              <p className="text-slate-600 leading-relaxed">
                Build your volunteer reputation with a verified history of your contributions and impact.
              </p>
            </motion.div>
          </div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 md:p-12">
                <VolunteerRegistrationForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
