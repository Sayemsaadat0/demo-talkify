"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentForm from "@/components/payment/PaymentForm";
import { RootState } from "@/redux/store";

// interface RootState {
//   auth: {
//     isAuthenticated: boolean;
//   };
// }

const Payment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const affiliate = useSelector((state: RootState) => state.affiliate)

  useEffect(() => {
    if (!planId && !affiliate?.referralCode) {
      router.push("/pricing");
    }
  }, [planId, router, affiliate?.referralCode]);

  if (!planId && !affiliate?.referralCode) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          No Plan Selected
        </h1>
        <p className="text-gray-600 mb-6">
          Please select a plan from the pricing page to continue.
        </p>
        <button
          onClick={() => router.push("/pricing")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Pricing
        </button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Complete Your Subscription
          </h1>
          <p className="text-gray-600">
            Secure payment gateway powered by industry-leading security
          </p>
        </div>

        <PaymentForm planId={planId || ""} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  </div>
);
};

export default Payment;