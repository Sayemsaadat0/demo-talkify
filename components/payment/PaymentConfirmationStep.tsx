/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Shield, CreditCard, CheckCircle } from "lucide-react";
import { COUPON_API } from "@/api/api";
import { useSelector } from "react-redux"; import { AffiliatePlanType } from "@/app/(root)/affiliate-plan-details/page";
;

interface PlanDetails {
  id: number;
  plan_name: string;
  plan_icon: string | null;
  payment_frequency: string;
  price: number;
  number_of_property: number;
  per_property_member: number;
  number_of_visitor: number;
  number_of_kb: number;
  message_store_days: number;
  status: number;
  type: string;
  dodo_product_id: string;
  trail_days: number | null;
  unlimited_section: {
    property_unlimited: string;
    member_unlimited: string;
    kb_unlimited: string;
    visitor_unlimited: string;
    message_store_unlimited: string;
  };
  description: string;
  gateway_plan_id: any[];
  created_at: string;
  updated_at: string;
  use_wallet: number;

}

interface BillingDetails {
  billing_city: string;
  billing_country: string;
  billing_state: string;
  billing_street: string;
  billing_zipcode: string;
}

interface PaymentConfirmationStepProps {
  planDetails: PlanDetails | null;
  billingDetails: BillingDetails;
  affiliatePlan?: AffiliatePlanType | null,
  setBillingDetails: (details: BillingDetails) => void;
  selectedMonths: number;
  setSelectedMonths: (months: number) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;
  onSubmit: () => void;
  setUseWallet: (wallet: number) => void;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  retryLocationFetch?: () => void;
  userEmail?: string;
  token?: string;
  fetchUpdatedPlanDetails?: (months: number) => Promise<void>;
}

