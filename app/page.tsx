// File: app/auth/login/page.tsx
// This matches your logs: /auth/login route
// Import path adjusted for app/auth/login/page.tsx structure

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../app/api/auth/config/supabaseClient'  // Adjusted path for /auth/login/

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/dashboard') // ✅ redirect to dashboard if already logged in
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async () => {
    // Demo with test credentials - CREATE THIS USER IN SUPABASE AUTH if not exists!
    // Go to Supabase Dashboard > Authentication > Users > Add User: email=test@email.com, password=123456
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@email.com',
      password: '123456',
    })

    if (!error && data.session) {
      router.push('/dashboard') // ✅ redirect after login
    } else {
      console.error('Login error:', error)
      alert('Login failed! Create test user in Supabase (email: test@email.com, pass: 123456)')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome to HealthMate</h1>
        <p className="text-gray-600 mb-6">Sign in to access your health dashboard.</p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Login (Demo - test@email.com / 123456)
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Create user in Supabase if needed.
        </p>
      </div>
    </div>
  )
}