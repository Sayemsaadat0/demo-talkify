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
import { KNOWLEDGEBASE_EDIT_API, KNOWLEDGEBASE_CREATE_API } from "@/api/api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useGetKnowledgeCategory } from "@/hooks/useGetKnowledgeCategoryHooks";

export interface KnowledgeBaseFormData {
    id?: number;
    title: string;
    details: string;
    category_id?: number;
}

interface KnowledgeBaseCreateFormProps {
    onSuccess?: () => void;
    instance?: KnowledgeBaseFormData;
}

export function KnowledgeBaseCreateForm({
    onSuccess,
    instance,
}: KnowledgeBaseCreateFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<KnowledgeBaseFormData>({
        title: "",
        details: "",
        category_id: undefined,
    });
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    
    // Fetch categories
    const { data: categoriesData, loading: categoriesLoading } = useGetKnowledgeCategory(1);

    // Sync form with instance when dialog opens
    useEffect(() => {
        if (isOpen && instance) {
            setFormData({
                title: instance.title || "",
                details: instance.details || "",
                category_id: instance.category_id,
            });
        }
        if (isOpen && !instance) {
            setFormData({ title: "", details: "", category_id: undefined });
        }
    }, [isOpen, instance]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form data
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }
        
        if (!formData.details.trim()) {
            toast.error("Details are required");
            return;
        }
        
        setLoading(true);

        try {
            const payload = {
                title: formData.title.trim(),
                details: formData.details.trim(),
                category_id: formData.category_id,
            };

            const url = instance
                ? `${KNOWLEDGEBASE_EDIT_API}${instance.id}`
                : `${KNOWLEDGEBASE_CREATE_API}`;

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

            if (response.ok) {
                toast.success(
                    instance
                        ? "Knowledge updated successfully!"
                        : "Knowledge created successfully!"
                );
                setIsOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(data?.message || "Failed to save knowledge");
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
                    <Button className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        Create Knowledge
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[880px]">
                <DialogHeader>
                    <DialogTitle>
                        {instance ? "Edit Knowledge" : "Add New Knowledge"}
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
                            placeholder="Enter knowledge title"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category_id"
                            value={formData.category_id || ""}
                            onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                category_id: e.target.value ? parseInt(e.target.value) : undefined 
                            }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select a category</option>
                            {categoriesData?.data?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {categoriesLoading && (
                            <div className="text-sm text-gray-500">Loading categories...</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                        <label htmlFor="details" className="text-sm font-medium">
                            Details
                        </label>
                        <RichTextEditor
                            value={formData.details}
                            onChange={(content: string) => setFormData(prev => ({ ...prev, details: content }))}
                            placeholder="Enter knowledge details..."
                            className="mb-4"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button"  onClick={() => setIsOpen(false)}>
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
                                    ? "Update Knowledge"
                                    : "Create Knowledge"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default KnowledgeBaseCreateForm;
