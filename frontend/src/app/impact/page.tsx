'use client'

import Navbar from '@/components/Navbar'
import { TrendingUp, CheckCircle, Award, AlertCircle } from 'lucide-react'

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Verification</h1>
          <p className="text-gray-600">Track and verify real-world outcomes of community initiatives</p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Award size={64} className="mx-auto text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact Verification Coming Soon</h2>
            
            <p className="text-gray-600 mb-8">
              This feature will enable automated verification of completed community initiatives through:
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Photo Evidence</h3>
                    <p className="text-sm text-gray-600">Before/after images with GPS validation</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Volunteer Check-ins</h3>
                    <p className="text-sm text-gray-600">GPS-verified participation tracking</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Community Validation</h3>
                    <p className="text-sm text-gray-600">Peer confirmations and feedback</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">AI Verification</h3>
                    <p className="text-sm text-gray-600">Automated analysis of evidence and outcomes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-1" size={20} />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900 mb-1">In Development</h3>
                  <p className="text-sm text-blue-800">
                    The verification agent is currently being developed to automatically validate completed 
                    action plans and measure real-world impact. Check back soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <TrendingUp className="mx-auto text-gray-400 mb-2" size={32} />
            <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-600 text-sm">Verified Projects</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Award className="mx-auto text-gray-400 mb-2" size={32} />
            <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-600 text-sm">Impact Reports</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <CheckCircle className="mx-auto text-gray-400 mb-2" size={32} />
            <div className="text-3xl font-bold text-gray-900 mb-1">0%</div>
            <div className="text-gray-600 text-sm">Verification Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
