'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import AuthForm from '@/components/AuthForm'
import Navbar from '@/components/Navbar'
import NextImage from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function AuthPageContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const currentMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
    setMode(currentMode)
  }, [searchParams])

  const handleAuthSuccess = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image & Content */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <NextImage
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2348&q=80"
          alt="Community Collaboration"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div>
            <Link href="/" className="inline-flex items-center space-x-2 text-emerald-400 font-bold tracking-tight hover:text-emerald-300 transition-colors">
              <div className="w-8 h-8 relative">
                <NextImage src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-xl">WEAVE</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Empowering Communities,<br />
              <span className="text-emerald-400">One Action at a Time.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
              Join thousands of volunteers and community leaders turning local problems into verifiable impact.
            </p>
          </motion.div>

          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Weave Platform. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative">
        <Link href="/" className="absolute top-8 left-8 lg:hidden flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <AuthForm
            mode={mode}
            onSuccess={handleAuthSuccess}
            onModeChange={(newMode) => {
              setMode(newMode)
              // Optionally update URL without reload
              window.history.pushState(null, '', `?mode=${newMode}`)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}