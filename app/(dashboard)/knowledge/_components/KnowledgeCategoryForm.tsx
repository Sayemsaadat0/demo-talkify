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
import { KNOWLEDGEBASE_CATEGORY_CREATE_API, KNOWLEDGEBASE_CATEGORY_EDIT_API } from "@/api/api";
import { KnowledgeCategoryType, useGetKnowledgeCategory } from "@/hooks/useGetKnowledgeCategoryHooks";
// import { NOTE_CREATE_API, NOTE_EDIT_API } from "@/api/api";

export interface KnowledgeCategoryFormData {
    id?: number;
    name: string;
    parent_id: number | null;
}

interface KnowledgeCategoryFormProps {
    onSuccess?: () => void;
    instance?: KnowledgeCategoryFormData;
}

export function KnowledgeCategoryForm({

    onSuccess,
    instance,
}: KnowledgeCategoryFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<KnowledgeCategoryFormData>({
        name: "",
        parent_id: null,
    });
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const { data: categoriesData, loading: categoriesLoading } = useGetKnowledgeCategory(1);


    // 🔹 Sync form with instance when dialog opens
    useEffect(() => {
        if (isOpen && instance) {
            setFormData({
                name: instance.name || "",
                parent_id: instance.parent_id,
            });
        }
        if (isOpen && !instance) {
            // reset for create mode
            setFormData({ name: "", parent_id: null });
        }
    }, [isOpen, instance]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, // always keep string for "name"
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: Record<string, any> = {
                name: formData.name,
                parent_id: formData.parent_id,
            };

            const url = instance ? `${KNOWLEDGEBASE_CATEGORY_EDIT_API}${instance.id}` : `${KNOWLEDGEBASE_CATEGORY_CREATE_API}`;

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
                    instance ? "Category updated successfully!" : "Category created successfully!"
                );
                setIsOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(data?.message || "Failed to save category");
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
                        className={`flex items-center gap-2`}
                    >
                        <StickyNote className="h-4 w-4" />
                        Create Category
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>
                        {instance ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter category name"
                        />
                    </div>
                    {/* Category */}
                    <div className="space-y-2">
                        <label htmlFor="parent_id" className="text-sm font-medium">
                            Parent Category
                        </label>
                        <select
                            id="parent_id"
                            name="parent_id"
                            value={formData.parent_id || ""}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                parent_id: e.target.value ? parseInt(e.target.value) : null
                            }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select a parent category</option>
                            {categoriesData?.data?.map((category: KnowledgeCategoryType) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {categoriesLoading && (
                            <div className="text-sm text-gray-500">Loading parent categories...</div>
                        )}
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
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
                                    ? "Update Category"
                                    : "Create Category"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default KnowledgeCategoryForm;
