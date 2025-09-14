"use client";;
import React, { useState } from "react";
import { Settings } from "lucide-react";
import ProfileForm from "./_components/ProfileForm";
import ChangePasswordForm from "./_components/ChangePasswordForm";

// Sidebar tabs for the profile section
const tabs = [
    { id: "1", title: "Profile", key: "profile" },
    { id: "2", title: "Change Password", key: "change-password" },
];



const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("profile");

    // Render content per tab
    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                // do i need to pass user data from here? lets see some other time
                return (
                    <ProfileForm />
                );

            case "change-password":
                return (
                    <ChangePasswordForm />
                );

            default:
                return (
                    <div className="flex-1 p-2">
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center text-gray-500">
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
                            <p className="text-sm text-gray-400 mt-1">The tab you are trying to access does not exist.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="">
            <div className="max-w-4xl mx-auto">
                <div className="flex border-b py-2 justify-between items-center">
                    <p className="flex items-center gap-3">
                        <Settings size={18} /> Profile Settings
                    </p>
                </div>

                <div className="flex">
                    {/* Sidebar Tabs */}
                    <div className="border-r ">
                        <div className="w-52 p-3 flex flex-col gap-2">
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-3 py-2 rounded-md hover:bg-gray-200 text-gray-700 text-sm font-medium cursor-pointer transition-colors ${activeTab === tab.key ? "bg-gray-200" : ""
                                        }`}
                                >
                                    {tab.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;