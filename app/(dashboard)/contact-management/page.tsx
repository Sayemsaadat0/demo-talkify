'use client'
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600">Manage your contacts and leads</p>
          </div>
        </div>
        <Link 
          href="/contact-management/contact-list"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/contact-management/contact-list"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact List</h2>
          <p className="text-gray-600">Manage your contact database</p>
        </Link>

        <Link 
          href="/contact-management/visitor-member"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitor Members</h2>
          <p className="text-gray-600">Track website visitors and members</p>
        </Link>

        <Link 
          href="/contact-management/leads"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads</h2>
          <p className="text-gray-600">Manage potential leads and prospects</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Active Visitors</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
        </div>
      </div>
    </div>
  )
}
