'use client'
import { useEffect, useState } from 'react';
import Link from "next/link"
import { Check, CheckCheck, ChevronRight, Cloud,  CopyIcon,  Info, Mail, Server } from "lucide-react";
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { AFFILIATE_PLAN_LIST_API } from '@/api/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const services: any[] = [
    {
        title: "Card 1",
        icon: <Server className="h-5 w-5 text-gray-500" />,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, cumque.",
        link: null,
    },
    {
        title: "Card 2",
        icon: <Cloud className="h-5 w-5 text-gray-500" />,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, cumque.",
        link: null,
    },
    {
        title: "Card 3",
        icon: <Mail className="h-5 w-5 text-gray-500" />,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, cumque.",
        link: null,
    },
    // You can remove all items from this array to test the "no service" state
];



export type UnlimitedSection = {
    property_unlimited: string;
    member_unlimited: string;
    visitor_unlimited: string;
    kb_unlimited: string;
    message_store_unlimited: string;
};

export type AffiliatePlan = {
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
    unlimited_section: UnlimitedSection;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gateway_plan_id: any[];
    created_at: string;
    updated_at: string;
    discount_price: number;
    refer_commission_amount: number;
    refer_code: string;
};

export type AffiliatePlansResponse = {
    status: boolean;
    message: string;
    data: AffiliatePlan[];
};


