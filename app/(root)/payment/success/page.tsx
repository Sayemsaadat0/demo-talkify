"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your subscription. Your payment has been processed
            successfully and your account has been activated.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Subscription: Premium Plan</p>
              <p>Duration: 1 Month</p>
              <p>Status: Active</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You will receive a confirmation email shortly with your account
              details.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => router.push("/help")}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Get Help
              </button>
            </div>
          </div>

          {/* Auto Redirect Notice */}
          <p className="text-xs text-gray-500 mt-4">
            You will be automatically redirected to the dashboard in 5
            seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;