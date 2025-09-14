/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect,  useState } from "react";
import { useGetWebHook } from "@/hooks/useGetWebHook";
import { Switch } from "@/components/ui/switch";
// import { Copy, Check } from "lucide-react";
import { WEBHOOK_CONFIGURE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

// Types for local form state (maps to API payload)
interface WebhookFormState {
    whatsapp_enabled: 0 | 1;
    whatsapp_number: string;
    telegram_enabled: 0 | 1;
    discord_enabled: 0 | 1;
    discord_webhook_url: string;
    messenger_enabled: 0 | 1;
    messenger_page_token: string;
    messenger_recipient_id: string;
    email_enabled: 0 | 1;
    message_template: string;
}

const WebHookConfigure = () => {
    const { data , refetch } = useGetWebHook(); // data?.settings, data?.link, data?.startLink, data?.telegramBot, data?.template
    console.log(data);
    const token = useSelector((state: RootState) => state?.auth?.token);

    const [saving, setSaving] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [form, setForm] = useState<WebhookFormState>({
        whatsapp_enabled: 0,
        whatsapp_number: "",
        telegram_enabled: 0,
        discord_enabled: 0,
        discord_webhook_url: "",
        messenger_enabled: 0,
        messenger_page_token: "",
        messenger_recipient_id: "",
        email_enabled: 0,
        message_template: "",
    });

    // Initialize form from API
    useEffect(() => {
        const s = data?.settings || data?.data?.settings;
        if (!s) return;

        setForm((prev) => ({
            ...prev,
            whatsapp_enabled: Number(s.whatsapp_enabled) === 1 ? 1 : 0,
            whatsapp_number: s.whatsapp_number ?? "",
            telegram_enabled: Number(s.telegram_enabled) === 1 ? 1 : 0,
            discord_enabled: Number(s.discord_enabled) === 1 ? 1 : 0,
            discord_webhook_url: s.discord_webhook_url ?? "",
            messenger_enabled: Number(s.messenger_enabled) === 1 ? 1 : 0,
            messenger_page_token: s.messenger_page_token ?? "",
            messenger_recipient_id: s.messenger_recipient_id ?? "",
            email_enabled: Number(s.email_enabled) === 1 ? 1 : 0,
            message_template: (s as any)?.message_template ?? (data as any)?.template ?? "",
        }));
    }, [data]);

    // // Template preview (supports raw text or JSON structure)
    // const { templateText, templateObj } = useMemo(() => {
    //     const raw = form.message_template || (data as any)?.template || "";
    //     if (raw && typeof raw === "string") {
    //         try {
    //             const parsed = JSON.parse(raw);
    //             if (parsed && typeof parsed === "object") {
    //                 return { templateText: "", templateObj: parsed as Record<string, unknown> };
    //             }
    //         } catch {
    //             // fallthrough to render as plain text
    //         }
    //     }
    //     return { templateText: String(raw || ""), templateObj: null as null | Record<string, unknown> };
    // }, [form.message_template, data]);

    const setToggle = (key: keyof WebhookFormState, value: boolean) => {
        setForm((p) => ({ ...p, [key]: value ? 1 : 0 } as WebhookFormState));
    };

    const handleChange = (
        key: keyof WebhookFormState,
        value: string
    ) => setForm((p) => ({ ...p, [key]: value }));

    const copyToClipboard = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
            toast.success("Copied to clipboard");
        } catch {
            toast.error("Failed to copy");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form };
            // return console.log('payload', payload);
            const res = await fetch(`${WEBHOOK_CONFIGURE_API}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Application: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
                // body: payload,
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            toast.success(json?.message || "Webhook settings saved");
            refetch()
        } catch (err) {
            console.error("Webhook Save Failed:", err);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const startLink: string | undefined = (data as any)?.startLink;
    const telegramBot: string | undefined = (data as any)?.telegramBot;

    return (
        <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Webhook Configure</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* WhatsApp */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">WhatsApp</p>
                            <p className="text-xs text-gray-500">Enable WhatsApp notifications</p>
                        </div>
                        <Switch
                            checked={form.whatsapp_enabled === 1}
                            onCheckedChange={(v) => setToggle("whatsapp_enabled", v)}
                        />
                    </div>
                    {form.whatsapp_enabled === 1 && (
                        <div className="grid gap-2">
                            <label className="text-sm text-gray-700">WhatsApp Number</label>
                            <input
                                type="text"
                                value={form.whatsapp_number}
                                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                                placeholder="01700000000"
                                className="border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    )}
                </section>

                {/* Telegram */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Telegram</p>
                            <p className="text-xs text-gray-500">Enable Telegram notifications</p>
                        </div>
                        <Switch
                            checked={form.telegram_enabled === 1}
                            onCheckedChange={(v) => setToggle("telegram_enabled", v)}
                        />
                    </div>

                    {form.telegram_enabled === 1 && (
                        <div className="grid gap-3">
                            {(telegramBot || startLink) && (
                                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 space-y-3">
                                    <p className="font-medium text-indigo-900">How to enable Telegram notifications</p>

                                    {/* Step 1 */}
                                    {telegramBot && (
                                        <div className="flex items-start gap-2 text-indigo-900">
                                            <span className="mt-0.5">✅</span>
                                            <p className="text-sm">
                                                <span className="font-medium">Step 1:</span> Add the bot
                                                <button
                                                    type="button"
                                                    className="ml-2 inline-flex items-center rounded border border-indigo-300 bg-white/80 px-2 py-0.5 text-xs font-medium text-indigo-800 hover:bg-white"
                                                    onClick={() => copyToClipboard(telegramBot, "telegramBot")}
                                                >
                                                    {copiedKey === "telegramBot" ? "Copied" : telegramBot}
                                                </button>
                                                to your Telegram group
                                            </p>
                                        </div>
                                    )}

                                    {/* Step 2 */}
                                    {startLink && (
                                        <div className="space-y-2 max-w-[250px] md:max-w-[600px]">
                                            <div className="flex items-start gap-2 text-indigo-900">
                                                <span className="mt-0.5">✅</span>
                                                <p className="text-sm"><span className="font-medium">Step 2:</span> Paste this in the group:</p>
                                            </div>
                                            {(() => {
                                                const text = startLink.startsWith("/start") ? startLink : `/start\n${startLink}`;
                                                return (
                                                    <div className="relative group">
                                                        <div
                                                            className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100 cursor-pointer"
                                                            onClick={() => copyToClipboard(text, "startLink")}
                                                        >
                                                            {copiedKey === "startLink" ? "Copied" : "Click to copy"}
                                                        </div>
                                                        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-md border border-indigo-200 bg-indigo-100 p-3 text-xs text-indigo-950">
{text}
                                                        </pre>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Step 3 */}
                                    <div className="flex items-start gap-2 text-indigo-900">
                                        <span className="mt-0.5">✅</span>
                                        <p className="text-sm">
                                            <span className="font-medium">Step 3:</span> You’re ready! Telegram will send a notification when a customer sends their first message in a conversation.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Discord */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Discord</p>
                            <p className="text-xs text-gray-500">Enable Discord notifications</p>
                        </div>
                        <Switch
                            checked={form.discord_enabled === 1}
                            onCheckedChange={(v) => setToggle("discord_enabled", v)}
                        />
                    </div>
                    {form.discord_enabled === 1 && (
                        <div className="grid gap-2">
                            <label className="text-sm text-gray-700">Discord Webhook URL</label>
                            <input
                                type="text"
                                value={form.discord_webhook_url}
                                onChange={(e) => handleChange("discord_webhook_url", e.target.value)}
                                placeholder="https://discord.com/api/webhooks/..."
                                className="border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">How to create a webhook:</span>
                                1. Open Discord → Server Settings → Integrations → Webhooks
                                2. Create new webhook and copy URL
                            </p>
                        </div>
                    )}
                </section>

                {/* Messenger */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Messenger (Facebook)</p>
                            <p className="text-xs text-gray-500">Enable Facebook Messenger notifications</p>
                        </div>
                        <Switch
                            checked={form.messenger_enabled === 1}
                            onCheckedChange={(v) => setToggle("messenger_enabled", v)}
                        />
                    </div>
                    {form.messenger_enabled === 1 && (
                        <div className="grid gap-3">
                            <div className="grid gap-1">
                                <label className="text-sm text-gray-700">Page Token</label>
                                <input
                                    type="text"
                                    value={form.messenger_page_token}
                                    onChange={(e) => handleChange("messenger_page_token", e.target.value)}
                                    className="border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm text-gray-700">Recipient ID</label>
                                <input
                                    type="text"
                                    value={form.messenger_recipient_id}
                                    onChange={(e) => handleChange("messenger_recipient_id", e.target.value)}
                                    className="border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Email */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-xs text-gray-500">Enable Email notifications</p>
                        </div>
                        <Switch
                            checked={form.email_enabled === 1}
                            onCheckedChange={(v) => setToggle("email_enabled", v)}
                        />
                    </div>
                </section>

                {/* Template Preview */}
                <section className="space-y-3">
                    <p className="font-medium">Message Template</p>
                    <textarea
                        value={form.message_template}
                        onChange={(e) => handleChange("message_template", e.target.value)}
                        placeholder="Type your template here. You can use placeholders like {{name}}."
                        rows={10}
                        className="w-full border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </section>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>
            </form>
        </div>
    );
};

export default WebHookConfigure;