const AffiliateCodeAndCategoryTab = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    // const [copied, setCopied] = useState(false);

    const [affiliatePlans, setAffiliatePlans] = useState<AffiliatePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number>(1); // Default to 2nd card
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // console.log(affiliatePlans)


    useEffect(() => {
        const fetchAffiliatePlans = async () => {
            try {

                const res = await fetch(AFFILIATE_PLAN_LIST_API, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch affiliate plans");

                const data = await res.json();
                setAffiliatePlans(data?.data || []);
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAffiliatePlans();
    }, [token]);



    // coping 
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    // const copyText = `${baseUrl}/some_url_Will_be_here`;

    // const handleCopy = async () => {
    //     try {
    //         await navigator.clipboard.writeText(copyText);
    //         setCopied(true);
    //         setTimeout(() => setCopied(false), 3000);
    //     } catch (err) {
    //         console.error('Failed to copy:', err);
    //     }
    // };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    };

    const getFeatureValue = (plan: AffiliatePlan, value: number, unlimitedKey: keyof UnlimitedSection, suffix: string = '') => {
        if (plan.unlimited_section[unlimitedKey] === "true") {
            return `Unlimited ${suffix}`;
        }
        return value === 0 ? `Unlimited ${suffix}` : `${formatNumber(value)} ${suffix}`;
    };


    return (
        <div className=''>
            {/* <div className="relative bg-[#2A0066] text-white/80 p-6 md:p-8 rounded-xl overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#4A00A0] rounded-full -mt-16 -mr-16 opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4A00A0] rounded-full -mb-8 -ml-8 opacity-50" />
                <div className="relative z-10 flex flex-col justify-between gap-6">
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Invite friends and earn commission. They will get discount too!
                        </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <div className="relative  w-full md:w-1/3">
                            <input
                                type="text"
                                value={copyText}
                                readOnly
                                className="flex w-full  rounded-md border border-input bg-gray-100 px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 text-gray-900"
                            />
                        </div>
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 py-3 px-6 bg-white text-[#2A0066] hover:bg-gray-100 w-full sm:w-auto"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            {copied ? 'Copied!' : 'Copy link'}
                        </button>
                    </div>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <div className="absolute w-36 h-36 border-2 border-white border-opacity-20 rounded-full animate-pulse" />
                            <div className="absolute w-26 h-26 border-2 border-white border-opacity-30 rounded-full animate-pulse-slow" />
                            <div className="absolute w-16 h-16 border-2 border-white border-opacity-40 rounded-full animate-pulse-slower" />
                            <Gift className="h-10 w-10 text-white z-10" />
                        </div>
                    </div>

                </div>
            </div> */}

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Refer services to your friend</h3>


                {!loading && services.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col justify-between p-6"
                            >
                                <div className="flex flex-row items-center justify-between pb-2">
                                    <h4 className="text-lg font-medium">{service.title}</h4>
                                    {service.icon}
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">{service.description}</p>
                                    {!service.link && <ChevronRight className="h-5 w-5 text-gray-500" />}
                                </div>

                                {service.link && (
                                    <div className="flex flex-col items-start gap-2 mt-2">
                                        <Link
                                            href={service.link.href}
                                            className="text-sm text-green-600 flex items-center gap-1 hover:underline"
                                        >
                                            {service.link.label}
                                            <Info className="h-3 w-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-gray-100 py-6 rounded-md">
                        No services are currently available to refer.
                    </div>
                )}
            </div>
            <div className="mb-8 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Referral Plans</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose a plan to share and earn commission</p>
                </div>
                {affiliatePlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {affiliatePlans.map((plan, index) => {
                            const isActive = index === activeIndex;
                            // const copyText = plan?.refer_code;
                            const copyText = `${baseUrl}/affiliate-plan-details?reffaral_code=${plan?.refer_code}`;

                            const handleReferCopy = async (text: string, index: number) => {
                                try {
                                    await navigator.clipboard.writeText(text);
                                    setCopiedIndex(index);
                                    setTimeout(() => setCopiedIndex(null), 3000);
                                } catch (err) {
                                    console.error('Failed to copy:', err);
                                }
                            };


                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl p-8 border shadow-sm transition-all duration-300 cursor-pointer ${isActive
                                        ? "text-white border-transparent"
                                        : "bg-[#FACC151A] border-gray-200"
                                        }`}
                                    style={
                                        isActive
                                            ? {
                                                background:
                                                    "linear-gradient(180deg, #113066 30.43%, #143A7B 54.45%, #184592 74.31%, #2260CC 100%)",
                                            }
                                            : {}
                                    }
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(1)}
                                >
                                    <div >
                                        {/* Plan Name */}
                                        <h3 className={`text-2xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                            {plan.plan_name}
                                        </h3>

                                        <p className={` font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                            {plan.description}
                                        </p>


                                        {/* Price */}
                                        <div className="my-6 flex  gap-2 items-baseline ">
                                            <div className={`text-4xl font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                                ${plan.discount_price > 0 ? plan.discount_price : plan.price}
                                                {plan.discount_price > 0 && (
                                                    <span className={`text-2xl line-through ml-2 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        ${plan.price}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-sm font-semibold ${isActive ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                                                / {plan.payment_frequency}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className={`w-full h-px ${isActive ? 'bg-white/20' : 'bg-gray-300'} mb-6`}
                                            style={isActive ? {} : { borderTop: '1px dotted #ccc' }} />

                                        {/* Description */}
                                        {/* <p className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                                            {plan.description}
                                        </p> */}

                                        {/* Features List */}
                                        <div className="space-y-3 mb-8 text-left font-semibold">
                                            <div className="flex items-center">
                                                <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                    {getFeatureValue(plan, plan.number_of_property, 'property_unlimited', 'Properties')}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                    {getFeatureValue(plan, plan.per_property_member, 'member_unlimited', 'Members/Property')}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                    {getFeatureValue(plan, plan.number_of_visitor, 'visitor_unlimited', 'Incoming Visitors/Property')}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                    {getFeatureValue(plan, plan.number_of_kb, 'kb_unlimited', 'Knowledge Base/Property')}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                    {plan.unlimited_section.message_store_unlimited === "true"
                                                        ? "Unlimited Chat Storage"
                                                        : `${plan.message_store_days} Days Chat Storage`}
                                                </span>
                                            </div>
                                            {/* <div className="flex items-center">
                                                <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                    {plan.discount_price ?
                                                        plan?.discount_price
                                                        : `0 `} Discount
                                                </span>
                                            </div> */}
                                            {/* {plan.refer_commission_amount > 0 && (
                                                <div className="flex items-center">
                                                    <Check className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                                    <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                                        {plan.refer_commission_amount} Commission Amount
                                                    </span>
                                                </div>
                                            )} */}

                                        </div>

                                        {/* how muchthey pay */}
                                        <div className='my-5 space-y-2 font-semibold'>
                                            <div className={`flex justify-between items-center bg-gray-100 p-3 rounded-lg ${isActive ? 'text-white bg-gray-700' : 'text-gray-700'}`}>
                                                <div className={`text-sm space-x-2 `}>
                                                    <span >
                                                        They Pay
                                                    </span>
                                                    {/* <span className='border  text-center rounded px-2 py-1'>
                                                        20 % 
                                                    </span> */}
                                                </div>

                                                <div className='font-bold text-xl'>
                                                    US ${plan?.discount_price}
                                                </div>
                                            </div>
                                            <div className={`flex justify-between items-center bg-green-100 p-3 rounded-lg ${isActive ? 'text-green-100 bg-green-800' : 'text-green-800'}`}>
                                                <div className={`text-sm space-x-2 `}>
                                                    Your Commision
                                                </div>

                                                <div className='font-bold  text-xl'>
                                                    US ${plan?.refer_commission_amount}
                                                </div>
                                            </div>
                                        </div>


                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => handleReferCopy(copyText, index)}
                                                className={`py-3 px-6 rounded-lg font-semibold transition-colors ${isActive
                                                        ? 'bg-white text-blue-600 hover:bg-gray-100'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                            >
                                                {copiedIndex === index ? <CheckCheck /> : <CopyIcon />}
                                            </button>

                                            <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${isActive
                                                ? 'bg-white text-blue-600 hover:bg-gray-100'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}>
                                                Refer Via Email
                                            </button>

                                        </div>

                                        {/* Trail Days (if available) */}
                                        {plan.trail_days && (
                                            <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'} mt-3`}>
                                                {plan.trail_days} days free trial
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-gray-100 py-6 rounded-md">
                        {`No Plan's are currently available to refer.`}
                    </div>
                )}
            </div>

            {/* <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">How do referrals work?</h3>
                    <Link href="#" className="text-sm text-gray-600 hover:underline flex items-center gap-1">
                        Terms of Service
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-external-link"
                        >
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        </svg>
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex flex-row items-center space-y-0 pb-2">
                            <Mail className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-1">You send an invite</h4>
                            <p className="text-sm text-gray-500">
                                Pick a plan for them or send them a referral link so they can choose themselves.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex flex-row items-center space-y-0 pb-2">
                            <ShoppingCart className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-1">They make a purchase</h4>
                            <p className="text-sm text-gray-500">
                                Referral rewards apply to hosting, VPS, and email plans of 12+ months.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex flex-row items-center space-y-0 pb-2">
                            <CalendarDays className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-1">They&apos;re active for at least 45 days</h4>
                            <p className="text-sm text-gray-500">
                                The referred client keeps their subscription active and doesn&apos;t request a refund.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex flex-row items-center space-y-0 pb-2">
                            <Award className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-1">You get your commission</h4>
                            <p className="text-sm text-gray-500">Your earnings are sent to you via PayPal or Wire Transfer.</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default AffiliateCodeAndCategoryTab