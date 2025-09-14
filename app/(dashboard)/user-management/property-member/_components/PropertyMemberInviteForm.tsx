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
import { UserPlus, Edit } from "lucide-react";
import { PROPERTY_MEMBER_INVITE_API } from "@/api/api";
import { useGetRole } from "@/hooks/useGetRole";

export interface PropertyMemberInviteFormData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id?: number;
}

interface PropertyMemberInviteFormProps {
  className?: string;
  variant?: "primary" | "secondary";
  onSuccess?: () => void;
  instance?: PropertyMemberInviteFormData;
  [key: string]: unknown;
}

export function PropertyMemberInviteForm({
  className,
  variant,
  onSuccess,
  instance,
}: PropertyMemberInviteFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyMemberInviteFormData>({
    first_name: "",
    last_name: "",
    email: "",
    role_id: undefined,
  });
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: rolesData } = useGetRole();

  // Sync form with instance when dialog opens
  useEffect(() => {
    if (isOpen && instance) {
      setFormData({
        first_name: instance.first_name || "",
        last_name: instance.last_name || "",
        email: instance.email || "",
        role_id: instance.role_id,
      });
    }
    if (isOpen && !instance) {
      // reset for create mode
      setFormData({ first_name: "", last_name: "", email: "", role_id: undefined });
    }
  }, [isOpen, instance]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Record<string, any> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role_id: formData.role_id,
      };

      const response = await fetch(PROPERTY_MEMBER_INVITE_API, {
        method: "POST",
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
          instance ? "Member updated successfully!" : "Member invited successfully!"
        );
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data?.message || "Failed to invite member");
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
            <Edit className="w-4 h-4" />
          </button>
        ) : (
          <Button
            className={`flex items-center gap-2 ${className || ""}`}
            variant={variant}
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {instance ? "Edit Member" : "Invite New Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter last name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email address"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label htmlFor="role_id" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id || ""}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a role</option>
              {rolesData?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={loading}
              className="font-semibold py-1 px-4 rounded-md shadow-md transition-all duration-200 text-white cursor-pointer bg-gradient-to-b from-[#3C4BFF] to-[#242D99] hover:from-[#2a36c7] hover:to-[#4e5ed1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? instance
                  ? "Updating..."
                  : "Inviting..."
                : instance
                  ? "Update Member"
                  : "Invite Member"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PropertyMemberInviteForm;