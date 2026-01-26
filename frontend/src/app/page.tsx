import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { MapPin, Users, Target, CheckCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Social Intent Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Real Action
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              WEAVE is an AI-powered community organizer that turns local issues into 
              coordinated action plans, mobilizes volunteers, and verifies real-world impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/issues/submit"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MapPin size={20} />
                <span>Report an Issue</span>
              </Link>
              <Link
                href="/volunteer"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Users size={20} />
                <span>Join as Volunteer</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How WEAVE Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
              <p className="text-gray-600">
                Community members identify local problems and submit them with location and details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Planning</h3>
              <p className="text-gray-600">
                Our AI agents analyze issues and create structured action plans with tasks and timelines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobilize Community</h3>
              <p className="text-gray-600">
                Volunteers are intelligently matched to tasks based on skills, location, and availability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify Impact</h3>
              <p className="text-gray-600">
                Real-world outcomes are verified through evidence and community validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Community Action</h2>
            <Link 
              href="/issues" 
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sample Issue Cards */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Environment
                </span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Park Cleanup Drive</h3>
              <p className="text-gray-600 text-sm mb-3">
                Organizing community cleanup at Riverside Park with focus on trail maintenance.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Users size={14} className="mr-1" />
                <span>12 volunteers joined</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Civic
                </span>
                <span className="text-xs text-gray-500">4 days ago</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Neighborhood Watch Setup</h3>
              <p className="text-gray-600 text-sm mb-3">
                Establishing community safety patrols for downtown residential area.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Users size={14} className="mr-1" />
                <span>8 volunteers joined</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  Social
                </span>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Food Distribution Network</h3>
              <p className="text-gray-600 text-sm mb-3">
                Coordinating weekly food distribution for families in need.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle size={14} className="mr-1 text-green-500" />
                <span>Completed - 45 families helped</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Real Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of community members turning good intentions into verified results.
          </p>
          <Link
            href="/issues/submit"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