const PaymentConfirmationStep = ({
  planDetails,
  affiliatePlan,
  billingDetails,
  setBillingDetails,
  setUseWallet,
  selectedMonths,
  setSelectedMonths,
  couponCode,
  setCouponCode,
  discountAmount,
  setDiscountAmount,
  onSubmit,
  loading,
  error,
  isAuthenticated,
  retryLocationFetch,
  userEmail,
  fetchUpdatedPlanDetails,
}: PaymentConfirmationStepProps) => {
  const token = useSelector((state: any) => state.auth.token);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");


  const handleBillingChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails({
      ...billingDetails,
      [field]: value,
    });
  };

  const handleSelectedMonthsChange = async (months: number) => {
    setSelectedMonths(months);
    
    // Call the API to fetch updated plan details when months change
    if (fetchUpdatedPlanDetails) {
      await fetchUpdatedPlanDetails(months);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");

    try {
      // Call real coupon API
      const totalAmount =
        (planDetails?.price || 0) * selectedMonths +
        (planDetails?.price || 0) * selectedMonths * 0.15; // base + tax
      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(COUPON_API, {
        method: "POST",
        headers,
        body: JSON.stringify({ coupon: couponCode, total_amount: totalAmount }),
      });
      const data = await response.json();
      if (data.status && data.data && data.data.coupon_amount) {
        setDiscountAmount(data.data.coupon_amount);
        setCouponError("");
      } else {
        setCouponError(data.errors || "Invalid coupon code");
        setDiscountAmount(0);
      }
    } catch {
      setCouponError("Error applying coupon");
      setDiscountAmount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const affilaitePrice = affiliatePlan?.price && affiliatePlan.price - affiliatePlan?.discount_price;

  const activePlan = affiliatePlan || planDetails;

  if (!planDetails && !affiliatePlan) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          Loading plan details and detecting your location...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
      {/* Left Side - Billing Details */}
      <div className="space-y-6 ">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Billing Information
            </h2>
            {billingDetails.billing_city && billingDetails.billing_country && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Auto-filled from IP location
              </div>
            )}
          </div>

          {isAuthenticated && userEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Account Email:</strong> {userEmail}
              </p>
            </div>
          )}

          {billingDetails.billing_city && billingDetails.billing_country ? (
            <p className="text-sm text-gray-600 mb-4">
              We&apos;ve automatically detected your location. You can edit any
              field below if needed.
            </p>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Please fill in your billing information below.
              </p>
              {retryLocationFetch && (
                <button
                  onClick={retryLocationFetch}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Try auto-detect location
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={billingDetails.billing_street}
                onChange={(e) =>
                  handleBillingChange("billing_street", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={billingDetails.billing_city}
                onChange={(e) =>
                  handleBillingChange("billing_city", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={billingDetails.billing_state}
                onChange={(e) =>
                  handleBillingChange("billing_state", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                value={billingDetails.billing_zipcode}
                onChange={(e) =>
                  handleBillingChange("billing_zipcode", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ZIP code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={billingDetails.billing_country}
                onChange={(e) =>
                  handleBillingChange("billing_country", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Subscription Duration */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Subscription Duration
          </h3>
                     <div className="grid grid-cols-4 gap-2">
             {[1, 3, 6, 12].map((months) => (
               <button
                 key={months}
                 onClick={() => handleSelectedMonthsChange(months)}
                 className={`p-2 rounded-lg border text-center transition-all ${selectedMonths === months
                   ? "bg-blue-600 text-white border-blue-600"
                   : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                   }`}
               >
                 <div className="font-semibold">{months}</div>
                 <div className="text-xs opacity-75">
                   {months === 1 ? "Month" : "Months"}
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* Coupon Code */}

      </div>

      {/* Right Side - Plan Details & Payment */}
      <div className="space-y-6 bg-gray-50 p-3 rounded-lg">
        {/* Plan Details */}
        <div className="  p-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Plan Details
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan Name:</span>
              <span className="font-semibold">{activePlan?.plan_name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Properties:</span>
              <span className="font-semibold">
                {activePlan?.unlimited_section?.property_unlimited === "yes"
                  ? "Unlimited"
                  : activePlan?.number_of_property}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Members per Property:</span>
              <span className="font-semibold">
                {activePlan?.unlimited_section?.member_unlimited === "yes"
                  ? "Unlimited"
                  : activePlan?.per_property_member}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Visitors:</span>
              <span className="font-semibold">
                {activePlan?.unlimited_section?.visitor_unlimited === "yes"
                  ? "Unlimited"
                  : activePlan?.number_of_visitor?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Storage:</span>
              <span className="font-semibold">
                {activePlan?.unlimited_section?.kb_unlimited === "yes"
                  ? "Unlimited"
                  : `${activePlan?.number_of_kb} KB`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Message Storage:</span>
              <span className="font-semibold">
                {activePlan?.unlimited_section?.message_store_unlimited === "yes"
                  ? "Unlimited"
                  : `${activePlan?.message_store_days} days`}
              </span>
            </div>
          </div>

        </div>

        {/* Pricing Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Base Price ({selectedMonths}{" "}
                {selectedMonths === 1 ? "month" : "months"}):
              </span>
              <span className="font-semibold">
                $ {(Number(affilaitePrice ?? planDetails?.price) || 0).toFixed(2)}
              </span>
            </div>

            {/* <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax (15%):</span>
              <span className="font-semibold">${taxAmount.toFixed(2)}</span>
            </div> */}

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount:</span>
                <span className="font-semibold">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex flex-col md:flex-row  md:gap-2 md:items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Coupon Code
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 max-w-32 px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter coupon code"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {applyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>
            <div>
              {couponError && (
                <p className="mt-2 text-sm text-red-600 text-end">{couponError}</p>
              )}
              {discountAmount > 0 && (
                <p className="mt-2 text-sm text-green-600 ">
                  Coupon applied! Discount: ${discountAmount.toFixed(2)}
                </p>
              )}
            </div>
            {planDetails?.use_wallet === 1 && (
              <div className="border-t border-gray-200 pt-3">
                <p className="text-lg font-bold mb-2">Pay with:</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="wallet"
                      className="accent-blue-600"
                      onChange={() => setUseWallet(1)}
                    />
                    <span>Wallet</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="gateway"
                      className="accent-blue-600"
                      onChange={() => setUseWallet(0)}
                    />
                    <span>Payment Gateway</span>
                  </label>
                </div>
              </div>
            )}



            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${(Number(affilaitePrice ?? planDetails?.price) - discountAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>


        </div>

        {/* Payment Button */}
        <div className="space-y-4">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {error === "Redirecting to payment gateway..."
                  ? "Preparing Payment Gateway..."
                  : "Processing Payment..."}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {/* Pay Now ${total.toFixed(2)} */}
                Pay Now 
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Secure Payment Gateway</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">
                SSL Encrypted
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div
            className={`rounded-lg p-4 ${error === "Redirecting to payment gateway..."
              ? "bg-blue-50 border border-blue-200"
              : "bg-red-50 border border-red-200"
              }`}
          >
            <p
              className={`text-sm ${error === "Redirecting to payment gateway..."
                ? "text-blue-600"
                : "text-red-600"
                }`}
            >
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmationStep;
