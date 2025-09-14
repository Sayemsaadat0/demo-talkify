/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { WidgetApiResponseType } from "@/hooks/useGetChatWidget";
import { PLATFORM_CONFIGURE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

interface PlatformRestrictionProps {
  data: WidgetApiResponseType;
}

type PlatformValue = "mobile" | "desktop";
const ALL_PLATFORMS: PlatformValue[] = ["mobile", "desktop"];

// Simple, clean, and easy-to-read version
export default function PlatformRestriction({ data }: PlatformRestrictionProps) {
  const [restrictionFor, setRestrictionFor] = useState<"show" | "hide">("show");
  const [selected, setSelected] = useState<Record<PlatformValue, boolean>>({
    mobile: false,
    desktop: false,
  });
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state?.auth?.token);

  // Normalize platform list coming from API (array, JSON-string, or CSV)
  const parseList = (raw: unknown): string[] => {
    if (Array.isArray(raw)) return raw.map(String).map((s) => s.toLowerCase()).filter(Boolean);
    if (typeof raw === "string" && raw.trim() !== "") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.toLowerCase()).filter(Boolean);
      } catch {
        // fallthrough to CSV
      }
      return raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    const widget = data?.data?.widget as any;
    if (!widget) return;

    setRestrictionFor(widget.platform_restriction_for === "hide" ? "hide" : "show");
    const fromApi = parseList(widget?.platform_list);

    setSelected({
      mobile: fromApi.includes("mobile"),
      desktop: fromApi.includes("desktop"),
    });
  }, [data]);

  const toggle = (p: PlatformValue) => setSelected((prev) => ({ ...prev, [p]: !prev[p] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const platform_name = ALL_PLATFORMS.filter((p) => selected[p]);
    const payload = {
      platform_restriction: restrictionFor,
      platform_name,
    };

    fetch(PLATFORM_CONFIGURE_API, {
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
        console.error("Platform Restriction Save Failed:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Platform Restriction</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">Restriction mode</p>
          <div className="flex gap-6 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="platform_restriction_for"
                value="show"
                checked={restrictionFor === "show"}
                onChange={() => setRestrictionFor("show")}
                className="h-4 w-4"
              />
              Show only selected platforms
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="platform_restriction_for"
                value="hide"
                checked={restrictionFor === "hide"}
                onChange={() => setRestrictionFor("hide")}
                className="h-4 w-4"
              />
              Hide selected platforms
            </label>
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">Platforms</p>
          <div className="flex items-center gap-6 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.mobile}
                onChange={() => toggle("mobile")}
                className="h-4 w-4"
              />
              Mobile
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.desktop}
                onChange={() => toggle("desktop")}
                className="h-4 w-4"
              />
              Desktop
            </label>
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