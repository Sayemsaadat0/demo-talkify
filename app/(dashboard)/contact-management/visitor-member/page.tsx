'use client'
import { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { SkeletonTableRow } from "@/components/loader/Skeleton";
import { useGetVisitorList } from "@/hooks/useGetVisitorList";
import { VISITOR_DELETE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { usePropertyAccess } from "@/hooks/usePropertyAccess";
// import { PropertyAccessDenied } from "@/components/dashboard/PropertyAccessDenied";

export default function VisitorListPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Property access check - commented out for today
  // if (!usePropertyAccess()) return <PropertyAccessDenied featureName="visitor management" />

  const token = useSelector((state: RootState) => state.auth.token);

  const { data, loading, error, refetch } = useGetVisitorList({});

  const handleDelete = useCallback(async (id: number) => {
    setDeleteLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading("Deleting visitor...");

    try {
      const response = await fetch(`${VISITOR_DELETE_API}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success("Visitor deleted successfully!");
        
        // Close dialog and reset state
        setDeleteDialogOpen(false);
        setVisitorToDelete(null);
        
        // Refetch the visitor list
        refetch();
      } else {
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to delete visitor");
        console.error("Delete API Error:", data);
      }
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.");
      console.error("Error deleting visitor:", error);
    } finally {
      setDeleteLoading(false);
    }
  }, [token, refetch]);

  const openDeleteDialog = (id: number) => {
    setVisitorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (visitorToDelete) {
      handleDelete(visitorToDelete);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header with title */}
      <div className="flex justify-between items-center">
        <p className="text-3xl border-b w-fit border-b-gray-300">Visitor List</p>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Data table */}
        <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead className="bg-gray-50 rounded-t-lg">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tl-lg">ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Visitor Identity</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Note</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">User ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Property ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Created At</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show 5 skeleton rows while loading
              [...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (data?.data &&
              data?.data?.map((visitor, i) => (
                <tr
                  key={visitor.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 border-b border-gray-200">{visitor.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {visitor.visitor_identity}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {visitor.note || 'N/A'}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {visitor.user_id}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {visitor.property_id}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {new Date(visitor.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDeleteDialog(visitor.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete this visitor? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setVisitorToDelete(null);
                  }}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-[#3C4BFF] bg-white border-2 border-[#3C4BFF] hover:bg-[#3C4BFF] hover:text-white cursor-pointer transition-all duration-200 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-all duration-200 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
