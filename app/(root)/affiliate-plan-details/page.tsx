"use client";
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AFFILIATE_PLAN_LIST_API_DETAILS_API } from "@/api/api"
import { Package, Users, Eye, Database, MessageSquare, Tag, ShieldCheck, RefreshCcw } from "lucide-react"; // Lucide icons are fine
import Button from "@/components/ui/button"
import { useDispatch } from "react-redux";
import { setReferralCode } from "@/redux/features/affiliateSlice";

interface UnlimitedSection {
    property_unlimited: "yes" | "no"
    member_unlimited: "yes" | "no"
    visitor_unlimited: "yes" | "no"
    kb_unlimited: "yes" | "no"
    message_store_unlimited: "yes" | "no"
}

export interface AffiliatePlanType {
    id: number
    plan_name: string
    plan_icon: string | null
    payment_frequency: string
    price: number
    number_of_property: number
    per_property_member: number
    number_of_visitor: number
    number_of_kb: number
    message_store_days: number
    status: number
    type: string
    dodo_product_id: string
    trail_days: number | null
    unlimited_section: UnlimitedSection
    description: string
    gateway_plan_id: string[]
    created_at: string
    updated_at: string
    refer_commission_amount: number
    discount_price: number
    referral: number
    discount_code: string | null
}

const AffiliatePlanDetailsPage = () => {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const referralCode = searchParams.get("reffaral_code")
    const [plan, setPlan] = useState<AffiliatePlanType | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDuration, setSelectedDuration] = useState(1); // Default: 1 month
    const router = useRouter()



    useEffect(() => {
        const fetchAffiliatePlanDetails = async () => {
            if (referralCode) {
                try {
                    const res = await fetch(`${AFFILIATE_PLAN_LIST_API_DETAILS_API}${referralCode}`)
                    const json = await res.json()
                    if (json.status) {
                        setPlan(json.data)
                    }
                } catch (error) {
                    console.error("Failed to fetch affiliate plan details", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        fetchAffiliatePlanDetails()
    }, [referralCode])

    // console.log(plan, 'plsn')

    const getFeatureDisplay = (value: number, unlimited: "yes" | "no", unit = "") => {
        if (unlimited === "yes") {
            return "Unlimited"
        }
        return `${value} ${unit}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center text-gray-600">
                    <RefreshCcw className="h-8 w-8 animate-spin text-gray-500" />
                    <p className="mt-3 text-lg font-medium">Loading plan details...</p>
                </div>
            </div>
        )
    }

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-8 rounded-lg bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Plan Not Found</h2>
                    <p className="text-gray-600">
                        No affiliate plan found for the provided referral code. Please check the code and try again.
                    </p>
                </div>
            </div>
        )
    }

    // Example logic for price calculation based on duration
    const calculatePrice = () => {
        const originalMonthlyPrice = plan.price;
        const discountPerMonth = plan.discount_price;

        const discountedMonthlyPrice = originalMonthlyPrice - discountPerMonth;

        const totalOriginalPrice = originalMonthlyPrice * selectedDuration;
        const totalDiscountedPrice = discountedMonthlyPrice * selectedDuration;
        const totalSavings = totalOriginalPrice - totalDiscountedPrice;

        return {
            displayPrice: totalDiscountedPrice.toFixed(2),
            savings: totalSavings.toFixed(2),
            totalOriginalPrice: totalOriginalPrice.toFixed(2),
        };
    };

    const { displayPrice, savings, } = calculatePrice()

    return (
        <div className="min-h-[calc(100dvh-200px)] bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl grid md:grid-cols-12 gap-6">

                {/* Plan Details - Wider Section */}
                <div className="md:col-span-7 bg-white border border-gray-200 rounded-xl p-6 space-y-6 text-sm">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">{plan.plan_name}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {plan.description || "Experience top-tier hosting performance with our premium plan."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        {[
                            { icon: <Package className="h-4 w-4 text-emerald-500" />, label: getFeatureDisplay(plan.number_of_property, plan.unlimited_section.property_unlimited, "Properties") },
                            { icon: <Users className="h-4 w-4 text-emerald-500" />, label: getFeatureDisplay(plan.per_property_member, plan.unlimited_section.member_unlimited, "Members per Property") },
                            { icon: <Eye className="h-4 w-4 text-emerald-500" />, label: getFeatureDisplay(plan.number_of_visitor, plan.unlimited_section.visitor_unlimited, "Visitors") },
                            { icon: <Database className="h-4 w-4 text-emerald-500" />, label: getFeatureDisplay(plan.number_of_kb, plan.unlimited_section.kb_unlimited, "KB Storage") },
                            { icon: <MessageSquare className="h-4 w-4 text-emerald-500" />, label: getFeatureDisplay(plan.message_store_days, plan.unlimited_section.message_store_unlimited, "Message Store Days") },
                        ].map(({ icon, label }, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                {icon}
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-xs text-gray-600 mb-1 font-medium">
                            Billing Period
                        </label>
                        <div className="relative">
                            <select
                                id="duration"
                                className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2.5 px-3 pr-10 text-sm text-gray-800 shadow-sm transition focus:outline-none focus:ring-0"
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                            >
                                <option value={1}>1 Month</option>
                                <option value={6}>6 Months</option>
                                <option value={12}>12 Months</option>
                            </select>

                            {/* Custom arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg
                                    className="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-between items-center pt-2">
                        <p className="text-xl font-semibold text-gray-900">
                            ${displayPrice}
                            <span className="text-sm text-gray-400 ml-1">
                                /{selectedDuration} {selectedDuration === 1 ? 'month' : 'months'}
                            </span>
                        </p>
                        <span className="text-xs text-emerald-600 font-medium flex items-center">
                            <Tag className="h-4 w-4 mr-1" /> SAVE ${savings}
                        </span>
                    </div>

                </div>

                {/* Order Summary - Narrower Section */}
                <div className="md:col-span-5 bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between text-sm">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>{plan.plan_name} ({selectedDuration})</span>
                                <span className="font-medium">${displayPrice}</span>
                            </div>

                            <div className="flex justify-between text-gray-500">
                                <span>Setup Fee</span>
                                <span className="text-emerald-600 font-medium">FREE</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between text-gray-500">
                                <span>Taxes</span>
                                <span>–</span>
                            </div>
                            <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-base text-gray-900">
                                <span>Sub</span>
                                <span>${displayPrice}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button onClick={() => {
                            dispatch(setReferralCode(referralCode))
                            router.push(`payment?referralCode=${referralCode}`)
                        }} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm transition">
                            Proceed to Checkout
                        </Button>
                        <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Secure payment · 30-day refund
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AffiliatePlanDetailsPage