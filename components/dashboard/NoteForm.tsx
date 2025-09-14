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
import { Edit, StickyNote } from "lucide-react";
import { NOTE_CREATE_API, NOTE_EDIT_API } from "@/api/api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export interface NoteFormData {
  id?: number;
  title: string;
  details: string;
  property_id ?:number;
}

interface NoteFormProps {
  className?: string;
  variant?: "primary" | "secondary";
  onSuccess?: () => void;
  instance?: NoteFormData;
  [key: string]: unknown;
}

export function NoteForm({
  className,
  variant,
  onSuccess,
  instance,
}: NoteFormProps) {
  const {token, user} = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    details: "",
    property_id : user?.active_property_id
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Sync form with instance when dialog opens
  useEffect(() => {
    if (isOpen && instance) {
      setFormData({
        title: instance.title || "",
        details: instance.details || "",
        property_id:user?.active_property_id
      });
    }
    if (isOpen && !instance) {
      // reset for create mode
      setFormData({ title: "", details: "" });
    }
  }, [isOpen, instance , user?.active_property_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Record<string, any> = {
        title: formData.title,
        details: formData.details,
        property_id:user?.active_property_id
      };

      const url = instance ? `${NOTE_EDIT_API}${instance.id}` : `${NOTE_CREATE_API}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      // return console.log(data);

      if (response.ok) {
        toast.success(
          instance ? "Note updated successfully!" : "Note created successfully!"
        );
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(data?.message || "Failed to save note");
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
            <StickyNote className="h-4 w-4" />
            Create Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>
            {instance ? "Edit Note" : "Add New Note"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter note title"
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium">
              Details
            </label>
            <RichTextEditor
              value={formData.details}
              onChange={(content: string) => setFormData(prev => ({ ...prev, details: content }))}
              placeholder="Write your note details..."
              className="mb-4"
            />
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
                  : "Creating..."
                : instance
                  ? "Update Note"
                  : "Create Note"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NoteForm;
