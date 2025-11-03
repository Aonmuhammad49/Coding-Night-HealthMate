'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/register')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 animate-background">
      <div className="flex flex-col items-center space-y-8">
        {/* Elegant Glowing Loader */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-30 blur-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
