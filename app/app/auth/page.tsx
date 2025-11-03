'use client'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Health Mate</h1>
          <p className="mt-2 text-gray-600">Welcome to Health Mate</p>
        </div>

        <div className="mt-8 space-y-4">
          <Link 
            href="/auth/login"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-lg font-semibold"
          >
            Login
          </Link>
          
          <Link 
            href="/auth/register"
            className="w-full flex justify-center py-4 px-4 border-2 border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-lg font-semibold"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}