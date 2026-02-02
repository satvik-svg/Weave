'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from 'lucide-react'
import LocationPicker from './LocationPicker'

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
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)

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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Join WEAVE' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSignUp 
              ? 'Create your volunteer account to start making an impact'
              : 'Sign in to continue your community work'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - Sign Up Only */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...signUpForm.register('name')}
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {signUpForm.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.name.message}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...(isSignUp ? signUpForm.register('email') : signInForm.register('email'))}
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {(isSignUp ? signUpForm.formState.errors.email : signInForm.formState.errors.email) && (
              <p className="text-red-500 text-xs mt-1">{(isSignUp ? signUpForm.formState.errors.email : signInForm.formState.errors.email)?.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...(isSignUp ? signUpForm.register('password') : signInForm.register('password'))}
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {(isSignUp ? signUpForm.formState.errors.password : signInForm.formState.errors.password) && (
              <p className="text-red-500 text-xs mt-1">{(isSignUp ? signUpForm.formState.errors.password : signInForm.formState.errors.password)?.message}</p>
            )}
          </div>

          {/* Confirm Password - Sign Up Only */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...signUpForm.register('confirmPassword')}
                  type="password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {/* Additional Sign Up Fields */}
          {isSignUp && (
            <>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...signUpForm.register('phone')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading 
              ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
              : (isSignUp ? 'Create Account' : 'Sign In')
            }
          </button>
        </form>

        {/* Mode Toggle */}
        {onModeChange && (
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}