"use client"

import React from "react"
import { Bell, LogOut, User, Mail, Settings, Users, Receipt, Package, MessageSquare } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
// import { toggleSidebar } from "@/redux/features/layoutSlice"
import { useRouter } from "next/navigation"
import { useLogout } from "@/hooks/useLogout"

// import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { AUTH_REDIRECT } from "@/api/api"
import DashboardPropertySelection from "./DashboardPropertySelection"
import { filterDropdownMenuItems, DropdownMenuDataItem } from "@/lib/filterSidebarItems"
// import { useGetMe } from "@/hooks/useGetMe"

// Menu data structure for nested dropdowns
// Items without 'role' field are global (always visible)
// Items with 'role' field are conditional (only visible if user has matching permission)
const menuItems: DropdownMenuDataItem[] = [
    {
        id: 'contact',
        title: 'Contact',
        description: 'Contact management',
        icon: Users,
        role: "contact",
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        subItems: [
            {
                id: 'contact-list',
                title: 'Contact List',
                description: 'Manage contacts',
                icon: Users,
                role: "contact",
                href: '/contact-management/contact-list'
            },
            {
                id: 'visitor-member',
                title: 'Visitor Member',
                description: 'Manage visitor members',
                icon: User,
                role: "contact",
                href: '/contact-management/visitor-member'
            }
        ]
    },
    {
        id: 'affiliate',
        title: 'Affiliate',
        description: 'Affiliate management',
        icon: Users,
        role: "affiliate",
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        subItems: [
            {
                id: 'affiliate-plans',
                title: 'Plans',
                description: 'Manage affiliate plans',
                icon: Settings,
                role: "affiliate",
                href: '/affiliate/plans'
            },
            {
                id: 'affiliate-user-list',
                title: 'All Users',
                description: 'View all affiliate users',
                icon: User,
                role: "affiliate",
                href: '/affiliate/user-list'
            },
            {
                id: 'affiliate-commissions',
                title: 'Commissions',
                description: 'Manage commissions',
                icon: Users,
                role: "affiliate",
                href: '/affiliate/affiliate-commissions'
            },
            {
                id: 'affiliate-payment-gateway',
                title: 'Payment Gateway',
                description: 'Manage payment gateways',
                icon: Settings,
                role: "affiliate",
                href: '/affiliate/payment-gateway'
            }
        ]
    },
    {
        id: 'billing',
        title: 'Billing',
        description: 'Billing and transactions',
        icon: Receipt,
        // role: "billing", // Conditional - requires billing permission
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        subItems: [
            {
                id: 'transactions',
                title: 'Transactions',
                description: 'View transaction history',
                icon: Receipt,
                // role: "billing", // Conditional - requires billing permission
                href: '/transactions'
            },
            {
                id: 'subscription',
                title: 'Subscription',
                description: 'Manage subscriptions',
                icon: Package,
                // role: "billing", // Conditional - requires billing permission
                href: '/subscription'
            }
        ]
    },
];

// Direct menu items (no nested dropdowns)
const directMenuItems: DropdownMenuDataItem[] = [
    {
        id: 'profile',
        title: 'Profile',
        description: 'View and edit your profile',
        icon: User,
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        href: '/profile'
        // No role field = global item (always visible)
    },
    {
        id: 'support-tickets',
        title: 'Support Tickets',
        description: 'Manage support tickets',
        icon: MessageSquare,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        href: '/support-tickets'
        // No role field = global item (always visible)
    }
];

export function DashboardHeader() {
    const router = useRouter()
    const { performLogout } = useLogout()
    // const isCollapsed = useSelector((state: RootState) => state.layout.isSidebarCollapsed)
    const storedUser = useSelector((state: RootState) => state.auth.user as {
        firstname?: string;
        lastname?: string;
        email?: string;
        permissions?: string[];
    } | null);


    // Combine firstname and lastname for display
    const user = {
        name: `${storedUser?.firstname || ""} ${storedUser?.lastname || ""}`.trim(),
        email: storedUser?.email || ""
    }

    // Filter menu items based on user permissions using the utility function
    const filteredMenuItems = React.useMemo(() => {
        return filterDropdownMenuItems(menuItems, storedUser?.permissions);
    }, [storedUser?.permissions]);

    // Filter direct menu items based on user permissions
    const filteredDirectMenuItems = React.useMemo(() => {
        return filterDropdownMenuItems(directMenuItems, storedUser?.permissions);
    }, [storedUser?.permissions]);

    const handleLogout = () => {
        performLogout('/login');
    }

    const handleNavigation = (href: string) => {
        router.push(href);
    }

    // const { data: userData } = useGetMe()
    // console.log("userData", userData)

    return (
        <header className="sticky top-0 z-40 w-full border border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="flex relative items-center justify-between px-2  h-20">
                {/* Left: Sidebar Toggle + Logo */}
                <div className="flex items-center gap-3">

                    {/* <h1 className="hidden sm:block text-lg font-semibold text-slate-700">
                        Dashboard
                    </h1> */}
                    {/* Menu For Selecting different Property */}
                    <DashboardPropertySelection />
                </div>


                {/* Right: Notifications + User Dropdown */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <Bell className="h-5 w-5 text-slate-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Dropdown with Nested Dropdowns */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="text-sm font-semibold text-slate-800">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {user.email}
                                    </div>
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-80 p-4 max-h-[82vh] overflow-y-auto" align="end">
                            {/* User Info Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Laravel Dashboard - Static Item */}
                            <div className="mb-4">
                                <DropdownMenuItem
                                    onClick={() => {
                                        window.open(`${AUTH_REDIRECT}?token=${token}`, "_blank");
                                    }}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Laravel Dashboard</div>
                                        <div className="text-sm text-gray-500">Access main dashboard</div>
                                    </div>
                                </DropdownMenuItem>
                            </div>

                            {/* Main Menu Items - Generated from data */}
                            <div className="space-y-2">
                                {/* Nested Dropdown Items */}
                                {filteredMenuItems.map((item) => (
                                    <DropdownMenuSub key={item.id}>
                                        <DropdownMenuSubTrigger className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                                                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{item.title}</div>
                                                <div className="text-sm text-gray-500">{item.description}</div>
                                            </div>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="w-72 p-3">
                                            <div className="space-y-2">
                                                {item.subItems?.map((subItem) => (
                                                    <DropdownMenuItem
                                                        key={subItem.id}
                                                        onClick={() => subItem.href && handleNavigation(subItem.href)}
                                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                                    >
                                                        <subItem.icon className="h-4 w-4 text-gray-600" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{subItem.title}</div>
                                                            <div className="text-xs text-gray-500">{subItem.description}</div>
                                                        </div>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                ))}

                                {/* Direct Menu Items (no nested dropdowns) */}
                                {filteredDirectMenuItems.map((item) => (
                                    <DropdownMenuItem
                                        key={item.id}
                                        onClick={() => item.href && handleNavigation(item.href)}
                                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                                            <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{item.title}</div>
                                            <div className="text-sm text-gray-500">{item.description}</div>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>

                            {/* Logout Section */}
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-red-600"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                        <LogOut className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-red-600">Logout</div>
                                        <div className="text-sm text-red-500">Sign out of your account</div>
                                    </div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
