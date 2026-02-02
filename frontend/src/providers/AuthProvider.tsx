'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { auth, AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await auth.getCurrentUser()
      const currentSession = await auth.getCurrentSession()
      setUser(currentUser)
      setSession(currentSession)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
      setSession(null)
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        const currentSession = await auth.getCurrentSession()
        setUser(currentUser)
        setSession(currentSession)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (session?.user) {
        try {
          const currentUser = await auth.getCurrentUser()
          setUser(currentUser)
          setSession(session)
        } catch (error) {
          console.error('Error getting user after auth change:', error)
          setUser(null)
          setSession(null)
        }
      } else {
        setUser(null)
        setSession(null)
      }
      
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}