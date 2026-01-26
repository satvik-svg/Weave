import Link from 'next/link'
import { MapPin, Users, Target, TrendingUp } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WEAVE</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/issues"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <MapPin size={18} />
              <span>Issues</span>
            </Link>
            <Link
              href="/volunteer"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Users size={18} />
              <span>Volunteer</span>
            </Link>
            <Link
              href="/plans"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Target size={18} />
              <span>Action Plans</span>
            </Link>
            <Link
              href="/impact"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <TrendingUp size={18} />
              <span>Impact</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
            <Link
              href="/issues/submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Report Issue
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}