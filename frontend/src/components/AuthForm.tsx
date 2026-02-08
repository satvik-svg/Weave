'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type SignUpFormData = z.infer<typeof signUpSchema>
type SignInFormData = z.infer<typeof signInSchema>

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
  onModeChange?: (mode: 'signin' | 'signup') => void
}

export default function AuthForm({ mode, onSuccess, onModeChange }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const isSignUp = mode === 'signup'

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Sign up user
      const { user, session } = await auth.signUp(data.email, data.password, {
        name: data.name,
        phone: data.phone,
      })

      if (!user) {
        throw new Error('Sign up failed - no user returned')
      }

      // Check if email confirmation is required
      if (!session) {
        setError('Please check your email to confirm your account before signing in.')
        console.log('⚠️ Email confirmation required for:', data.email)
        setIsLoading(false)
        return
      }

      console.log('✅ User account created successfully')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('❌ Sign up error:', error)

      // Better error messages
      let errorMessage = 'Failed to create account'

      if (error.message?.includes('rate limit')) {
        errorMessage = 'Too many sign up attempts. Please wait a few minutes and try again.'
      } else if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.'
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { session, user } = await auth.signIn(data.email, data.password)

      if (!session || !user) {
        throw new Error('Sign in failed - no session created')
      }

      console.log('✅ User signed in successfully')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('❌ Sign in error:', error)

      // Better error messages
      let errorMessage = 'Failed to sign in'

      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email address before signing in.'
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = isSignUp
    ? signUpForm.handleSubmit(onSignUp)
    : signInForm.handleSubmit(onSignIn)

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          {isSignUp ? 'Join the Movement' : 'Welcome Back'}
        </h2>
        <p className="text-slate-600">
          {isSignUp
            ? 'Create your account to start making an impact in your community.'
            : 'Sign in to continue your journey.'
          }
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <p className="text-rose-700 text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5 overflow-hidden"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...signUpForm.register('name')}
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                {signUpForm.formState.errors.name && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{signUpForm.formState.errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...signUpForm.register('phone')}
                    type="tel"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              {...(isSignUp ? signUpForm.register('email') : signInForm.register('email'))}
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white"
              placeholder="you@example.com"
            />
          </div>
          {(isSignUp ? signUpForm.formState.errors.email : signInForm.formState.errors.email) && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{(isSignUp ? signUpForm.formState.errors.email : signInForm.formState.errors.email)?.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              {...(isSignUp ? signUpForm.register('password') : signInForm.register('password'))}
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {(isSignUp ? signUpForm.formState.errors.password : signInForm.formState.errors.password) && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{(isSignUp ? signUpForm.formState.errors.password : signInForm.formState.errors.password)?.message}</p>
          )}
        </div>

        <AnimatePresence>
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2 mt-5">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  {...signUpForm.register('confirmPassword')}
                  type="password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isLoading
            ? (isSignUp ? 'Creating Account...' : 'Signing In...')
            : (isSignUp ? 'Create Account' : 'Sign In')
          }
        </button>
      </form>

      {/* Mode Toggle */}
      {onModeChange && (
        <div className="text-center mt-8">
          <p className="text-slate-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button
              onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')}
              className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}