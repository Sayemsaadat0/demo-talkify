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
import { SHORTCUT_CREATE_API } from "@/api/api";

export function ShortcutForm({ className, variant, onSuccess, instance }: any) {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<any>({
        key: "",
        message: "",
        type: "public",
        property_id: user?.active_property_id
    });
    const [loading, setLoading] = useState(false);

    // Sync form with instance when dialog opens
    useEffect(() => {
        if (isOpen && instance) {
            setFormData({
                key: instance.key || "",
                message: instance.message || "",
                type: instance.type || "public",
                property_id: user?.active_property_id || ""

            });
        }
        if (isOpen && !instance) {
            setFormData({ key: "", message: "", type: "public" });
        }
    }, [isOpen, instance, user?.active_property_id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as any;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                key: formData.key,
                message: formData.message,
                type: formData.type,
                property_id: user?.active_property_id
            };


            const response = await fetch(SHORTCUT_CREATE_API, {
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
                    instance ? "Shortcut updated successfully!" : "Shortcut created successfully!"
                );
                setIsOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(data?.message || "Failed to save shortcut");
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
                    <Button className={`flex items-center gap-2 ${className || ""}`} variant={variant}>
                        <StickyNote className="h-4 w-4" />
                        Create Shortcut
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{instance ? "Edit Shortcut" : "Add New Shortcut"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Key */}
                    <div className="space-y-2">
                        <label htmlFor="key" className="text-sm font-medium">Key</label>
                        <input
                            type="text"
                            id="key"
                            name="key"
                            value={formData.key}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter shortcut key"
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter shortcut message"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="public"
                                    checked={formData.type === "public"}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Public</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="personal"
                                    checked={formData.type === "personal"}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Personal</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="font-semibold py-1 px-4 rounded-md shadow-md transition-all duration-200 text-white cursor-pointer bg-gradient-to-b from-[#3C4BFF] to-[#242D99] hover:from-[#2a36c7] hover:to-[#4e5ed1] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (instance ? "Updating..." : "Creating...") : instance ? "Update Shortcut" : "Create Shortcut"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ShortcutForm;
