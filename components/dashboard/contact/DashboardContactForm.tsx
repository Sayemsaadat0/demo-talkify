"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import Button from "@/components/ui/button";
import { CONTACT_LIST_API_CREATE } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    note: string;
}

interface DashboardContactFormProps {
    className?: string;
    variant?: "primary" | "secondary";
    onClick?: () => void;
    onSuccess?: () => void; // Callback for successful submission
    [key: string]: unknown; // Allow any additional props
}

export function DashboardContactForm({ className, variant, onClick, onSuccess, ...props }: DashboardContactFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        note: "",
    });
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Show loading toast
        const loadingToast = toast.loading("Adding contact...");

        try {
            const response = await fetch(CONTACT_LIST_API_CREATE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Dismiss loading toast and show success toast
                toast.dismiss(loadingToast);
                toast.success("Contact added successfully!");
                
                // Reset form and close dialog
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    note: "",
                });
                setIsOpen(false);
                
                // Call onSuccess callback to refetch data
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                // Dismiss loading toast and show error toast
                toast.dismiss(loadingToast);
                toast.error(data.message || "Failed to add contact");
                console.error("API Error:", data);
            }
        } catch (error) {
            // Dismiss loading toast and show error toast
            toast.dismiss(loadingToast);
            toast.error("Network error. Please try again.");
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    className={`flex items-center gap-2 ${className || ""}`}
                    variant={variant}
                    onClick={onClick}
                    {...props}
                >
                    <UserPlus className="h-4 w-4" />
                    Add Contact
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="space-y-2">
                        <label htmlFor="phone_number" className="text-sm font-medium">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="note" className="text-sm font-medium">
                            Note
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            placeholder="Enter any additional notes"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="font-semibold py-1 px-4 rounded-md shadow-md transition-all duration-200 text-white cursor-pointer bg-gradient-to-b from-[#3C4BFF] to-[#242D99] hover:from-[#2a36c7] hover:to-[#4e5ed1] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Adding..." : "Add Contact"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
