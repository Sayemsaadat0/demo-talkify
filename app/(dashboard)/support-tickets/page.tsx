'use client'
import { MessageSquare, Plus } from 'lucide-react'

export default function SupportTicketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600">Manage customer support requests</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h2>
        <p className="text-gray-600">Support ticket management functionality will be implemented here.</p>
      </div>
    </div>
  )
}
