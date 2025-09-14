/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { WidgetApiResponseType, LeadSettings } from "@/hooks/useGetChatWidget";
import { Switch } from "@/components/ui/switch";
import { LEAD_CONFIGURE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

interface LeadCollectionProps {
  data: WidgetApiResponseType;
}

const defaultLeadSettings: LeadSettings = {
  name: { label_name: "Name", name_active_status: 0, name_required_status: 0 },
  email: { label_name: "Email Address", email_active_status: 0, email_required_status: 0 },
  phone: { label_name: "Phone Number", phone_active_status: 0, phone_required_status: 0 },
  address: { label_name: "Address", address_active_status: 0, address_required_status: 0 },
};

// Robust parser in case API returns stringified JSON or partial objects
function parseLeadSettings(raw: unknown): LeadSettings {
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!obj || typeof obj !== "object") return defaultLeadSettings;

    const safe = { ...defaultLeadSettings } as LeadSettings;

    const src: any = obj;
    if (src.name) {
      safe.name = {
        label_name: src.name.label_name ?? safe.name.label_name,
        name_active_status: Number(src.name.name_active_status ?? safe.name.name_active_status),
        name_required_status: Number(src.name.name_required_status ?? safe.name.name_required_status),
      };
    }
    if (src.email) {
      safe.email = {
        label_name: src.email.label_name ?? safe.email.label_name,
        email_active_status: Number(src.email.email_active_status ?? safe.email.email_active_status),
        email_required_status: Number(src.email.email_required_status ?? safe.email.email_required_status),
      };
    }
    if (src.phone) {
      safe.phone = {
        label_name: src.phone.label_name ?? safe.phone.label_name,
        phone_active_status: Number(src.phone.phone_active_status ?? safe.phone.phone_active_status),
        phone_required_status: Number(src.phone.phone_required_status ?? safe.phone.phone_required_status),
      };
    }
    if (src.address) {
      safe.address = {
        label_name: src.address.label_name ?? safe.address.label_name,
        address_active_status: Number(src.address.address_active_status ?? safe.address.address_active_status),
        address_required_status: Number(src.address.address_required_status ?? safe.address.address_required_status),
      };
    }

    return safe;
  } catch {
    return defaultLeadSettings;
  }
}

export default function LeadCollection({ data }: LeadCollectionProps) {
  const [leadStatus, setLeadStatus] = useState<number>(0);
  const [leadSettings, setLeadSettings] = useState<LeadSettings>(defaultLeadSettings);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state?.auth?.token);

  useEffect(() => {
    const widget = data?.data?.widget as any;
    if (!widget) return;

    setLeadStatus(Number(widget?.lead_status ?? 0));
    setLeadSettings(parseLeadSettings(widget?.lead_settings));
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      lead_status: leadStatus,
      name_active_status: leadSettings.name.name_active_status,
      name_required_status: leadSettings.name.name_required_status,
      email_active_status: leadSettings.email.email_active_status,
      email_required_status: leadSettings.email.email_required_status,
      phone_active_status: leadSettings.phone.phone_active_status,
      phone_required_status: leadSettings.phone.phone_required_status,
      address_active_status: leadSettings.address.address_active_status,
      address_required_status: leadSettings.address.address_required_status,
    };

    fetch(LEAD_CONFIGURE_API, {
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
        console.error("Lead Configure Save Failed:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Lead Collection</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global enable/disable */}
        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <p className="text-sm font-medium text-gray-800">Enable lead collection</p>
            <p className="text-xs text-gray-500">Controls whether lead collection is active.</p>
          </div>
          <Switch
            checked={leadStatus === 1}
            onCheckedChange={(checked) => setLeadStatus(checked ? 1 : 0)}
          />
        </div>

        {/* Sections */}
        <Section
          title="Name"
          label={leadSettings.name.label_name}
          active={leadSettings.name.name_active_status === 1}
          required={leadSettings.name.name_required_status === 1}
          onActiveChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              name: { ...prev.name, name_active_status: checked ? 1 : 0 },
            }))
          }
          onRequiredChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              name: { ...prev.name, name_required_status: checked ? 1 : 0 },
            }))
          }
        />

        <Section
          title="Email"
          label={leadSettings.email.label_name}
          active={leadSettings.email.email_active_status === 1}
          required={leadSettings.email.email_required_status === 1}
          onActiveChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              email: { ...prev.email, email_active_status: checked ? 1 : 0 },
            }))
          }
          onRequiredChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              email: { ...prev.email, email_required_status: checked ? 1 : 0 },
            }))
          }
        />

        <Section
          title="Phone"
          label={leadSettings.phone.label_name}
          active={leadSettings.phone.phone_active_status === 1}
          required={leadSettings.phone.phone_required_status === 1}
          onActiveChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              phone: { ...prev.phone, phone_active_status: checked ? 1 : 0 },
            }))
          }
          onRequiredChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              phone: { ...prev.phone, phone_required_status: checked ? 1 : 0 },
            }))
          }
        />

        <Section
          title="Address"
          label={leadSettings.address.label_name}
          active={leadSettings.address.address_active_status === 1}
          required={leadSettings.address.address_required_status === 1}
          onActiveChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              address: { ...prev.address, address_active_status: checked ? 1 : 0 },
            }))
          }
          onRequiredChange={(checked) =>
            setLeadSettings((prev) => ({
              ...prev,
              address: { ...prev.address, address_required_status: checked ? 1 : 0 },
            }))
          }
        />

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

function Section({
  title,
  label,
  active,
  required,
  onActiveChange,
  onRequiredChange,
}: {
  title: string;
  label: string;
  active: boolean;
  required: boolean;
  onActiveChange: (checked: boolean) => void;
  onRequiredChange: (checked: boolean) => void;
}) {
  return (
    <div className="border rounded-md p-3 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between border rounded-md p-2">
          <span className="text-sm">Active</span>
          <Switch checked={active} onCheckedChange={onActiveChange} />
        </div>
        <div className="flex items-center justify-between border rounded-md p-2">
          <span className="text-sm">Required</span>
          <Switch checked={required} onCheckedChange={onRequiredChange} />
        </div>
      </div>
    </div>
  );
}