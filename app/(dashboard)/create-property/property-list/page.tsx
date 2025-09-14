/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useGetPropertyList } from '@/hooks/useGetPropertyList'
import { Trash2, Building2, Eye } from 'lucide-react'
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
// import { SkeletonTableRow } from '@/components/loader/Skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'
import { DELETE_PROPERTY_API } from '@/api/api'
import { useRouter } from 'next/navigation'

interface Property {
  id: number
  user_id: number
  property_name: string
  site_url: string
  property_id: string
  image: string | null
  driver: string | null
  status: number
  region: string | null
  visitor_ip_tracking: number
  total_incoming_visitors: number
  report_sent: string
  created_at: string
  updated_at: string
}

const PropertyList = () => {
  const [page, setPage] = useState<number>(1);
  const { data, loading, error, refetch } = useGetPropertyList(page);
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const propertyData = data as
    | { data: Property[]; current_page: number; last_page: number }
    | undefined;

  const handleDelete = useCallback(
    async (propertyId: string) => {
      setDeleteLoading(true);

      try {
        const response = await fetch(`${DELETE_PROPERTY_API}${propertyId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Property deleted successfully!");
          setDeleteDialogOpen(false);
          setPropertyToDelete(null);
          refetch();
        } else {
          toast.error(data.message || "Failed to delete property");
          console.error("Delete API Error:", data);
        }
      } catch (error) {
        toast.error("Network error. Please try again.");
        console.error("Error deleting property:", error);
      } finally {
        setDeleteLoading(false);
      }
    },
    [token, refetch]
  );

  const openDeleteDialog = (id: string) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      handleDelete(propertyToDelete);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const getVisitorTrackingBadge = (tracking: number) => {
    return tracking === 1 ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Enabled
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Disabled
      </span>
    );
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Building2 className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500">
            Manage properties, monitor visitors, and track reports
          </p>
        </div>
        
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">IP Tracking</th>
                <th className="px-6 py-3">Visitors</th>
                <th className="px-6 py-3">Report</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-4/4 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : !propertyData?.data || propertyData.data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 font-medium">No properties yet</p>
                    <p className="text-sm">Create a property to get started.</p>
                  </td>
                </tr>
              ) : (
                propertyData.data.map((property: any) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{property.id}</td>
                    <td className="px-6 py-4 font-medium">
                      {property.property_name}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={property.site_url}
                        target="_blank"
                        className="text-indigo-600 hover:underline"
                      >
                        {property.site_url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getVisitorTrackingBadge(property.visitor_ip_tracking)}
                    </td>
                    <td className="px-6 py-4">
                      {property.total_incoming_visitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{formatDate(property.report_sent)}</td>
                    <td className="px-6 py-4">{formatDate(property.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/create-property/property-overview/?propertyId=${property.property_id}`
                            )
                          }
                          className="p-1 text-indigo-600 hover:bg-indigo-100 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(property.property_id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
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
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            ))
          ) : !propertyData?.data || propertyData.data.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Building2 className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 font-medium">No properties found</p>
            </div>
          ) : (
            propertyData.data.map((property: any) => (
              <div key={property.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{property.property_name}</p>
                    <a
                      href={property.site_url}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {property.site_url}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/create-property/property-overview/?propertyId=${property.property_id}`
                        )
                      }
                      className="p-1 text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(property.property_id)}
                      className="p-1 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
                  <span>Status:</span>
                  <span>{getStatusBadge(property.status)}</span>
                  <span>IP Tracking:</span>
                  <span>{getVisitorTrackingBadge(property.visitor_ip_tracking)}</span>
                  <span>Visitors:</span>
                  <span>{property.total_incoming_visitors.toLocaleString()}</span>
                  <span>Report:</span>
                  <span>{formatDate(property.report_sent)}</span>
                  <span>Created:</span>
                  <span>{formatDate(property.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && propertyData && (
          <div className="flex justify-center items-center gap-3 py-4 border-t">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {propertyData.current_page} of {propertyData.last_page}
            </span>
            <button
              disabled={page >= propertyData.last_page}
              onClick={() => setPage((p: number) => p + 1)}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            This action cannot be undone. Are you sure?
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setDeleteDialogOpen(false);
                setPropertyToDelete(null);
              }}
              disabled={deleteLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyList
