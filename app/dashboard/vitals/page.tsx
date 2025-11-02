// File: app/dashboard/vitals/page.tsx
// Vitals Tracking page - Table for BP, Sugar, Weight (Tailwind, mock data)

'use client'

import React from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiActivity } from 'react-icons/fi'

const mockVitals = [
  { id: 1, type: 'BP', value: '120/80', date: '2025-10-30', status: 'Normal' },
  { id: 2, type: 'Sugar', value: '95 mg/dL', date: '2025-10-29', status: 'Normal' },
  { id: 3, type: 'Weight', value: '70 kg', date: '2025-10-28', status: 'Stable' },
  { id: 4, type: 'Heart Rate', value: '72 bpm', date: '2025-10-27', status: 'Normal' },
]

const VitalsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiActivity className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Vitals Tracking</h1>
        </div>
        <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md">
          <FiPlus className="text-sm" />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockVitals.map((vital) => (
                <tr key={vital.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vital.status === 'Normal' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vital.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VitalsPage