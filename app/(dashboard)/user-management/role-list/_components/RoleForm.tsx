/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { Edit, UserPlus } from "lucide-react";
import { ROLE_CREATE_API, ROLE_UPDATE_API } from "@/api/api";

// Available permission options (example)
const availablePermissions = ["inbox", "widget", "knowledge_base", "user_management", "contact", "affiliate"];

export function RoleForm({ onSuccess, instance }: any) {
  const property = useSelector((state: RootState) => state.dashboardPropertys)
  console.log(property?.dashboardProperty)
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    role_name: "",
    permission: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  // Sync form when dialog opens
  useEffect(() => {
    if (isOpen && instance) {
      setFormData({
        role_name: instance.role_name || "",
        permission: instance.permission || [],
      });
    } else if (isOpen) {
      setFormData({ role_name: "", permission: [] });
    }
  }, [isOpen, instance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (perm: string) => {
    setFormData((prev: any) => {
      const updated = prev.permission.includes(perm)
        ? prev.permission.filter((p: string) => p !== perm)
        : [...prev.permission, perm];
      return { ...prev, permission: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        role_name: formData.role_name,
        permission: formData.permission,
        property_id: property?.dashboardProperty?.property_id
      };

      // ✅ Choose endpoint depending on create/update
      const apiUrl = instance
        ? `${ROLE_UPDATE_API}${instance.id}`
        : ROLE_CREATE_API;

      // return console.log('payload', payload);
      const response = await fetch(apiUrl, {
        method: "POST", // if your API expects PUT/PATCH, change here
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success(
          instance ? "Role updated successfully!" : "Role created successfully!"
        );
        setIsOpen(false);
        onSuccess?.();
      } else {
        toast.error(data?.message || "Failed to save role");
        console.error("API Error:", data);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {instance ? (
          <button className="text-blue-600 hover:text-blue-800">
            <Edit className="w-5 h-5" />
          </button>
        ) : (
          <Button className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Role
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-lg shadow-lg border border-gray-200 p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {instance ? "Edit Role" : "Add New Role"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Role Name */}
          <div className="space-y-1">
            <label
              htmlFor="role_name"
              className="block text-sm font-medium text-gray-700"
            >
              Role Name
            </label>
            <input
              type="text"
              id="role_name"
              name="role_name"
              value={formData.role_name}
              onChange={handleInputChange}
              required
              placeholder="Enter role name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* Permission */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Permission
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map((perm) => (
                <label
                  key={perm}
                  className={`flex items-center px-3 py-2 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${formData.permission.includes(perm)
                    ? "bg-blue-50 border-blue-300"
                    : "border-gray-200"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.permission.includes(perm)}
                    onChange={() => handleCheckboxChange(perm)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 capitalize">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 font-semibold rounded-lg text-white bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? instance
                  ? "Updating..."
                  : "Creating..."
                : instance
                  ? "Update Role"
                  : "Create Role"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoleForm;
