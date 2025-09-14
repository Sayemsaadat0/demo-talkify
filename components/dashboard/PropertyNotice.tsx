"use client";

import React from "react";
import { AlertTriangle, Building2, ArrowRight, Info } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export function PropertyNotice() {
    const user = useSelector((state: RootState) => state.auth.user);

    // Don't show notice if user has an active property
    if (user?.active_property_id) {
        return null;
    }

    // Don't show notice if user is not loaded yet
    if (!user) {
        return null;
    }

    // Check if user has properties but no active one (this would require additional API call)
    // For now, we'll show the general notice for all cases without active_property_id

    return (
        <div className="mx-3 mb-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-amber-800 mb-1">
                                    No Active Property Selected
                                </h3>
                                <p className="text-sm text-amber-700 mb-3">
                                    You need to create or select a property to access all dashboard features. 
                                    Create your first property to get started with managing your business.
                                </p>
                                
                                {/* Additional Info */}
                                <div className="flex items-start gap-2 mb-3">
                                    <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-amber-600">
                                        <p>Without an active property, you wont be able to:</p>
                                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                                            <li>Track visitors and analytics</li>
                                            <li>Manage chat widgets</li>
                                            <li>Access inbox and conversations</li>
                                            <li>Use knowledge base features</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/create-property"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                            >
                                <Building2 className="h-4 w-4" />
                                Create Property
                            </Link>
                            
                            <Link
                                href="/create-property/property-list"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-700 text-sm font-medium rounded-lg border border-amber-300 hover:bg-amber-50 transition-colors shadow-sm"
                            >
                                View Properties
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
