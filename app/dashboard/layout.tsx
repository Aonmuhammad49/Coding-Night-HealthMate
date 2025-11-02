// File: app/dashboard/layout.tsx
// Structure code for dashboard - Sidebar, top nav, logout handled here

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../../app/api/auth/config/supabaseClient'
import { 
  FiHome, 
  FiFileText, 
  FiActivity, 
  FiTrendingUp, 
  FiLogOut, 
  FiMenu 
} from 'react-icons/fi'

const drawerWidth = '260px'

const navItems = [
  { text: "Dashboard Home", path: "/dashboard", icon: <FiHome className="text-xl" /> },
  { text: "Health Reports", path: "/dashboard/reports", icon: <FiFileText className="text-xl" /> },
  { text: "Vitals Tracking", path: "/dashboard/vitals", icon: <FiActivity className="text-xl" /> },
  { text: "Progress Analytics", path: "/dashboard/progress", icon: <FiTrendingUp className="text-xl" /> },
  { text: "Logout", path: "/dashboard/logout", icon: <FiLogOut className="text-xl" /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        router.push('/auth/login')
      } else {
        setUser(data.session.user)
      }
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      } else if (session) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    )
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavItemClick = (path: string) => {
    setMobileOpen(false)
    if (path === "/dashboard/logout") {
      // Logout code here
      supabase.auth.signOut()
      router.push('/auth/login')
    } else {
      router.push(path)
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-50 inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              🏥 HealthMate
            </h1>
            <button 
              onClick={handleDrawerToggle}
              className="md:hidden text-white hover:text-gray-300"
            >
              <FiMenu className="text-xl" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 mt-4 px-2 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <button
                  key={item.text}
                  onClick={() => handleNavItemClick(item.path)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active 
                      ? 'bg-blue-600 text-white shadow-md border-l-4 border-blue-400 transform translate-x-1' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className={`mr-3 flex-shrink-0 ${active ? 'text-blue-200' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {item.text}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 mt-auto">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} HealthMate
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top Nav */}
        <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleDrawerToggle}
                className="md:hidden mr-3 text-white hover:text-gray-300"
              >
                <FiMenu className="text-xl" />
              </button>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Health Dashboard
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300 hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={() => handleNavItemClick('/dashboard/logout')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}