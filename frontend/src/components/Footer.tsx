'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { MapPin, Users, Target, TrendingUp, Heart, Github, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: '/issues', label: 'Report Issues', icon: MapPin },
    { href: '/volunteer', label: 'Volunteers', icon: Users },
    { href: '/plans', label: 'Action Plans', icon: Target },
    { href: '/impact', label: 'Community Impact', icon: TrendingUp },
  ]

  const socialLinks = [
    { href: '#', label: 'Twitter', icon: Twitter },
    { href: '#', label: 'Facebook', icon: Facebook },
    { href: '#', label: 'Instagram', icon: Instagram },
    { href: '#', label: 'LinkedIn', icon: Linkedin },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group mb-6">
              <div className="w-10 h-10 relative">
                <NextImage
                  src="/logo.png"
                  alt="Weave Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">WEAVE</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6">
              Empowering communities to solve local problems.
              We combine AI technology with human compassion to create verifiable real-world impact.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 hover:text-emerald-400">About Us</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-emerald-400">Blog</Link></li>
              <li><Link href="/careers" className="text-slate-400 hover:text-emerald-400">Careers</Link></li>
              <li><Link href="/help" className="text-slate-400 hover:text-emerald-400">Help Center</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-emerald-400">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-slate-400 mb-4">Subscribe to our newsletter for the latest community impact stories.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-800 border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-medium rounded-lg px-4 py-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {currentYear} WEAVE. Built with <Heart className="w-3 h-3 text-red-500 inline mx-1" /> for the community.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}