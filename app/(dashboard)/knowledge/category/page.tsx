/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Settings, Trash } from 'lucide-react';
import { SkeletonTableRow } from '@/components/loader/Skeleton'
import { useGetKnowledgeCategory } from '@/hooks/useGetKnowledgeCategoryHooks'
import { useCallback, useState } from 'react'
import KnowledgeCategoryForm from '../_components/KnowledgeCategoryForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { KNOWLEDGEBASE_CATEGORY_DELETE_API } from '@/api/api';

export default function KnowledgeCategoryPage() {
  const [page, setPage] = useState<number>(1)
  const { data, loading, error, refetch } = useGetKnowledgeCategory(page)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const handleDelete = useCallback(async (id: number) => {
    setDeleteLoading(true);

    // Show loading toast
    const loadingToast = toast.loading("Deleting contact...");

    try {
      const response = await fetch(`${KNOWLEDGEBASE_CATEGORY_DELETE_API}${id}`, {
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
        toast.success("Contact deleted successfully!");

        // Close dialog and reset state
        setDeleteDialogOpen(false);
        setContactToDelete(null);

        // Refetch the contact list
        refetch();
      } else {
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to delete contact");
        console.error("Delete API Error:", data);
      }
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToast);
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
    <div className="space-y-10 p-3">
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Categories</h1>
            <p className="text-gray-600">Organize your knowledge base into categories</p>
          </div>
        </div>
        <div>
          <KnowledgeCategoryForm onSuccess={() => refetch()} />
        </div>
      </div>

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
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Name</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Slug</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Parent ID</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Created At</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data?.data?.map((category: any, i: number) => (
                <tr
                  key={`${category.id}-${category.slug}-${i}`}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 border-b border-gray-200">{category.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{category.name}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{category.slug}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{category.parent_id ?? '—'}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 space-x-2 py-4 border-b border-gray-200">
                    <button
                      onClick={() => openDeleteDialog(category.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      <Trash size={16}/>
                    </button>
                    <KnowledgeCategoryForm instance={category} onSuccess={() => refetch()} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && data && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.current_page} of {data.last_page}
            </span>
            <button
              disabled={page >= data.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this contact? This action cannot be undone.
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
