'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { MapPin, Users, Target, TrendingUp, Menu, X, Sparkles, User, LogOut, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut, isLoading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/issues', label: 'Issues', icon: MapPin },
    { href: '/volunteer', label: 'Volunteers', icon: Users },
    { href: '/plans', label: 'Action Plans', icon: Target },
    { href: '/impact', label: 'Impact', icon: TrendingUp },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 transform group-hover:scale-105 transition-transform duration-300">
                <NextImage
                  src="/logo.png"
                  alt="Weave Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 tracking-tight">WEAVE</span>
                <span className="text-[10px] text-emerald-600 font-medium -mt-1 hidden sm:block uppercase tracking-wider">Community Action</span>
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon size={16} className={isActive(link.href) ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span>{link.label}</span>
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
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                >
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="font-medium text-sm">Join Us</span>
                </Link>
              </>
            ) : !isLoading && user ? (
              <>
                {/* Become Volunteer Button - Only show if not a volunteer */}
                {!user.volunteer_profile && (
                  <Link
                    href="/volunteer/register"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all duration-300"
                  >
                    <Heart size={16} />
                    <span className="font-medium text-sm">Volunteer</span>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center space-x-2 pl-4 pr-2 py-1.5 rounded-full border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300 bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-sm text-slate-700 pr-2">{user.user_metadata?.name || 'Profile'}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      </div>

                      {user.volunteer_profile ? (
                        <Link
                          href="/volunteer/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          <Users size={16} className="text-emerald-500" />
                          <span className="text-sm">Volunteer Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          href="/volunteer/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-emerald-50 text-emerald-700 transition-colors"
                        >
                          <Heart size={16} className="text-emerald-500" />
                          <span className="text-sm">Become a Volunteer</span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <User size={16} className="text-slate-400" />
                        <span className="text-sm">My Profile</span>
                      </Link>

                      <div className="border-t border-slate-50 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false)
                            signOut()
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <LogOut size={16} />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : null}

            <Link
              href="/issues/submit"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Sparkles size={18} />
              <span className="font-medium hidden sm:inline text-sm">Report Issue</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 animate-slide-up">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            <div className="border-t border-gray-100 my-4 pt-4 space-y-3">
              {/* Mobile Auth Buttons */}
              {!isLoading && !user ? (
                <>
                  <Link
                    href="/auth?mode=signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border border-slate-200 text-slate-700"
                  >
                    <span className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-slate-900 text-white"
                  >
                    <span className="font-medium">Join Us</span>
                  </Link>
                </>
              ) : !isLoading && user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-slate-900">Signed in as {user.user_metadata?.name}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <User size={18} />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut()
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}