'use client';
import { Users } from "lucide-react";
import { useGetLeads } from "@/hooks/useGetLeads";

export default function LeadsPage() {
  const { data, loading, error } = useGetLeads();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600">Manage your lead information</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-50 rounded-t-lg">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tl-lg">ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Name</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Phone</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Address</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Property ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Chat ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Created At</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tr-lg">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show 5 skeleton rows while loading
              [...Array(5)].map((_, i) => (
                <tr key={i} className="bg-gray-50 animate-pulse">
                  {[...Array(9)].map((_, j) => (
                    <td key={j} className="px-6 py-4 border-b border-gray-200 bg-gray-200 rounded-sm">&nbsp;</td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-red-500">{error}</td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              data?.map((lead, i) => (
                <tr key={lead.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 border-b border-gray-200">{lead.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 font-medium">{lead.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <a 
                      href={`mailto:${lead.email}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <a 
                      href={`tel:${lead.phone}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className="text-sm text-gray-600">
                      {lead.address || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {lead.property_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {lead.chat_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-600">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-600">
                    {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
