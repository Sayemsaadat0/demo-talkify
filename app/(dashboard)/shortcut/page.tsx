'use client';
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { StickyNote, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import toast from 'react-hot-toast'
import { useGetShortcuts } from '@/hooks/useGetShortcuts'
import { SHORTCUT_DELETE_API } from '@/api/api'
import ShortcutForm from './_components/ShortcutForm'

export default function PersonalNotesPage() {
  const [page, setPage] = useState(1)
  const debouncedPage = useDebounce(page, 500) // wait 0.5s before fetching
  const { data, loading, refetch } = useGetShortcuts(debouncedPage)


  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const handleDelete = useCallback(async (id: number) => {
    setDeleteLoading(true);

    // Show loading toast

    try {
      const response = await fetch(`${SHORTCUT_DELETE_API}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Dismiss loading toast and show success toast
        toast.success("Contact deleted successfully!");

        // Close dialog and reset state
        setDeleteDialogOpen(false);
        setContactToDelete(null);

        // Refetch the contact list
        refetch();
      } else {
        // Dismiss loading toast and show error toast
        toast.error(data.message || "Failed to delete contact");
        console.error("Delete API Error:", data);
      }
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.error("Network error. Please try again.");
      console.error("Error deleting contact:", error);
    } finally {
      setDeleteLoading(false);
    }
  }, [token, refetch]);

  const openDeleteDialog = (id: number) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      handleDelete(contactToDelete);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <StickyNote className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shortcuts</h1>
            <p className="text-gray-600"></p>
          </div>
        </div>
        <ShortcutForm
          onSuccess={() => {
            refetch();
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Shortcuts</h2>

        {loading ? (
          <div className="p-4 text-gray-500">Loading Shortcuts...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Details</th>
                    <th className="px-4 py-2 border">Property ID</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length ? (
                    data.data?.map((data) => (
                      <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{data.key}</td>
                        <td className="px-4 py-2 border">{data.message}</td>
                        <td className="px-4 py-2 border">{data.property_id}</td>
                        <td className="px-4 py-2 border flex items-center gap-3">

                          <button
                            onClick={() => openDeleteDialog(data.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-gray-500 border">
                        No Shortcut found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {data?.current_page} of {data?.last_page}
              </span>
              <button
                disabled={page >= (data?.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setContactToDelete(null);
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
  )
}
