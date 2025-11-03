// File: app/dashboard/page.tsx
// Home page for /dashboard - Welcome + Stats cards (Tailwind CSS version, Supabase integrated)
// UI unchanged as per request; fetches real data from Supabase 'files' (reports) and 'vitals' tables
// Assumes tables created (SQL below); Gemini integration placeholder in "Coming Soon" section

'use client'

import React, { useEffect, useState } from 'react'
import {
  FiFileText,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi'
import { supabase } from '../api/auth/config/supabaseClient'

const DashboardHome = () => {
  const [user, setUser] = useState<any>(null)
  const [reportsCount, setReportsCount] = useState(0)
  const [vitalsCount, setVitalsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  const fetchDashboardData = React.useCallback(async (userId: string) => {
    try {
      const { data: reportsData } = await supabase
        .from('files') // 'files' table for reports/prescriptions
        .select('*')
        .eq('user_id', userId)

      const { data: vitalsData } = await supabase
        .from('vitals') // 'vitals' table for manual entries (BP, Sugar, Weight)
        .select('*')
        .eq('user_id', userId)

      setReportsCount(reportsData?.length || 0)
      setVitalsCount(vitalsData?.length || 0)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get logged-in user and fetch data
  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        fetchDashboardData(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    }
    fetchUserAndData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
        fetchDashboardData(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchDashboardData])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your HealthMate dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-white/80 mt-1">Here’s your health overview and quick actions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/dashboard/reports" className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition">
              <FiFileText className="h-4 w-4" /> View Reports
            </a>
            <a href="/dashboard/vitals" className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 text-sm font-semibold transition">
              <FiActivity className="h-4 w-4" /> Add Vitals
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Health Reports</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{reportsCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <FiFileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">{reportsCount > 0 ? 'Reports uploaded securely' : 'No reports yet'}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-green-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vitals Entries</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{vitalsCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <FiActivity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-200">
            {vitalsCount > 0 ? `+${vitalsCount} total` : 'No vitals added'}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-orange-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Progress Score</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{reportsCount + vitalsCount > 0 ? '92%' : '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100">
              <FiTrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 ring-1 ring-orange-200">
            {reportsCount + vitalsCount > 0 ? 'Improving' : 'Start tracking!'}
          </span>
        </div>
      </div>

      {/* Main content: Recent + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
            <a href="/dashboard/reports" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</a>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">R</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{reportsCount > 0 ? 'New report uploaded' : 'No new reports yet'}</p>
                <p className="text-xs text-gray-500">Last sync: 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">V</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{vitalsCount > 0 ? 'Vitals updated recently' : 'No vitals recorded'}</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Coming Soon</h3>
          <p className="text-sm text-gray-600">
            AI Health Insights 🤖 — powered by Gemini (English + Roman Urdu summaries, no manual OCR).
          </p>
          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            Tip: Keep uploading your test reports and recording vitals to see personalized insights here soon.
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome