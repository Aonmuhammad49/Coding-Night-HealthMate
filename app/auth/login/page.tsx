// File: app/auth/login/page.tsx
// Enhanced Login page - Improved UI (dashboard-style: gradients, shadows, icons) + Full validation (email, password, camelCase)

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { supabase } from '../../api/auth/config/supabaseClient'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [success, setSuccess] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setSigningIn(true)

    if (!validateForm()) {
      setSigningIn(false)
      return
    }

    const { email, password } = formData

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (!data?.user?.email_confirmed_at) {
        await supabase.auth.signOut()
        setErrors({ general: 'Please verify your email before logging in.' })
        setSigningIn(false)
        return
      }

      setSuccess('Signed in successfully!')
      setTimeout(() => router.push('/dashboard'), 800) // Redirect to dashboard
    } catch (err: any) {
      setErrors({ general: err.message })
    } finally {
      setSigningIn(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error on input
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Welcome Back 👋
        </h1>

        {/* General Error/Success */}
        {errors.general && (
          <div className="flex items-center space-x-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            <FiAlertCircle className="w-4 h-4" />
            <span>{errors.general}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
            <FiCheckCircle className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={signingIn}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
              signingIn
                ? 'bg-blue-400 cursor-not-allowed opacity-75'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {signingIn && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            <span>{signingIn ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}