"use client";

import React from "react";

type Tab = {
  id: string;
  title: string;
  key: string;
};

const tabs: Tab[] = [
  { id: "1", title: "Chat Widget", key: "chag-widget" },
  { id: "2", title: "Widget Stages", key: "widget-stages" },
  { id: "8", title: "Widget Appearance", key: "widget-appearance" },
  { id: "3", title: "Domain Restriction", key: "domain-restriction" },
  { id: "4", title: "Platform Restriction", key: "platform-restriction" },
  { id: "5", title: "Lead Collection", key: "lead-collection" },
  { id: "6", title: "Country Configure", key: "country-configure" },
  { id: "7", title: "Webhook Configure", key: "webhook-configure" },
];

interface ChatWidgetSidebarProps {
  activeTab: string;
  onSelectTab: (key: string) => void;
}

const ChatWidgetSidebar: React.FC<ChatWidgetSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="w-52 p-2 whitespace-nowrap flex flex-row  md:flex-col gap-2">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onSelectTab(tab.key)}
          className={`px-3 py-2 rounded-md hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer transition-colors ${
            activeTab === tab.key ? "bg-gray-200" : ""
          }`}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
};

export default ChatWidgetSidebar;
