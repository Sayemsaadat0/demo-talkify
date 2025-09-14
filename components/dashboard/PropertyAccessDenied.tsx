"use client";

import React from "react";
import { Shield, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PropertyAccessDeniedProps {
  featureName?: string;
  className?: string;
}

export function PropertyAccessDenied({ 
  featureName = "this feature", 
  className = "" 
}: PropertyAccessDeniedProps) {
  return (
    <div className={`min-h-[60vh] flex items-center justify-center ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-red-800">
                Access Denied
              </h2>
              <p className="text-red-700">
                You do not have permission to access {featureName}. A property is required to use this feature.
              </p>
              <p className="text-sm text-red-600">
                Please create or select an active property to continue.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="/create-property"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Create Property
              </Link>
              
              <Link
                href="/create-property/property-list"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-700 text-sm font-medium rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
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
