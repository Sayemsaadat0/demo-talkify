'use client'
import { useState, useMemo } from 'react'
import {
  Trash2,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Mail,
  Phone,
  CheckCircle,
  X,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PropertyMember {
  id: number
  user_id: number
  name: string
  email: string
  phone: string | null
  role: string
  status: 'active' | 'inactive' | 'pending'
  permissions: string[]
  property_id: string
  property_name: string
  joined_date: string
  last_active: string
  avatar: string | null
}

const PropertyMemberTable = () => {
  // Mock data - replace with actual API call
  const [members] = useState<PropertyMember[]>([
    {
      id: 1,
      user_id: 101,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      status: "active",
      permissions: ["read", "write", "delete", "manage_users"],
      property_id: "4EVQ7X6Z7FXG9HO",
      property_name: "Downtown Office",
      joined_date: "2024-01-15T10:30:00.000Z",
      last_active: "2024-12-19T14:22:00.000Z",
      avatar: null
    },
    {
      id: 2,
      user_id: 102,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 987-6543",
      role: "Manager",
      status: "active",
      permissions: ["read", "write", "manage_users"],
      property_id: "4EVQ7X6Z7FXG9HO",
      property_name: "Downtown Office",
      joined_date: "2024-02-20T09:15:00.000Z",
      last_active: "2024-12-19T16:45:00.000Z",
      avatar: null
    },
    {
      id: 3,
      user_id: 103,
      name: "Mike Davis",
      email: "mike.davis@example.com",
      phone: "+1 (555) 456-7890",
      role: "Viewer",
      status: "pending",
      permissions: ["read"],
      property_id: "4EVQ7X6Z7FXG9HO",
      property_name: "Downtown Office",
      joined_date: "2024-12-18T11:00:00.000Z",
      last_active: "2024-12-18T11:00:00.000Z",
      avatar: null
    },
    {
      id: 4,
      user_id: 104,
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "+1 (555) 321-6540",
      role: "Editor",
      status: "inactive",
      permissions: ["read", "write"],
      property_id: "4EVQ7X6Z7FXG9HO",
      property_name: "Downtown Office",
      joined_date: "2024-03-10T14:20:00.000Z",
      last_active: "2024-11-25T10:30:00.000Z",
      avatar: null
    },
    {
      id: 5,
      user_id: 105,
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 789-0123",
      role: "Manager",
      status: "active",
      permissions: ["read", "write", "manage_users"],
      property_id: "4EVQ7X6Z7FXG9HO",
      property_name: "Downtown Office",
      joined_date: "2024-04-05T08:45:00.000Z",
      last_active: "2024-12-19T12:15:00.000Z",
      avatar: null
    }
  ])

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.property_name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || member.status === statusFilter
      const matchesRole = roleFilter === 'all' || member.role === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [members, searchTerm, statusFilter, roleFilter])

  const handleDelete = async (memberId: number) => {
    if (confirm('Are you sure you want to remove this member from the property?')) {
      try {
        // Add your delete API call here
        console.log('Removing member:', memberId)
        toast.success('Member removed successfully')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error('Failed to remove member', error.message)
      }
    }
  }

  const handleEdit = (memberId: number) => {
    console.log('Editing member:', memberId)
    toast.success('Edit functionality will be implemented')
  }

  const handleView = (memberId: number) => {
    console.log('Viewing member:', memberId)
    toast.success('View functionality will be implemented')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Inactive
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Editor': 'bg-green-100 text-green-800',
      'Viewer': 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setRoleFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || roleFilter !== 'all'

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name, email, phone, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                showFilters 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredMembers.length} of {members.length} members
          {hasActiveFilters && (
            <span className="ml-2 text-indigo-600">
              (filtered)
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {member.user_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getRoleBadge(member.role)}
                      {getStatusBadge(member.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{member.property_name}</div>
                      <div className="text-gray-500 font-mono text-xs">
                        {member.property_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(member.joined_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(member.last_active)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(member.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(member.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {hasActiveFilters ? 'No members found' : 'No members'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new property member.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyMemberTable
