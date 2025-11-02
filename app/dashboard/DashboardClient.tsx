'use client'

import React, { useEffect, useState } from 'react'
import { FiFileText, FiActivity, FiTrendingUp } from 'react-icons/fi'
import { supabase } from '../../app/api/auth/config/supabaseClient'

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null)
  const [reportsCount, setReportsCount] = useState(0)
  const [vitalsCount, setVitalsCount] = useState(0)
  const [loading, setLoading] = useState(true)

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
  }, [])

  const fetchDashboardData = async (userId: string) => {
    try {
      const [{ data: reportsData }, { data: vitalsData }] = await Promise.all([
        supabase.from('files').select('*').eq('user_id', userId),
        supabase.from('vitals').select('*').eq('user_id', userId)
      ])

      setReportsCount(reportsData?.length || 0)
      setVitalsCount(vitalsData?.length || 0)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your HealthMate dashboard...</p>
      </div>
    )
  }

  // Baaki UI same...
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Welcome back, {user?.email?.split('@')[0]}!
      </h1>
      <p className="text-gray-600">Here’s a quick overview of your health journey.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards same as before */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <FiFileText className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Health Reports</h3>
              <p className="text-3xl font-bold text-gray-900">{reportsCount}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">{reportsCount > 0 ? 'Reports uploaded securely' : 'No reports yet'}</p>
          <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <FiActivity className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vitals Entries</h3>
              <p className="text-3xl font-bold text-gray-900">{vitalsCount}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {vitalsCount > 0 ? `+${vitalsCount} total` : 'No vitals added'}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 rounded-xl mr-4">
              <FiTrendingUp className="text-2xl text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress Score</h3>
              <p className="text-3xl font-bold text-gray-900">
                {reportsCount + vitalsCount > 0 ? '92%' : '—'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {reportsCount + vitalsCount > 0 ? 'Improving' : 'Start tracking!'}
          </span>
        </div>
      </div>

      {/* Recent Activity & Coming Soon same */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">R</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                {reportsCount > 0 ? 'New report uploaded' : 'No new reports yet'}
              </p>
              <p className="text-xs text-gray-500">Last sync: 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">V</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                {vitalsCount > 0 ? 'Vitals updated recently' : 'No vitals recorded'}
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Coming Soon</h3>
        <p className="text-gray-500">AI Health Insights — powered by Gemini (English + Roman Urdu summaries, no manual OCR)</p>
      </div>
    </div>
  )
}