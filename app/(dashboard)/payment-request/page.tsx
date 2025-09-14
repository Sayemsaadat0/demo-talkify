'use client'
import { CreditCard } from 'lucide-react'

export default function PaymentRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <CreditCard className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Requests</h1>
          <p className="text-gray-600">Manage payment requests and approvals</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">This page is under development</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  )
}
