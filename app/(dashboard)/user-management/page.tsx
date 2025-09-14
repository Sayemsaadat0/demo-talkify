'use client'
import { Users,UserPlus, Search, Filter } from 'lucide-react'

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage users, roles, and permissions</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4">john.doe@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Admin</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">jane.smith@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">User</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
