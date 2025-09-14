'use client'
import React, { useState } from "react"
import ChatWidgetSidebar from "./_components/ChatWidgetSidebar"
import { Settings } from "lucide-react"
import { useChatGetWidget } from "@/hooks/useGetChatWidget"
import { CHAT_WIDGET_RESET_API } from "@/api/api"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import toast from "react-hot-toast"
// import { usePropertyAccess } from "@/hooks/usePropertyAccess"
// import { PropertyAccessDenied } from "@/components/dashboard/PropertyAccessDenied"
import WidgetUpdateForm from "./_components/WidgetUpdateForm"
import WidgetStageForm from "./_components/WidgetStageForm"
import DomainRestriction from "./_components/DomainRestriction"
import PlatformRestriction from "./_components/PlatformRestriction"
import LeadCollection from "./_components/LeadCollection"
import CountryConfigure from "./_components/CountryConfigure"
import WebHookConfigure from "./_components/WebHookConfigure"
import WidgetAppearance from "./_components/WidgetAppearance"

const ChatWidgetPage = () => {
  const [reseting, setReseting] = useState(false)
  const [activeTab, setActiveTab] = useState("chag-widget") // default tab
  const { refetch, data } = useChatGetWidget()
  const { token } = useSelector((state: RootState) => state.auth)
  
  // Property access check - commented out for today
  // if (!usePropertyAccess()) return <PropertyAccessDenied featureName="chat widget features" />

  const handleReset = async () => {
    setReseting(true)
    try {
      const response = await fetch(CHAT_WIDGET_RESET_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const result = await response.json()
      toast.success(result.message || "Widget reset successfully")
      refetch()
    } catch (error) {
      console.error("❌ Reset failed:", error)
    } finally {
      setReseting(false)
    }
  }

  // Render component based on active tab
  const renderedComponent = () => {
    switch (activeTab) {
      case "chag-widget":
        return data ? <WidgetUpdateForm data={data} /> : <div>Loading...</div>
      case "widget-stages":
        return data ? <WidgetStageForm data={data} /> : <div>Loading...</div>
      case "domain-restriction":
        return data ? <DomainRestriction data={data} /> : <div>Loading...</div>
      case "platform-restriction":
        return data ? <PlatformRestriction data={data} /> : <div>Loading...</div>
      case "lead-collection":
        return data ? <LeadCollection data={data} /> : <div>Loading...</div>
      case "country-configure":
        return data ? <CountryConfigure data={data} /> : <div>Loading...</div>
      case "widget-appearance":
        return data ? <WidgetAppearance data={data} /> : <div>Loading...</div>
      case "webhook-configure":
        return <WebHookConfigure />
      default:
        return <div className="flex flex-col items-center justify-center h-full py-16 text-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-3-3v6m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold">Unknown Tab</h3>
          <p className="text-sm text-gray-400 mt-1">
            The tab you are trying to access does not exist.
          </p>
        </div>
    }
  }

  return (
    <div className="">
      <div className="max-w-5xl mx-auto">
        <div className="flex border-b py-2 justify-between items-center">
          <p className="flex items-center gap-3">
            <Settings size={18} /> Widget Settings
          </p>
          <button
            type="button"
            onClick={handleReset}
            disabled={reseting}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50"
          >
            {reseting ? "Resetting..." : "Reset"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Sidebar Tabs */}
          <div className="md:border-r overflow-x-auto">
            <ChatWidgetSidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 py-5">{renderedComponent()}</div>
        </div>
      </div>
    </div>
  )
}

export default ChatWidgetPage
