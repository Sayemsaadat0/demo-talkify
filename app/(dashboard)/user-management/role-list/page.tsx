'use client';
import { Shield } from 'lucide-react';
import { useGetRole } from '@/hooks/useGetRole';
import RoleForm from './_components/RoleForm';

export default function RoleListPage() {
  const { data: roles, loading, error, refetch } = useGetRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Role List</h1>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
        </div>
        <RoleForm onSuccess={() => refetch()} />
      </div>

      {/* Role Table */}
      <div>

        {loading && <div className="text-gray-500">Loading roles...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-50 rounded-t-lg">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tl-lg">Role Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Permissions</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Status</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Show 5 skeleton rows while loading
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="bg-gray-50 animate-pulse">
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-6 py-4 border-b border-gray-200 bg-gray-200 rounded-sm">&nbsp;</td>
                      ))}
                    </tr>
                  ))
                ) : roles?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No roles found
                    </td>
                  </tr>
                ) : (
                  roles && roles.map((role, i) => (
                    <tr key={role.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 border-b border-gray-200">{role.role_name}</td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2 uppercase">
                          {role.permission.map((perm: string, idx: number) => {
                            // 7 light colors
                            const colors = [
                              "bg-pink-100 text-pink-800",
                              "bg-blue-100 text-blue-800",
                              "bg-green-100 text-green-800",
                              "bg-yellow-100 text-yellow-800",
                              "bg-purple-100 text-purple-800",
                              "bg-teal-100 text-teal-800",
                              "bg-orange-100 text-orange-800",
                            ];
                            const colorClass = colors[idx % colors.length];
                            return (
                              <span
                                key={perm}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                              >
                                {perm}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {role.status === 1 ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        ) : (
                          "Inactive"
                        )}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-right">
                        <RoleForm onSuccess={() => refetch()} instance={role} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        ) : (
          !loading && <div className="text-gray-500">No roles found.</div>
        )}
      </div>
    </div>
  );
}
