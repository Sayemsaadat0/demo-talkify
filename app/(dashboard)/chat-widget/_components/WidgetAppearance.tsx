"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { WIDGET_APPEARANCE_API } from "@/api/api";
import type { WidgetApiResponseType } from "@/hooks/useGetChatWidget";
import { Upload, X } from "lucide-react";
import ChatAppearance from "./ChatAppearance";

interface WidgetAppearanceProps {
    data: WidgetApiResponseType;
}

type FormState = {
    header_color: string;
    header_text_color: string;
    agent_message_color: string;
    agent_text_color: string;
    visitor_message_color: string;
    visitor_text_color: string;
    position: "left" | "right";
    home_first_text: string;
    home_first_text_color: string;
    home_second_text: string;
    home_second_text_color: string;
    home_bg_color: string;
    use_home_bg_image: boolean;
};

const WidgetAppearance = ({ data }: WidgetAppearanceProps) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const appearance = data?.data?.widget?.widget_appearance;

    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<FormState>({
        header_color: appearance?.header_color ?? "#ff6500",
        header_text_color: appearance?.header_text_color ?? "#000000",
        agent_message_color: appearance?.agent_message_color ?? "#f5f5f5",
        agent_text_color: appearance?.agent_text_color ?? "#333333",
        visitor_message_color: appearance?.visitor_message_color ?? "#eeeeee",
        visitor_text_color: appearance?.visitor_text_color ?? "#222222",
        position: (appearance?.position as "left" | "right") ?? "right",
        home_first_text: appearance?.home_first_text ?? "Welcome!",
        home_first_text_color: appearance?.home_first_text_color ?? "#111111",
        home_second_text: appearance?.home_second_text ?? "How can we help?",
        home_second_text_color: appearance?.home_second_text_color ?? "#444444",
        home_bg_color: appearance?.home_bg_color ?? "#fafafa",
        use_home_bg_image:
            appearance?.use_home_bg_image === "0"
                ? false
                : appearance?.use_home_bg_image === "1"
                    ? true
                    : true, // default to true as requested
    });

    // Home background image upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [homeBgImage, setHomeBgImage] = useState<File | null>(null);
    const [homeBgPreview, setHomeBgPreview] = useState<string | null>(
        appearance?.home_bg_img ?? null
    );

    // Create a full URL for image if backend returns only a path
    const getImageUrl = useMemo(() => {
        return (imagePath: string | null) => {
            if (!imagePath) return null;
            if (/^(https?:\/\/|data:)/i.test(imagePath)) return imagePath;
            return API_BASE_URL ? `${API_BASE_URL}/assets/upload/${imagePath}` : imagePath;
        };
    }, [API_BASE_URL]);

    // Keep local state in sync if the parent provides fresh data
    useEffect(() => {
        if (!appearance) return;
        setForm((prev) => ({
            ...prev,
            header_color: appearance.header_color ?? prev.header_color,
            header_text_color: appearance.header_text_color ?? prev.header_text_color,
            agent_message_color: appearance.agent_message_color ?? prev.agent_message_color,
            agent_text_color: appearance.agent_text_color ?? prev.agent_text_color,
            visitor_message_color: appearance.visitor_message_color ?? prev.visitor_message_color,
            visitor_text_color: appearance.visitor_text_color ?? prev.visitor_text_color,
            position: (appearance.position as "left" | "right") ?? prev.position,
            home_first_text: appearance.home_first_text ?? prev.home_first_text,
            home_first_text_color: appearance.home_first_text_color ?? prev.home_first_text_color,
            home_second_text: appearance.home_second_text ?? prev.home_second_text,
            home_second_text_color: appearance.home_second_text_color ?? prev.home_second_text_color,
            home_bg_color: appearance.home_bg_color ?? prev.home_bg_color,
            use_home_bg_image:
                appearance.use_home_bg_image === "0"
                    ? false
                    : appearance.use_home_bg_image === "1"
                        ? true
                        : prev.use_home_bg_image,
        }));
        setHomeBgPreview(appearance.home_bg_img ?? null);
    }, [appearance]);

    const onColorChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((p) => ({ ...p, [key]: value }));
    };

    const onTextChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((p) => ({ ...p, [key]: value }));
    };

    const onPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm((p) => ({ ...p, position: e.target.value as "left" | "right" }));
    };

    const onToggleBgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, use_home_bg_image: e.target.checked }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setHomeBgImage(file);

        const reader = new FileReader();
        reader.onload = (ev) => setHomeBgPreview((ev.target?.result as string) || null);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setHomeBgImage(null);
        setHomeBgPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("You are not authenticated");
            return;
        }

        try {
            setSubmitting(true);
            const submittedData = new FormData();

            submittedData.append("header_color", form.header_color);
            submittedData.append("header_text_color", form.header_text_color);
            submittedData.append("agent_message_color", form.agent_message_color);
            submittedData.append("agent_text_color", form.agent_text_color);
            submittedData.append("visitor_message_color", form.visitor_message_color);
            submittedData.append("visitor_text_color", form.visitor_text_color);
            submittedData.append("position", form.position);
            submittedData.append("home_first_text", form.home_first_text);
            submittedData.append("home_first_text_color", form.home_first_text_color);
            submittedData.append("home_second_text", form.home_second_text);
            submittedData.append("home_second_text_color", form.home_second_text_color);
            submittedData.append("home_bg_color", form.home_bg_color);
            submittedData.append("use_home_bg_image", form.use_home_bg_image ? "1" : "0");

            if (homeBgImage) submittedData.append("home_bg_img", homeBgImage);

            const response = await fetch(WIDGET_APPEARANCE_API, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submittedData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result?.status) {
                toast.success(result?.message || "Appearance updated successfully");
            } else {
                toast.error(result?.message || "Failed to update appearance");
            }
        } catch (err) {
            console.error("Widget appearance update failed:", err);
            toast.error("An error occurred while updating appearance");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex relative flex-col-reverse md:flex-row gap-2 ">
            <div className="max-w-xl space-y-3">
                <p className="text-xl ">Widget Appearance </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Colors section */}
                    <div className="p-5 rounded-2xl  bg-white shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Header</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Header color</label>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <input
                                        type="color"
                                        value={form.header_color}
                                        onChange={onColorChange("header_color")}
                                        className="h-11 w-11 p-1 border rounded-md"
                                        aria-label="Header color"
                                        disabled={submitting}
                                    />
                                    <input
                                        type="text"
                                        value={form.header_color}
                                        onChange={onColorChange("header_color")}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Header text color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.header_text_color}
                                        onChange={onColorChange("header_text_color")}
                                        className="h-11 w-11 p-1 border rounded-md"
                                        aria-label="Header text color"
                                        disabled={submitting}
                                    />
                                    <input
                                        type="text"
                                        value={form.header_text_color}
                                        onChange={onColorChange("header_text_color")}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Agent message color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.agent_message_color} onChange={onColorChange("agent_message_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.agent_message_color} onChange={onColorChange("agent_message_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Agent text color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.agent_text_color} onChange={onColorChange("agent_text_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.agent_text_color} onChange={onColorChange("agent_text_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Visitor message color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.visitor_message_color} onChange={onColorChange("visitor_message_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.visitor_message_color} onChange={onColorChange("visitor_message_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Visitor text color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.visitor_text_color} onChange={onColorChange("visitor_text_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.visitor_text_color} onChange={onColorChange("visitor_text_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Home screen</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Home first text</label>
                                <input type="text" value={form.home_first_text} onChange={onTextChange("home_first_text")} placeholder="Welcome!" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-white" disabled={submitting} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Home first text color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.home_first_text_color} onChange={onColorChange("home_first_text_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.home_first_text_color} onChange={onColorChange("home_first_text_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Home second text</label>
                                <input type="text" value={form.home_second_text} onChange={onTextChange("home_second_text")} placeholder="How can we help?" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-white" disabled={submitting} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Home second text color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.home_second_text_color} onChange={onColorChange("home_second_text_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.home_second_text_color} onChange={onColorChange("home_second_text_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Home background color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={form.home_bg_color} onChange={onColorChange("home_bg_color")} className="h-11 w-11 p-1 border rounded-md"
                                        disabled={submitting} />
                                    <input type="text" value={form.home_bg_color} onChange={onColorChange("home_bg_color")} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={submitting} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Position</label>
                                <select value={form.position} onChange={onPositionChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-white" disabled={submitting}>
                                    <option value="right">Right</option>
                                    <option value="left">Left</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Background Image */}
                    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Home background image</h3>
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={form.use_home_bg_image} onChange={onToggleBgImage} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" disabled={submitting} />
                                <span className="text-sm text-gray-700">Use background image</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl w-full max-w-[280px] aspect-square shadow  border border-gray-100">
                                <div className={`relative ${form.use_home_bg_image ? "opacity-100" : "opacity-50"}`}>
                                    {homeBgPreview ? (
                                        <>
                                            <Image
                                                width={400}
                                                height={400}
                                                src={getImageUrl(homeBgPreview) as string}
                                                alt="Home background preview"
                                                className="w-full h-48 object-cover rounded-xl shadow-md cursor-pointer"
                                                onClick={() => fileInputRef.current?.click()}
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage();
                                                    }}
                                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    disabled={submitting}
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        fileInputRef.current?.click();
                                                    }}
                                                    className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs"
                                                    disabled={submitting}
                                                >
                                                    Upload New
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 flex items-center justify-center flex-col aspect-square border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100 rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
                                        >
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                                            <p className="text-sm font-medium text-indigo-600">Click to upload image</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={!form.use_home_bg_image || submitting} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Tip: If you enable background image, it will appear behind the home screen content. You can still set a fallback background color which shows while the image loads.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Save appearance"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="md:fixed right-10 bottom-10">
              <ChatAppearance
                header_color={form.header_color}
                header_text_color={form.header_text_color}
                agent_message_color={form.agent_message_color}
                agent_text_color={form.agent_text_color}
                visitor_message_color={form.visitor_message_color}
                visitor_text_color={form.visitor_text_color}
                home_bg_color={form.home_bg_color}
                use_home_bg_image={form.use_home_bg_image}
                home_bg_image_url={getImageUrl(homeBgPreview)}
              />
            </div>
        </div>
    );
};

export default WidgetAppearance;