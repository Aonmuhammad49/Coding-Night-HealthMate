// File: app/dashboard/progress/page.tsx
// Progress Analytics page - Charts placeholder with Tailwind (mock progress bars)
// Changed icons to Heroicons library (@heroicons/react) for better integration with Tailwind

'use client'

import React from 'react'
import { ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const ProgressPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
        <ArrowTrendingUpIcon className="h-8 w-8 text-orange-600" />
        <span>Progress Analytics</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Health Score */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>Overall Health Score</span>
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div className="bg-orange-600 h-3 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">85%</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Up 5% from last month
          </span>
          <button className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium transition-all">
            View Full Chart
          </button>
        </div>

        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Weight Trend</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">BP Stability</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Sugar Control</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage