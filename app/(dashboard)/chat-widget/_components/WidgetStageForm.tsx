"use client";

import { CHAT_WIDGET_CONTENT_UPDATE_SAVE_API } from "@/api/api";
import { WidgetApiResponseType } from "@/hooks/useGetChatWidget";
import { RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import WebStageChatBox from "./WebStageChatBox";

interface WidgetStageFormProps {
  data: WidgetApiResponseType;
}

export default function WidgetStageForm({ data }: WidgetStageFormProps) {
  const { token } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    widget_stage: "online",
    // toggles
    heading_text_status: "on",
    text_content_status: "on",
    kb_search_status: "on",
    chat_btn_status: "on",
    water_mark_show: "off",
    // texts
    heading_text: "Welcome",
    text_content: "Search our Knowledge Base or start a chat",
    kb_search: "Search here...",
    chat_btn: "New Conversation",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.data?.widget) {
      const w = data.data.widget;
      const c = w?.widget_content || {};
      setFormData((prev) => ({
        ...prev,
        widget_stage: w?.widget_stage || "online",
        // toggles
        heading_text_status: c?.heading_text_status || "off",
        text_content_status: c?.text_content_status || "off",
        kb_search_status: c?.kb_search_status || "off",
        chat_btn_status: c?.chat_btn_status || "off",
        water_mark_show: c?.water_mark_show || "off",
        // texts
        heading_text: c?.heading_text ?? prev.heading_text,
        text_content: c?.text_content ?? prev.text_content,
        kb_search: c?.kb_search ?? prev.kb_search,
        chat_btn: c?.chat_btn ?? prev.chat_btn,
      }));
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
      const response = await fetch(CHAT_WIDGET_CONTENT_UPDATE_SAVE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${token}`,
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
    <div className="flex flex-col-reverse md:flex-row gap-5 mt-5">
      <div className="max-w-sm border-r pr-5">
        <div className="space-y-3 mb-6">
          <h2 className="text-xl font-bold">Widget Stage Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Widget Stage */}
          <div className="flex flex-col border-b pb-3 gap-2">
            <div className="">
              <h3 className="text-sm font-semibold text-gray-800">Widget Stage</h3>
              <p className="text-xs text-gray-500">
                Set the widget status to online or away. This determines whether the widget is actively displayed or hidden for your visitors.
              </p>

            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="widget_stage"
                  value="online"
                  checked={formData.widget_stage === "online"}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                Online
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="widget_stage"
                  value="away"
                  checked={formData.widget_stage === "away"}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                Away
              </label>
            </div>
          </div>

          {/* Heading Text Status */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Heading Text</h3>
              <p className="text-xs text-gray-500">
                This heading can be used to welcome users or provide instructions.<br />
                Enabling this ensures that users see a clear message when they open the chat.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="heading_text_status"
                  checked={formData.heading_text_status === "on"}
                  onChange={() =>
                    setFormData({ ...formData, heading_text_status: formData.heading_text_status === "on" ? "off" : "on" })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-xs font-medium text-gray-700">
                {formData.heading_text_status === "on" ? "On" : "Off"}
              </span>
            </div>
            {formData.heading_text_status === "on" && (
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">Heading text</label>
                <input
                  type="text"
                  name="heading_text"
                  value={formData.heading_text}
                  onChange={handleChange}
                  className="w-full border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>

          {/* Text Content Status */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Text Content</h3>
              <p className="text-xs text-gray-500">
                The text content can include instructions, greetings, or guidance for your visitors.<br />
                Turning it off will hide all default messages in the widget body.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="text_content_status"
                  checked={formData.text_content_status === "on"}
                  onChange={() =>
                    setFormData({ ...formData, text_content_status: formData.text_content_status === "on" ? "off" : "on" })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-xs font-medium text-gray-700">
                {formData.text_content_status === "on" ? "On" : "Off"}
              </span>
            </div>
            {formData.text_content_status === "on" && (
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">Body text</label>
                <textarea
                  name="text_content"
                  value={formData.text_content}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>

          {/* KB Search Status */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">KB Search</h3>
              <p className="text-xs text-gray-500">
                When enabled, visitors can search your knowledge base articles directly from the chat widget.<br />
                Disable this if you want a simpler chat interface.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="kb_search_status"
                  checked={formData.kb_search_status === "on"}
                  onChange={() =>
                    setFormData({ ...formData, kb_search_status: formData.kb_search_status === "on" ? "off" : "on" })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-xs font-medium text-gray-700">
                {formData.kb_search_status === "on" ? "On" : "Off"}
              </span>
            </div>
            {formData.kb_search_status === "on" && (
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">Search placeholder</label>
                <input
                  type="text"
                  name="kb_search"
                  value={formData.kb_search}
                  onChange={handleChange}
                  className="w-full border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>

          {/* Chat Button Status */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Chat Button</h3>
              <p className="text-xs text-gray-500">
                If enabled, visitors will see a button to initiate a chat.<br />
                Turning it off hides the button, and the chat can only be triggered programmatically.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="chat_btn_status"
                  checked={formData.chat_btn_status === "on"}
                  onChange={() =>
                    setFormData({ ...formData, chat_btn_status: formData.chat_btn_status === "on" ? "off" : "on" })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-xs font-medium text-gray-700">
                {formData.chat_btn_status === "on" ? "On" : "Off"}
              </span>
            </div>
            {formData.chat_btn_status === "on" && (
              <div className="grid gap-1">
                <label className="text-xs text-gray-600">Button label</label>
                <input
                  type="text"
                  name="chat_btn"
                  value={formData.chat_btn}
                  onChange={handleChange}
                  className="w-full border bg-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
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

      <div className="w-full h-full">
        <WebStageChatBox
          widget_stage={formData.widget_stage as "online" | "away"}
          heading_text_status={formData.heading_text_status as "on" | "off"}
          text_content_status={formData.text_content_status as "on" | "off"}
          kb_search_status={formData.kb_search_status as "on" | "off"}
          chat_btn_status={formData.chat_btn_status as "on" | "off"}
          water_mark_show={formData.water_mark_show as "on" | "off"}
          heading_text={formData.heading_text}
          text_content={formData.text_content}
          kb_search={formData.kb_search}
          chat_btn={formData.chat_btn}
        />
      </div>
    </div>
  );
}
