// File: app/dashboard/reports/page.tsx
// Health Reports page - Table of health reports (Tailwind CSS, integrated with Supabase & AI API)
// "Add New" opens modal; on "Upload & Analyse": loader → API call → update status from AI response → add to table
// Fixed: newReport scope error (moved outside try-catch); added date-fns import

'use client'

import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiFileText, FiX } from 'react-icons/fi'
import { format } from 'date-fns'

// Mock "DB" – replace with Supabase in production
type Report = {
  id: number
  type: string
  date: string // YYYY-MM-DD
  status: 'Reviewed' | 'Pending' | 'Uploaded'
  fileName: string
  bp?: string // e.g. "120/80"
  sugar?: string // e.g. "95"
  weight?: string // e.g. "72"
  notes?: string
  summary?: string // AI-generated summary
}

let mockReports: Report[] = [
  { id: 1, type: 'Blood Test', date: '2025-10-15', status: 'Reviewed', fileName: 'blood_report.pdf' },
  { id: 2, type: 'X-Ray', date: '2025-10-20', status: 'Pending', fileName: 'xray.jpg' },
  { id: 3, type: 'ECG', date: '2025-10-25', status: 'Uploaded', fileName: 'ecg.pdf' },
  { id: 4, type: 'MRI Scan', date: '2025-10-28', status: 'Reviewed', fileName: 'mri_report.pdf' },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: '',
    date: '',
    bp: '',
    sugar: '',
    weight: '',
    notes: '',
    file: null as File | null,
  })

  // Form handling
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setForm((prev) => ({ ...prev, file }))
  }

  // Submit → AI API → Add to table
  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type || !form.date || !form.file) {
      alert('Please fill Type, Date and upload a file.')
      return
    }

    setLoading(true)

    // 1. Build report object (initial status: Uploaded) - moved outside try-catch for fallback scope
    const newReport: Omit<Report, 'id' | 'summary'> = {
      type: form.type,
      date: form.date,
      status: 'Uploaded' as const,
      fileName: form.file.name,
      bp: form.bp || undefined,
      sugar: form.sugar || undefined,
      weight: form.weight || undefined,
      notes: form.notes || undefined,
    }

    try {
      // 2. Convert file to base64 for API (as per your API code)
      const fileBase64 = await fileToBase64(form.file)

      // 3. Call AI endpoint
      const aiResponse = await fetch('/api/ai-process-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report: newReport,
          fileBase64, // Send file for AI processing (no manual OCR needed)
        }),
      })

      if (!aiResponse.ok) {
        throw new Error(`AI API error: ${aiResponse.statusText}`)
      }

      const aiData = await aiResponse.json()

      // 4. Update status & summary based on AI response
      const updatedStatus: Report['status'] = aiData.reviewed
        ? 'Reviewed'
        : aiData.pending
        ? 'Pending'
        : 'Uploaded'

      const finalReport: Report = {
        ...newReport,
        id: Math.max(...reports.map((r) => r.id)) + 1,
        status: updatedStatus,
        summary: aiData.summary, // AI summary (English + Roman Urdu if configured)
      }

      // 5. Add to "DB" and state (mock; replace with Supabase insert in prod)
      mockReports = [...mockReports, finalReport]
      setReports(mockReports)

      alert(`✅ Report added & analyzed!\nStatus: ${updatedStatus}\nSummary: ${aiData.summary}`)
    } catch (err: any) {
      console.error('Error:', err)
      alert(`⚠️ Upload failed: ${err.message}\nReport added as "Uploaded" anyway.`)
      // Fallback: Add without AI (now newReport is in scope)
      const fallbackReport: Report = {
        ...newReport,
        id: Math.max(...reports.map((r) => r.id)) + 1,
        status: 'Uploaded',
        summary: 'AI analysis unavailable.',
      }
      mockReports = [...mockReports, fallbackReport]
      setReports(mockReports)
    } finally {
      setLoading(false)
      setShowModal(false)
      // Reset form
      setForm({
        type: '',
        date: '',
        bp: '',
        sugar: '',
        weight: '',
        notes: '',
        file: null,
      })
    }
  }

  // Helper: File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Delete report
  const deleteReport = (id: number) => {
    mockReports = mockReports.filter((r) => r.id !== id)
    setReports(mockReports)
  }

  // Render
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiFileText className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Health Reports</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md"
        >
          <FiPlus className="text-sm" />
          <span>Add New</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(report.date), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'Reviewed'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.fileName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
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

      {/* Add New Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="text-xl" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-5">Upload New Health Report</h2>

            <form onSubmit={submitReport} className="space-y-4">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInput}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option>Blood Test</option>
                  <option>X-Ray</option>
                  <option>ECG</option>
                  <option>MRI Scan</option>
                  <option>Urine Test</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInput}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BP, Sugar, Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    name="bp"
                    placeholder="120/80"
                    value={form.bp}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sugar (mg/dL)</label>
                  <input
                    type="text"
                    name="sugar"
                    placeholder="95"
                    value={form.sugar}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="72"
                    value={form.weight}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report File</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFile}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-70 flex items-center space-x-2"
                >
                  {loading && <FiPlus className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                  <span>{loading ? 'Processing…' : 'Upload & Analyse'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}