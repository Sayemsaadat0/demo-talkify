/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { AFFILIATE_PLAN_LIST_API_DETAILS_API, PLAN_CHECK_USER_API, PLAN_DETAILS_API, PLAN_PERIOd_WISE_API, PURCHASE_API } from "@/api/api";
import EmailStep from "./EmailStep";
import AuthStep from "./AuthStep";
import PaymentConfirmationStep from "./PaymentConfirmationStep";
import { loginUser, registerUser } from "@/app/authActions";
import { loginSuccess } from "@/redux/features/authSlice";
import { handleApiError } from "@/lib/handleApiError";
import { RootState } from "@/redux/store";
import { AffiliatePlanType } from "@/app/(root)/affiliate-plan-details/page";
import toast from "react-hot-toast";

interface PaymentFormProps {
  planId: string;
  isAuthenticated: boolean;
}
type PlanActivity = {
  status: number; // 0 = canceled, 1 = active, etc.
  value: string; // status label, e.g. "Canceled", "Active"
  cancellation: boolean; // whether cancellation is allowed
  modify_status: boolean; // whether modification is allowed
};

type UnlimitedSection = {
  property_unlimited: "yes" | "no";
  member_unlimited: "yes" | "no";
  visitor_unlimited: "yes" | "no";
  kb_unlimited: "yes" | "no";
  message_store_unlimited: "yes" | "no";
};

type PurchaseInfo = {
  id: number;
  user_id: number;
  referral_id: number;
  plan_id: number;
  currency: string;
  api_subscription_id: string;
  payment_method_id: string | null;
  plan_name: string;
  price: number;
  discount_amount: number;
  discounted_price: number;
  payment_status: number;
  payment_frequency: string; // "monthly", "yearly", etc.
  number_of_property: number;
  per_property_member: number;
  number_of_visitor: number;
  number_of_kb: number;
  message_store_days: number;
  type: string; // "paid", "free", etc.
  unlimited_section: UnlimitedSection;
  subs_expired_at: string; // ISO date string
  status: number;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
};


interface PlanDetails {
  id: number;
  plan_name: string;
  discount_price?: number;
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
  plan_activity: PlanActivity;
  purchase_info: PurchaseInfo;
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
  use_wallet: number
}

interface UserCheckResponse {
  exists: boolean;
  data?: {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    fullname: string;
  };
}

