/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { WidgetApiResponseType } from "@/hooks/useGetChatWidget";
import { X } from "lucide-react";
import { DOMAIN_CONFIGURE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

interface DomainRestrictionProps {
    data: WidgetApiResponseType;
}

// Simple, clean DomainRestriction with stable unique keys and minimal UI
export default function DomainRestriction({ data }: DomainRestrictionProps) {
    const [restrictionFor, setRestrictionFor] = useState<"show" | "hide">("show");
    const [domains, setDomains] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state?.auth?.token);

    // Stable ID list to avoid duplicate key warnings when editing values
    const rowIds = useMemo(() => domains.map((_, i) => `domain-row-${i}`), [domains]);

    // Normalize domain list from API (array, JSON-string, or CSV)
    const parseList = (raw: unknown): string[] => {
        if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
        if (typeof raw === "string" && raw.trim() !== "") {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
            } catch {
                // fallthrough to CSV
            }
            return raw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
        return [];
    };

    useEffect(() => {
        const widget = data?.data?.widget as any;
        if (!widget) return;

        setRestrictionFor(widget.domain_restriction_for === "hide" ? "hide" : "show");

        const list = parseList(widget?.domain_list);
        setDomains(list.length > 0 ? list : [""]);
    }, [data]);

    const updateDomain = (index: number, value: string) => {
        setDomains((prev) => prev.map((d, i) => (i === index ? value : d)));
    };

    const addDomain = () => setDomains((prev) => [...prev, ""]);
    const removeDomain = (index: number) => setDomains((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            domain_restriction: restrictionFor,
            domain_name: domains.map((d) => d.trim()).filter(Boolean),
        };

        // Submit to API
        fetch(DOMAIN_CONFIGURE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Application: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                toast.success(json.message);
            })
            .catch((err) => {
                console.error("Domain Restriction Save Failed:", err);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">Domain Restriction</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mode */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-800">Restriction mode</p>
                    <div className="flex gap-6 text-sm">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="radio"
                                name="domain_restriction_for"
                                value="show"
                                checked={restrictionFor === "show"}
                                onChange={() => setRestrictionFor("show")}
                                className="h-4 w-4"
                            />
                            Show only listed domains
                        </label>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="radio"
                                name="domain_restriction_for"
                                value="hide"
                                checked={restrictionFor === "hide"}
                                onChange={() => setRestrictionFor("hide")}
                                className="h-4 w-4"
                            />
                            Hide listed domains
                        </label>
                    </div>
                </div>

                {/* Domains */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">Domains</p>
                        <button
                            type="button"
                            onClick={addDomain}
                            className=" border border-gray-300 text-black hover:text-white transition-all  py-1 px-3 rounded-md hover:bg-indigo-700"
                        >
                            Add Domains
                        </button>
                    </div>

                    <div className="space-y-2">
                        {domains.map((value, idx) => (
                            <div key={rowIds[idx]} className="flex gap-2">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => updateDomain(idx, e.target.value)}
                                    placeholder="example.com"
                                    className="flex-1 border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                {domains.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDomain(idx)}
                                        className="text-sm text-gray-50 px-2 border rounded-md  bg-red-400 "
                                        aria-label="Remove domain"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </form>
        </div>
    );
}