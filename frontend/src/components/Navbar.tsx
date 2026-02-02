'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Users, Target, TrendingUp, Menu, X, Sparkles, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, signOut, isLoading } = useAuth()

  const navLinks = [
    { href: '/issues', label: 'Issues', icon: MapPin },
    { href: '/volunteer', label: 'Volunteers', icon: Users },
    { href: '/plans', label: 'Action Plans', icon: Target },
    { href: '/impact', label: 'Impact', icon: TrendingUp },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">WEAVE</span>
                <span className="text-[10px] text-gray-500 -mt-1 hidden sm:block">AI Community Platform</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {!isLoading && !user ? (
              <>
                <Link
                  href="/auth?mode=signin"
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
                >
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all duration-300"
                >
                  <span className="font-medium">Sign Up</span>
                </Link>
              </>
            ) : !isLoading && user ? (
              <>
                {/* Become Volunteer Button - Only show if not a volunteer */}
                {!user.volunteer_profile && (
                  <Link
                    href="/volunteer/register"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300"
                  >
                    <Users size={18} />
                    <span className="font-medium">Become a Volunteer</span>
                  </Link>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all duration-300"
                  >
                    <User size={18} />
                    <span className="font-medium">{user.user_metadata?.name || user.email?.split('@')[0] || 'Profile'}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                      {user.volunteer_profile ? (
                        <Link
                          href="/volunteer/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                        >
                          <Users size={16} />
                          <span>Volunteer Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          href="/volunteer/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-purple-700"
                        >
                          <Users size={16} />
                          <span>Become a Volunteer</span>
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut()
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : null}
            
            <Link
              href="/issues/submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
            >
              <Sparkles size={18} />
              <span className="font-medium hidden sm:inline">Report Issue</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
            
            {/* Mobile Auth Buttons */}
            {!isLoading && !user ? (
              <>
                <Link
                  href="/auth?mode=signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 mt-4"
                >
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-purple-100 text-purple-700"
                >
                  <span className="font-medium">Sign Up</span>
                </Link>
              </>
            ) : !isLoading && user ? (
              <>
                {user.volunteer_profile ? (
                  <Link
                    href="/volunteer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-purple-100 text-purple-700 mt-4"
                  >
                    <Users size={18} />
                    <span className="font-medium">Volunteer Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/volunteer/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-purple-600 text-white mt-4"
                  >
                    <Users size={18} />
                    <span className="font-medium">Become a Volunteer</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700"
                >
                  <User size={18} />
                  <span className="font-medium">{user.user_metadata?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut()
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 border-red-200 text-red-600"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}