const PaymentForm = ({ planId, isAuthenticated }: PaymentFormProps) => {
  const { user, token: reduxToken } = useSelector(
    (state: { auth: { user: any; token: string | null } }) => state.auth
  );
  const affiliate = useSelector((state: RootState) => state.affiliate)

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | undefined>(undefined);
  const [affiliatePlan, setAffiliatePlan] = useState<AffiliatePlanType | null>(null)

  // Function to fetch updated plan details when selectedMonths changes
  const fetchUpdatedPlanDetails = async (months: number) => {
    try {
      setLoading(true);

      // Demo URL - replace with your actual API endpoint
      const url = PLAN_PERIOd_WISE_API;

      // Demo body data - replace with your actual payload structure
      const demoBody = {
        plan_name: planDetails?.plan_name || affiliatePlan?.plan_name,
        period: months,
        payment_frequency: planDetails?.payment_frequency || affiliatePlan?.payment_frequency,
        // Add any other required fields
      };

      // return console.log("demoBody", demoBody)


      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${reduxToken}`
        },
        body: JSON.stringify(demoBody),
      });
      // return console.log("response", response)
      const data = await response.json();

      if (data.status && data.data) {
        // Update both plan details and affiliate plan based on response
        if (data.data) {
          setPlanDetails(data.data);
          console.log("planDetails", data.data)
        }
        if (data.data) {
          setAffiliatePlan(data.data);
        }
      } else {
        // Plan doesn't exist for selected month
        console.error("Failed to fetch updated plan details");

        // Show toast with error message
        if (data.message) {
          // You can replace this with your preferred toast library
          toast.error(data.message); // Simple alert for now, replace with toast
        }

        // Reset to month 1
        setSelectedMonths(1);
      }
    } catch (error) {
      console.error("Error fetching updated plan details:", error);

      // Show toast with error message
      alert("Error fetching plan details. Please try again."); // Simple alert for now, replace with toast

      // Reset to month 1
      setSelectedMonths(1);
    } finally {
      setLoading(false);
    }
  };

  // Billing details
  const [billingDetails, setBillingDetails] = useState({
    billing_city: "",
    billing_country: "",
    billing_state: "",
    billing_street: "",
    billing_zipcode: "",
  });

  // Payment options
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [useWallet, setUseWallet] = useState(0);



  // const [taxRate, setTaxRate] = useState(0.15); // 15% tax rate

  useEffect(() => {
    if (affiliate?.referralCode) {
      fetchAffiliatePlanDetails();
    } else if (planId) {
      fetchPlanDetails();
    } else {
      setError("No referral code or plan ID found.");
    }

    fetchUserLocation();

    if (isAuthenticated && user) {
      const userEmail = user.email || user.username;
      if (userEmail) {
        setEmail(userEmail);
      }
    }
  }, [planId, isAuthenticated, user, affiliate?.referralCode]);


  // Add a retry mechanism for IP location if it fails
  const retryLocationFetch = () => {
    fetchUserLocation();
  };

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (reduxToken) {
        headers["Authorization"] = `Bearer ${reduxToken}`;
      }

      const response = await fetch(`${PLAN_DETAILS_API}/${planId}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (data.status) {
        setPlanDetails(data.data);
      } else {
        setError("Failed to fetch plan details");
      }
    } catch (error) {
      setError("Error fetching plan details");
    } finally {
      setLoading(false);
    }
  };


  const fetchAffiliatePlanDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${AFFILIATE_PLAN_LIST_API_DETAILS_API}${affiliate?.referralCode}`)
      const json = await res.json()
      if (json.status) {
        setAffiliatePlan(json.data)
      }
    } catch (error) {
      setError("Error fetching plan details");
    } finally {
      setLoading(false);
    }
  };


  const fetchUserLocation = async () => {
    try {
      setLoading(true);

      // Try multiple IP geolocation services as fallback
      let data = null;

      // First try ipinfo.io (more reliable)
      try {
        const response = await fetch("https://ipinfo.io/json", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (error) {
        console.log("ipinfo.io failed, trying alternative...");
      }

      // Fallback to ip-api.com
      if (!data) {
        try {
          const response = await fetch("http://ip-api.com/json", {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(5000),
          });

          if (response.ok) {
            data = await response.json();
          }
        } catch (error) {
          console.log("ip-api.com failed, trying alternative...");
        }
      }

      // Fallback to ipapi.com
      if (!data) {
        try {
          const response = await fetch("https://ipapi.com/ip_api.php?ip=", {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(5000),
          });

          if (response.ok) {
            data = await response.json();
          }
        } catch (error) {
          console.log("ipapi.com also failed");
        }
      }

      if (data) {
        // Map IP location data to billing fields with full country names
        const locationData = {
          billing_city: data.city || data.loc?.split(",")[0] || "",
          billing_country:
            data.country_name || data.country || data.countryCode || "",
          billing_state:
            data.region ||
            data.regionName ||
            data.loc?.split(",")[1]?.trim() ||
            "",
          billing_street: data.city || data.country_name || "",
          billing_zipcode:
            data.postal || data.postalCode || data.postcode || data.zip || "",
        };

        setBillingDetails(locationData);

        // Log the detected location for debugging
        // console.log("Detected location from IP:", {
        //   city: data.city,
        //   country: data.country_name || data.country,
        //   countryCode: data.countryCode || data.country_code,
        //   region: data.region,
        //   postal: data.postal || data.zip,
        //   timezone: data.timezone,
        //   ip: data.ip,
        // });
      } else {
        // If all services fail, set empty values
        setBillingDetails({
          billing_city: "",
          billing_country: "",
          billing_state: "",
          billing_street: "",
          billing_zipcode: "",
        });
        // console.log("All IP geolocation services failed, using manual input");
      }
    } catch (error) {
      console.error("Could not fetch location data:", error);
      // Set default values if IP tracking fails
      setBillingDetails({
        billing_city: "",
        billing_country: "",
        billing_state: "",
        billing_street: "",
        billing_zipcode: "",
      });
    } finally {
      setLoading(false);
    }
  };

  // Refactored: Use only check user API for all steps
  const checkUserApi = async (payload: any) => {
    try {
      setLoading(true);
      // console.log("checkUserApi - Calling API with payload:", payload);

      const response = await fetch(PLAN_CHECK_USER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      // console.log("checkUserApi - API Response:", data);

      return data;
    } catch (error) {
      // console.error("checkUserApi - Error:", error);
      setError("Error checking user existence");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setEmail(email);
    const data = await checkUserApi({ email });
    if (data) {
      if (
        (data.status && data.data && data.data.exists) ||
        data.message === "User exists"
      ) {
        setUserExists(true);
        if (data.data && data.data.token) {
          setToken(data.data.token);
          dispatch(
            loginSuccess({
              user: data.data.data || { email },
              token: data.data.token,
            })
          );
        }
        setError("");
        setCurrentStep(2);
      } else if (!data.status || data.message === "User does not exist") {
        setUserExists(false);
        setToken(undefined);
        setError("");
        setCurrentStep(2);
      } else {
        setError(data.message);
        setToken(undefined);
      }
    }
  };

  const handleAuthSubmit = async (
    password: string,
    confirmPassword?: string
  ) => {
    setPassword(password);
    if (confirmPassword) setConfirmPassword(confirmPassword);

    // Prepare payload for plan check user API
    const payload: any = { email, password };
    if (!userExists && confirmPassword) {
      payload.confirm_password = confirmPassword;
    }

    const data = await checkUserApi(payload);
    // console.log("Auth Submit - API Response:", data);

    if (data && data.status && data.data && data.data.token) {
      // console.log("Auth Submit - Token received:", data.data.token);
      setToken(data.data.token);
      dispatch(
        loginSuccess({
          user: data.data.data || { email },
          token: data.data.token,
        })
      );
      setError(""); // Clear any previous errors
      setCurrentStep(3);
    } else {
      const errorMessage = (data && data.message) || "Authentication failed";
      // console.log("Auth Submit - Error:", errorMessage);
      setError(errorMessage);
      setToken(undefined);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const userEmail = email;
      const authToken = token || reduxToken;
      if (!userEmail) {
        setError("Email is required for payment");
        setLoading(false);
        return;
      }
      // Always use the token from check user API
      if (!authToken) {
        setError("Authentication required before payment");
        setLoading(false);
        return;
      }
      const payload = {
        plan_id: `${planId}` || `${affiliatePlan?.id}`,
        billing_city: billingDetails.billing_city,
        billing_country: billingDetails.billing_country,
        billing_state: billingDetails.billing_state,
        billing_street: billingDetails.billing_street,
        billing_zipcode: billingDetails.billing_zipcode,
        referral: affiliatePlan?.referral || null,
        code: couponCode ? couponCode : null,
        use_wallet: useWallet
      };
      const headers: any = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };
      // return console.log(payload)
      const response = await fetch(PURCHASE_API, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (handleApiError(data, data.message)) return;
      // console.log("Purchase API response:", data);
      if (data.status) {
        if (data.data && data.data.payment_link) {
          setError("Redirecting to payment gateway...");
          setTimeout(() => {
            window.location.href = data.data.payment_link;
          }, 1000);
        } else {
          setError("Payment link not received from server");
          setLoading(false);
        }
      } else {
        setError(data.message || "Payment failed");
        setLoading(false);
      }
    } catch (error) {
      setError("Error processing payment");
      setLoading(false);
    }
  };

  const handleBackButton = () => {
    if (currentStep > 1) {
      // Go to previous step
      setCurrentStep(currentStep - 1);
      setError(""); // Clear any errors when going back
    } else {
      // Go back to pricing page
      window.location.href = "/pricing";
    }
  };

  // const activePlan = affiliatePlan || planDetails;

  // Wrapper function to handle plan details update
  // const handlePlanDetailsUpdate = (details: any) => {
  //   setPlanDetails(details);
  // };

  // // Removed calculation functionality - just return 0 for now
  // const calculateTotal = () => {
  //   console.log("Selected months value:", selectedMonths);
  //   return 0;
  // };


  if (loading && (!planDetails || !affiliatePlan)) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Progress Steps Skeleton */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative w-full max-w-xl">
            <div className="grid grid-cols-3 gap-0 w-full z-10 relative">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center w-full">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mb-2"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="absolute left-0 right-0 -bottom-4 h-0.5 bg-gray-200 w-full"></div>
          </div>
        </div>

        {/* Form Content Skeleton */}
        <div className="space-y-6">
          {/* Plan Details Skeleton */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Billing Details Skeleton */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Options Skeleton */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error && (!planDetails || !affiliatePlan)) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl shadow-2xl border border-blue-100 flex flex-col gap-6 transform transition-all hover:shadow-lg">
        {/* Message Container */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-blue-200 shadow-sm flex flex-col gap-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h2>
          </div>

          <div className="pl-2">
            <p className="text-gray-600 text-lg leading-relaxed mb-1">
              We encountered an issue:
            </p>
            <p className="text-red-500 font-medium text-xl bg-red-50/50 px-3 py-2 rounded-lg inline-block">
              {error}!
            </p>

            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Page
              </button>

              <button
                onClick={() => window.history.back()}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium px-6 py-3 rounded-lg transition-all hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-200/50 flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Need help?</h3>
            <p className="text-gray-600">Contact our support team at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a></p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      {/* Loading Overlay for Refetching */}
      {loading && (planDetails || affiliatePlan) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Updating plan details...</p>
          </div>
        </div>
      )}
      
      <div className="md:block lg:absolute">
        {/* Back Button */}
        <button
          onClick={handleBackButton}
          className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {currentStep > 1 ? "← Previous Step" : "← Back to Plans"}
        </button>

      </div>
      {/* Progress Steps */}
      <div className="mb-8 flex flex-col items-center ">
        {isAuthenticated ? (
          <div className="relative w-full max-w-md ">
            <div className="grid grid-cols-2 gap-0 w-full z-10 relative">
              {[1, 2].map((step) => (
                <div key={step} className="flex flex-col items-center w-full">
                  <div
                    className={`w-8  h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-sm mt-0.5 ${currentStep === step
                      ? "text-blue-600 font-semibold"
                      : "text-gray-400"
                      }`}
                  >
                    {step === 1 ? "Payment Details" : "Payment Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress Bar */}
            <div className="absolute  left-0 right-0 -bottom-4 h-0.5 bg-gray-200 w-full ">
              <div
                className="h-0.5 bg-blue-600 transition-all duration-300"
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                        ? "100%"
                        : "0%",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-xl  ">
            <div className="grid grid-cols-3 gap-0 w-full z-10 relative">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center w-full ">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-sm mt-0.5 ${currentStep === step
                      ? "text-blue-600 font-semibold"
                      : "text-gray-400"
                      }`}
                  >
                    {step === 1
                      ? "Email Verification"
                      : step === 2
                        ? "Authentication"
                        : "Payment Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress Bar */}
            <div className="absolute left-0 right-0 -bottom-4 h-0.5 bg-gray-200 w-full ">
              <div
                className="h-0.5 bg-blue-600 transition-all duration-300 "
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                        ? "50%"
                        : currentStep === 3
                          ? "100%"
                          : "0%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      {currentStep === 1 && !isAuthenticated && (
        <EmailStep
          email={email}
          onSubmit={handleEmailSubmit}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === 2 && !isAuthenticated && (
        <AuthStep
          userExists={userExists}
          onSubmit={handleAuthSubmit}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === 3 && (
        <PaymentConfirmationStep
          affiliatePlan={affiliatePlan}
          planDetails={planDetails}
          setUseWallet={setUseWallet}

          billingDetails={billingDetails}
          setBillingDetails={setBillingDetails}
          selectedMonths={selectedMonths}
          setSelectedMonths={setSelectedMonths}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discountAmount={discountAmount}
          setDiscountAmount={setDiscountAmount}
          onSubmit={handlePaymentSubmit}
          loading={loading}
          error={error}
          isAuthenticated={isAuthenticated}
          retryLocationFetch={retryLocationFetch}
          userEmail={email}
          token={token || undefined}
          fetchUpdatedPlanDetails={fetchUpdatedPlanDetails}
        />
      )}

      {isAuthenticated && currentStep === 1 && (
        <PaymentConfirmationStep
          affiliatePlan={affiliatePlan}
          planDetails={planDetails}
          billingDetails={billingDetails}
          setBillingDetails={setBillingDetails}
          selectedMonths={selectedMonths}
          setSelectedMonths={setSelectedMonths}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discountAmount={discountAmount}
          setDiscountAmount={setDiscountAmount}
          setUseWallet={setUseWallet}
          onSubmit={handlePaymentSubmit}
          loading={loading}
          error={error}
          isAuthenticated={isAuthenticated}
          retryLocationFetch={retryLocationFetch}
          userEmail={email}
          token={token || undefined}
          fetchUpdatedPlanDetails={fetchUpdatedPlanDetails}
        />
      )}
    </div>
  );
};

export default PaymentForm;
