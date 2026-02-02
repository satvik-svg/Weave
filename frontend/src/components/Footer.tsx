'use client'

import Link from 'next/link'
import { MapPin, Users, Target, TrendingUp, Heart, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: '/issues', label: 'Issues', icon: MapPin },
    { href: '/volunteer', label: 'Volunteers', icon: Users },
    { href: '/plans', label: 'Action Plans', icon: Target },
    { href: '/impact', label: 'Impact', icon: TrendingUp },
  ]

  const socialLinks = [
    { href: '#', label: 'GitHub', icon: Github },
    { href: '#', label: 'Twitter', icon: Twitter },
    { href: '#', label: 'LinkedIn', icon: Linkedin },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">WEAVE</span>
                <span className="text-sm text-gray-500 -mt-1">AI Community Platform</span>
              </div>
            </Link>
            <p className="text-gray-600 max-w-md mb-4">
              Transform social intent into coordinated, verifiable real-world action. 
              AI-powered community engagement for meaningful impact.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for community impact</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/issues/submit" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Become a Volunteer
                </Link>
              </li>
              <li>
                <a href="mailto:hello@weave.community" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            © {currentYear} WEAVE. All rights reserved. Building communities, one action at a time.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">Community Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  )
}