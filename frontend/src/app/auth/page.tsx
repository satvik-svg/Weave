'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import AuthForm from '@/components/AuthForm'
import Navbar from '@/components/Navbar'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/')
    }
  }, [user, isLoading, router])

  const handleAuthSuccess = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-20 px-4">
        <AuthForm 
          mode={mode}
          onSuccess={handleAuthSuccess}
          onModeChange={setMode}
        />
      </div>
    </div>
  )
}