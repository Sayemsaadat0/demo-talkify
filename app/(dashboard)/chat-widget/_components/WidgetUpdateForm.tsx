"use client";

import { CHAT_WIDGET_UPDATE_API } from "@/api/api";
import { WidgetApiResponseType } from "@/hooks/useGetChatWidget";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";




interface ChatWidgetCodeProps {
  property_id: string; // this will be dynamic
}

const ChatWidgetCode = ({ property_id }: ChatWidgetCodeProps) => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `
<script type="text/javascript">
  var Widget_API=Widget_API||{}, Widget_LoadStart=new Date();
  (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src="https://staging.talkify.pro/api/livechat/widget/${property_id}";
    s1.charset="UTF-8";
    s1.setAttribute("crossorigin","*");
    s0.parentNode.insertBefore(s1,s0);
  })();
</script>
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-900 text-blue-300 p-4 rounded-lg relative">
      <pre className="overflow-x-auto whitespace-pre-wrap break-words">
        {codeSnippet}
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};


















// Form state type
type FormState = {
  widget_name: string;
  header_color: string;
  widget_stage: string;
  widget_status: number; // 0/1 via switch
  help_status: number; // 0/1 via switch
  lead_status: number; // 0/1 via switch
  domain_restriction: number; // 0/1 via switch
  country_restriction: number; // 0/1 via switch
  platform_restriction: number; // 0/1 via switch
};

export default function WidgetUpdateForm({ data }: { data: WidgetApiResponseType }) {
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormState>({
    widget_name: "",
    header_color: "#000000",
    widget_stage: "",
    widget_status: 1,
    help_status: 0,
    lead_status: 1,
    domain_restriction: 0,
    country_restriction: 1,
    platform_restriction: 1,
  });

  const [loading, setLoading] = useState(false);

  // Populate initial values from API
  useEffect(() => {
    const w = data?.data?.widget;
    if (w) {
      setFormData({
        widget_name: w.widget_name || "",
        header_color: w.widget_appearance?.header_color || "#000000",
        widget_stage: w.widget_stage || "",
        widget_status: typeof w.widget_status === "number" ? w.widget_status : 1,
        help_status: typeof w.help_status === "number" ? w.help_status : 0,
        lead_status: typeof w.lead_status === "number" ? w.lead_status : 1,
        domain_restriction:
          typeof w.domain_restriction === "number" ? w.domain_restriction : 0,
        country_restriction:
          typeof w.country_restriction === "number"
            ? w.country_restriction
            : 1,
        platform_restriction:
          typeof w.platform_restriction === "number"
            ? w.platform_restriction
            : 1,
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const response = await fetch(CHAT_WIDGET_UPDATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success(result.message);
    } catch (error) {
      console.error("❌ Submit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="max-w-[350px] space-y-5 absolute right-0">
        <h2 className="text-xl font-bold">Chat Widget Script</h2>
        <ChatWidgetCode property_id={user?.active_property?.property_id || ""} />

      </div>
      <div className="max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Chat Widget Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Widget Name */}
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Widget Name</h3>
              <p className="text-xs text-gray-500">Give your widget a recognizable name.</p>
              <p className="text-xs text-gray-400">This name is only visible in your dashboard, not to end users.</p>
            </div>
            <input
              type="text"
              name="widget_name"
              value={formData.widget_name}
              onChange={handleChange}
              className="border bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-400"
              placeholder="Enter widget name"
            />
            <p className="border bg-white/50 cursor-not-allowed rounded-lg px-3 py-2 text-sm">
              {data?.data?.widget?.widget_id}
            </p>
          </div>

          {/* Header Color with Custom Picker */}
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Header Color</h3>
              <p className="text-xs text-gray-500">Choose the header background color for your chat widget.</p>
              <p className="text-xs text-gray-400">
                You can select a color or type a hex code (e.g. <span className="font-mono">#ff0000</span>).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer">
                <input
                  type="color"
                  name="header_color"
                  value={formData.header_color}
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-9 h-9 rounded-lg border shadow-sm" style={{ backgroundColor: formData.header_color }}></div>
              </label>

              <input
                type="text"
                name="header_color"
                value={formData.header_color}
                onChange={handleChange}
                className="flex-1 border bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-400"
                placeholder="#ff0000"
              />
            </div>
          </div>

          {/* Switches for numeric fields */}
          <div className="space-y-4">
            {/* Widget Status */}
            <div className="space-y-2 border-b pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Widget Status</h3>
              <p className="text-xs text-gray-500">Enable or disable the widget globally.</p>
              <p className="text-xs text-gray-400">When Off, the widget will not appear anywhere, regardless of other settings. When On, visibility still depends on restriction rules below.</p>
              <div className="flex items-center gap-3 relative">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="widget_status"
                    checked={formData.widget_status === 1}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, widget_status: prev.widget_status === 1 ? 0 : 1 }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">{formData.widget_status === 1 ? "On" : "Off"}</span>
              </div>
            </div>

            {/* Help Status */}
            <div className="space-y-2 border-b pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Help</h3>
              <p className="text-xs text-gray-500">Toggle help section availability in the widget.</p>
              <p className="text-xs text-gray-400">Controls the Help tab/content in your widget. If disabled, help content will be hidden even if configured elsewhere.</p>
              <div className="flex items-center gap-3 relative">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="help_status"
                    checked={formData.help_status === 1}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, help_status: prev.help_status === 1 ? 0 : 1 }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">{formData.help_status === 1 ? "On" : "Off"}</span>
              </div>
            </div>

            {/* Lead Status */}
            <div className="space-y-2 border-b pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Lead</h3>
              <p className="text-xs text-gray-500">Enable or disable lead collection in the widget.</p>
              <p className="text-xs text-gray-400">When enabled, the widget may show forms or prompts to capture visitor information. Turning this off disables lead capture UI and submissions.</p>
              <div className="flex items-center gap-3 relative">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="lead_status"
                    checked={formData.lead_status === 1}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, lead_status: prev.lead_status === 1 ? 0 : 1 }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">{formData.lead_status === 1 ? "On" : "Off"}</span>
              </div>
            </div>

            {/* Domain Restriction */}
            <div className="space-y-2 border-b pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Domain Restriction</h3>
              <p className="text-xs text-gray-500">Restrict widget visibility based on allowed domains.</p>
              <p className="text-xs text-gray-400">When Enabled, the widget renders only on domains you specify in settings (e.g., example.com). Keep Off to allow all domains.</p>
              <div className="flex items-center gap-3 relative">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="domain_restriction"
                    checked={formData.domain_restriction === 1}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, domain_restriction: prev.domain_restriction === 1 ? 0 : 1 }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">{formData.domain_restriction === 1 ? "On" : "Off"}</span>
              </div>
            </div>

            {/* Country Restriction */}
            <div className="space-y-2 border-b pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Country Restriction</h3>
              <p className="text-xs text-gray-500">Restrict widget visibility for specific countries.</p>
              <p className="text-xs text-gray-400">When Enabled, the widget uses visitor IP geolocation to show/hide by country based on your allow/block list.</p>
              <div className="flex items-center gap-3 relative">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="country_restriction"
                    checked={formData.country_restriction === 1}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, country_restriction: prev.country_restriction === 1 ? 0 : 1 }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">{formData.country_restriction === 1 ? "On" : "Off"}</span>
              </div>
            </div>

            {/* Platform Restriction */}
            <div className="space-y-2 border-b pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Platform Restriction</h3>
              <p className="text-xs text-gray-500">Restrict widget visibility on certain platforms or devices.</p>
              <p className="text-xs text-gray-400">When Enabled, you can limit the widget to desktop or mobile (or specific browsers) based on your platform list.</p>
              <div className="flex items-center gap-3 relative">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="platform_restriction"
                    checked={formData.platform_restriction === 1}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, platform_restriction: prev.platform_restriction === 1 ? 0 : 1 }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">{formData.platform_restriction === 1 ? "On" : "Off"}</span>
              </div>
            </div>
          </div>

          {/* Widget Stage (kept) */}
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Widget Stage</h3>
              <p className="text-xs text-gray-500">Set the widget status to online or offline.</p>
              <p className="text-xs text-gray-400">This controls whether the widget is active for end users.</p>
            </div>
            <select
              name="widget_stage"
              value={formData.widget_stage}
              onChange={handleChange}
              className="border bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-400"
            >
              <option value="">Select status</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}