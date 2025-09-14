'use-client'

import { setUser } from "@/redux/features/authSlice";
import { RootState } from "@/redux/store";
import { Upload, UserIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface ProfileFormData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string | null;
    country: string;
    state: string | null;
    city: string | null;
    zip_code: string | null;
    address_one: string | null;
    address_two: string | null;
    image: File | null;
}

const ProfileForm = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: RootState) => state.auth);

    const [submitting, setSubmitting] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ProfileFormData>({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        phone: null,
        country: "",
        state: null,
        city: null,
        zip_code: null,
        address_one: null,
        address_two: null,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Create a full URL for image if backend returns only a path
    const getImageUrl = useMemo(() => {
        return (imagePath: string | null) => {
            if (!imagePath) return null;
            if (/^(https?:\/\/|data:)/i.test(imagePath)) return imagePath;
            // Fallback for relative storage path
            return API_BASE_URL ? `${API_BASE_URL}/assets/upload/${imagePath}` : imagePath;
        };
    }, [API_BASE_URL]);

    // Initialize form data from redux user
    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || null,
                country: user.country || "",
                state: user.state || null,
                city: user.city || null,
                zip_code: user.zip_code || null,
                address_one: user.address_one || null,
                address_two: user.address_two || null,
                image: null,
            });

            // Prefer user.image if valid
            if (
                user.image &&
                typeof user.image === "string" &&
                user.image.trim() !== "" &&
                user.image.toLowerCase() !== "null"
            ) {
                setImagePreview(user.image);
            } else {
                setImagePreview(null);
            }
        }
    }, [user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validateForm = () => {
        if (!formData.firstname.trim()) {
            toast.error("First name is required");
            return false;
        }
        if (!formData.lastname.trim()) {
            toast.error("Last name is required");
            return false;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }
        return true;
    };

    // Update profile with image upload support
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (!token) {
            toast.error("You are not authenticated");
            return;
        }

        setSubmitting(true);
        try {
            const submittedData = new FormData();
            submittedData.append("firstname", formData.firstname);
            submittedData.append("lastname", formData.lastname);
            submittedData.append("username", formData.username);
            submittedData.append("email", formData.email);
            submittedData.append("phone", formData.phone ?? "");
            submittedData.append("country", formData.country);
            submittedData.append("state", formData.state ?? "");
            submittedData.append("city", formData.city ?? "");
            submittedData.append("zip_code", formData.zip_code ?? "");
            submittedData.append("address_one", formData.address_one ?? "");
            submittedData.append("address_two", formData.address_two ?? "");

            if (formData.image) submittedData.append("image", formData.image);

            // TODO: Replace with the correct backend route once available in api.ts
            const PROFILE_UPDATE_API = API_BASE_URL
                ? `${API_BASE_URL}/api/frontend/profile/update`
                : "/api/frontend/profile/update";

            const response = await fetch(PROFILE_UPDATE_API, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submittedData,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result?.status) {
                toast.success(result?.message || "Profile updated successfully");
                // Expecting `result.data.user` to be updated user shape
                if (result?.data?.user) {
                    dispatch(setUser({ user: result.data.user, token }));
                    // Reset image file after successful update but keep preview
                    setFormData((prev) => ({ ...prev, image: null }));
                }
            } else {
                toast.error(result?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error("An error occurred while updating the profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 p-2">
            {!user ? (
                <div className="py-16 text-center text-gray-500">Sign in to view profile</div>
            ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Image card */}
                    <div className="bg-white rounded-2xl w-full max-w-[250px] aspect-square shadow p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-indigo-600" />
                            Profile Image
                        </h3>

                        <div className="relative">
                            {imagePreview ? (
                                <>
                                    <Image
                                        width={400}
                                        height={400}
                                        src={getImageUrl(imagePreview) as string}
                                        alt="Profile preview"
                                        className="w-full h-48 object-cover rounded-xl shadow-md cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()} // click on image opens file input
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {/* Remove Image Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent triggering parent click
                                                removeImage();
                                            }}
                                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>

                                        {/* Upload New Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent triggering parent click
                                                fileInputRef.current?.click();
                                            }}
                                            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs"
                                        >
                                            Upload New
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Show upload placeholder only if no image
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 flex items-center justify-center flex-col aspect-square border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100 rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
                                >
                                    <Upload className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                                    <p className="text-sm font-medium text-indigo-600">Click to upload image</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Details card */}
                    <div className="p-5 rounded-2xl bg-white">
                        <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            <div className="space-y-2">
                                <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700">
                                    First name *
                                </label>
                                <input
                                    id="firstname"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter first name"
                                    disabled={submitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastname" className="block text-sm font-semibold text-gray-700">
                                    Last name *
                                </label>
                                <input
                                    id="lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter last name"
                                    disabled={submitting}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter username"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter email"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                    Phone
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter phone"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="country" className="block text-sm font-semibold text-gray-700">
                                    Country
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter country"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
                                    State
                                </label>
                                <input
                                    id="state"
                                    name="state"
                                    value={formData.state ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter state"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                                    City
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    value={formData.city ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter city"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="zip_code" className="block text-sm font-semibold text-gray-700">
                                    Zip code
                                </label>
                                <input
                                    id="zip_code"
                                    name="zip_code"
                                    value={formData.zip_code ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter zip code"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2 ">
                                <label htmlFor="address_one" className="block text-sm font-semibold text-gray-700">
                                    Address line 1
                                </label>
                                <input
                                    id="address_one"
                                    name="address_one"
                                    value={formData.address_one ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter address line 1"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2 ">
                                <label htmlFor="address_two" className="block text-sm font-semibold text-gray-700">
                                    Address line 2
                                </label>
                                <input
                                    id="address_two"
                                    name="address_two"
                                    value={formData.address_two ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Enter address line 2"
                                    disabled={submitting}
                                />
                            </div>

                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}
export default ProfileForm