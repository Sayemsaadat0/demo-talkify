'use client'
import { Users, UserPlus } from 'lucide-react';

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600">Manage potential leads and prospects</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Lead Management</h2>
          <p className="text-gray-600 mb-4">Lead management functionality will be implemented here.</p>
          <div className="text-sm text-gray-500">
            This feature is coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}
