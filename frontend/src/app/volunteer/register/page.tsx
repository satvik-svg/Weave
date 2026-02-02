'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VolunteerRegistrationForm from '@/components/VolunteerRegistrationForm'

export default function VolunteerRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our Volunteer Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make a difference in your community by helping with local action plans and initiatives
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Matched Tasks</h3>
            <p className="text-gray-600 text-sm">
              Get assigned to tasks that match your skills and availability
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Impact</h3>
            <p className="text-gray-600 text-sm">
              Work on projects in your neighborhood and see real results
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your contributions and build your volunteer reputation
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <VolunteerRegistrationForm />
      </div>

      <Footer />
    </div>
  )
}
