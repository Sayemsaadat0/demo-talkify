'use client';
import { useCallback, useState } from "react";
import { User } from "lucide-react";
import { useGetPropertyMembers } from "@/hooks/useGetPropertyMembers";
import PropertyMemberInviteForm from "./_components/PropertyMemberInviteForm";
import { Switch } from "@/components/ui/switch";
import { PROPERTY_MEMBER_STATUS_API } from "@/api/api";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function PropertyMemberPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useGetPropertyMembers(page);
  const token = useSelector((state: RootState) => state.auth.token);

  // Handle status toggle
  const handleSwitchStatus = useCallback(async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const response = await fetch(`${PROPERTY_MEMBER_STATUS_API}${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Status ${newStatus === 1 ? 'enabled' : 'disabled'} successfully!`);
        refetch();
      } else {
        toast.error(data.message || "Failed to update status");
        console.error("Status API Error:", data);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error updating status:", error);
    }
  }, [token, refetch]);

  // Handle resend invitation
  // const handleResendInvitation = useCallback(async (id: number) => {
  //   try {
  //     const response = await fetch(PROPERTY_MEMBER_RESEND_INVITATION_API, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       toast.success("Invitation resent successfully!");
  //       refetch();
  //     } else {
  //       toast.error(data.message || "Failed to resend invitation");
  //       console.error("Resend Invitation API Error:", data);
  //     }
  //   } catch (error) {
  //     toast.error("Network error. Please try again.");
  //     console.error("Error resending invitation:", error);
  //   }
  // }, [token, refetch]);
  return (
    <div className="space-y-6 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Members</h1>
            <p className="text-gray-600">Manage property team members</p>
          </div>
        </div>
        <PropertyMemberInviteForm onSuccess={() => refetch()} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-50 rounded-t-lg">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tl-lg">ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Name</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Property ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Owner</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Invitation Stage</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Role</th>
              {/* <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Permissions</th> */}
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Sent At</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Created At</th>
              {/* <th className="text-right px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tr-lg">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show 5 skeleton rows while loading
              [...Array(5)].map((_, i) => (
                <tr key={i} className="bg-gray-50 animate-pulse">
                  {[...Array(11)].map((_, j) => (
                    <td key={j} className="px-6 py-4 border-b border-gray-200 bg-gray-200 rounded-sm">&nbsp;</td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={11} className="text-center py-6 text-red-500">{error}</td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-500">
                  No members found
                </td>
              </tr>
            ) : (
              data?.data?.map((member, i) => (
                <tr key={member.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 border-b border-gray-200">{member.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{member.full_name}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{member.email}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{member.property_id}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${member.is_owner === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {member.is_owner === 1 ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${member.invitation_stage === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {member.invitation_stage === 0 ? 'Pending' : 'Accepted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <Switch
                      checked={member.status === 1}
                      onCheckedChange={() => handleSwitchStatus(member.id, member.status)}
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">{member.role?.role_name || "N/A"}</td>
                  {/* <td className="px-6 py-4 border-b border-gray-200">
                    {member.role?.permission?.map((perm: string, idx: number) => {
                      // Generate a random color for each item
                      const colors = [
                        "bg-red-100 text-red-700",
                        "bg-green-100 text-green-700",
                        "bg-blue-100 text-blue-700",
                        "bg-yellow-100 text-yellow-700",
                        "bg-purple-100 text-purple-700",
                        "bg-pink-100 text-pink-700",
                        "bg-indigo-100 text-indigo-700",
                        "bg-teal-100 text-teal-700",
                        "bg-orange-100 text-orange-700",
                      ];
                      const colorClass = colors[Math.floor(Math.random() * colors.length)];
                      return (
                        <span
                          key={idx}
                          className={`inline-block px-2 py-1 mr-1 rounded text-xs font-bold uppercase ${colorClass}`}
                        >
                          {perm}
                        </span>
                      );
                    })}
                  </td> */}
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-600">
                    {new Date(member.send_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-600">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  {/* <td className="px-6 py-4 border-b border-gray-200 text-right">
                    <button
                      onClick={() => openDeleteDialog(member.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && (
          <div className="flex justify-center items-center gap-2 mt-4 p-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.current_page} of {data.last_page}
            </span>
            <button
              disabled={page >= data.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
