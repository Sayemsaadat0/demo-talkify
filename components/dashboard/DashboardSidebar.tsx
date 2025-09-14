"use client";
import React, { useState, useEffect } from "react";
import {
    ChevronRight,
    Home,
    Settings,
    User,
    Inbox,
    Building2,
    Zap,
    StickyNote,
    BookOpen,
    MessageCircle,
    Shield,
    Users,
    ChevronLeft,
    List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LOGO_WHITE_URL } from "@/lib/constant";
import { toggleSidebar } from "@/redux/features/layoutSlice";
import { filterSidebarItemsByPermission } from "@/lib/filterSidebarItems";

interface DashboardSidebarItem {
    id: string;
    label: string;
    role?: string;
    icon?: React.ComponentType<{ className?: string }>;
    href?: string;
    children?: DashboardSidebarItem[];
    type?: 'item' | 'divider' | 'group-title';
}
// Sidebar items configuration
// Items without 'role' field are global (always visible)
// Items with 'role' field are conditional (only visible if user has matching permission)
const DashboardSidebarItems: DashboardSidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard", type: "item" },

    // Communication Section
    { id: "communication-divider", label: "Communication", type: "group-title" },
    { id: "inbox", role: "inbox", label: "Inbox", icon: Inbox, href: "/inbox", type: "item" },

    { id: "chat-widget", role: "widget", label: "Chat Widget", icon: MessageCircle, href: "/chat-widget", type: "item" },


    // Property Management Section
    { id: "property-divider", label: "Property Management", type: "group-title" },
    {
        id: "knowledge",
        role: "knowledge_base",
        label: "Knowledge Base",
        icon: BookOpen,
        type: "item",
        children: [
            { id: "knowledge-category", role: "knowledge_base", label: "Category", icon: Settings, href: "/knowledge/category" },
            { id: "knowledge-base", role: "knowledge_base", label: "Knowledge Base", icon: BookOpen, href: "/knowledge/knowledge-base" },
        ],
    },

    { id: "shortcut", label: "Shortcut", icon: Zap, href: "/shortcut", type: "item" },
    { id: "personal-notes", label: "Personal Notes", icon: StickyNote, href: "/personal-notes", type: "item" },
    {
        id: 'user-management',
        label: 'User Management',
        type: "item",
        role: "user_management",
        icon: Shield,
        children: [
            {
                id: 'role-list',
                label: 'Role List',
                role: "user_management",
                icon: Users,
                href: '/user-management/role-list'
            },
            {
                id: 'property-member',
                label: 'Property Member',
                role: "user_management",
                icon: User,
                href: '/user-management/property-member'
            },
            {
                id: 'leads',
                label: 'Leads',
                role: "user_management",
                icon: Users,
                href: '/user-management/leads'
            }
        ]
    },

];


interface DashboardSidebarItemComponentProps {
    item: DashboardSidebarItem;
    level?: number;
    expandedItems: Set<string>;
    onToggle: (id: string) => void;
    isCollapsed?: boolean;
}

function DashboardSidebarItemComponent({
    item,
    level = 0,
    expandedItems,
    onToggle,
    isCollapsed = false,
}: DashboardSidebarItemComponentProps) {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const Icon = item.icon;
    const pathname = usePathname()
    const isActive = item.href === pathname;
    const itemType = item.type || 'item';

    // Handle group title
    if (itemType === 'group-title') {
        return (
            <div className="w-full">
                {!isCollapsed && (
                    <div className="px-4 py-2 mt-3 mb-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                                {item.label}
                            </h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-400/15 to-transparent"></div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Handle regular items
    return (
        <div className="w-full">
            {item.href ? (
                <Link
                    href={item.href}
                    className={cn(
                        "group w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-white/10",
                        level === 0 ? "font-medium" : "font-normal text-sm",
                        isActive ? "bg-white/15 text-white" : "text-gray-300 hover:text-white",
                        isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.label : undefined}
                >
                    {Icon && (
                        <span className="relative inline-flex">
                            <Icon
                                className={cn(
                                    "peer h-5 w-5 transition-colors",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                                )}
                            />
                            {isCollapsed && (
                                <span
                                    className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[9999] whitespace-nowrap rounded-md bg-black/80 px-2 py-1  leading-none text-white opacity-0 shadow-md ring-1 ring-white/10 backdrop-blur-sm transition-all duration-150 peer-hover:opacity-100 peer-hover:translate-x-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                >
                                    {item.label}
                                </span>
                            )}
                        </span>
                    )}
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {hasChildren && (
                                <ChevronRight
                                    className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isExpanded ? "rotate-90" : "",
                                        "text-gray-400"
                                    )}
                                />
                            )}
                        </>
                    )}
                </Link>
            ) : (
                <button
                    onClick={() => hasChildren && onToggle(item.id)}
                    className={cn(
                        "group w-full flex items-center gap-3 px-4 py-3 rounded-lg  transition-all duration-200",
                        "hover:bg-white/10 text-gray-300 hover:text-white",
                        level === 0 ? "font-medium" : "font-normal text-sm",
                        isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.label : undefined}
                >
                    {Icon && (
                        <span className="relative inline-flex">
                            <Icon
                                className={cn(
                                    "peer h-5 w-5 transition-colors",
                                    "text-gray-400 group-hover:text-white"
                                )}
                            />
                            {isCollapsed && (
                                <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[9999] whitespace-nowrap rounded-md bg-black/70 px-2 py-1 leading-none text-white opacity-0 shadow-md ring-1 ring-white/10 backdrop-blur-sm transition-all duration-150 peer-hover:opacity-100 peer-hover:translate-x-0  group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
                                    {item.label}
                                </span>
                            )}
                        </span>
                    )}
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {hasChildren && (
                                <ChevronRight
                                    className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isExpanded ? "rotate-90" : "",
                                        "text-gray-400"
                                    )}
                                />
                            )}
                        </>
                    )}
                </button>
            )}

            {hasChildren && isExpanded && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-4">
                    {item.children?.map((child) => (
                        <DashboardSidebarItemComponent
                            key={child.id}
                            item={child}
                            level={level + 1}
                            expandedItems={expandedItems}
                            onToggle={onToggle}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function DashboardSidebar() {
    const dispatch = useDispatch()

    const links = [
        { href: "/create-property", label: "Create Property", icon: Building2 },
        { href: "/create-property/property-list", label: "Property List", icon: List },
    ];
    const user = useSelector((state: RootState) => state.auth.user);
    const isCollapsed = useSelector((state: RootState) => state.layout.isSidebarCollapsed);
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const filteredSidebarItems = React.useMemo(() => {
        if (!user) {
            return DashboardSidebarItems.filter(item => !item.role);
        }
        if (!user.permissions || !Array.isArray(user.permissions)) {
            return DashboardSidebarItems.filter(item => !item.role);
        }

        return filterSidebarItemsByPermission(DashboardSidebarItems, user.permissions);
    }, [user]);


    const findParentAccordion = (path: string) => {
        for (const item of filteredSidebarItems) {
            if (item.children) {
                const hasActiveChild = item.children.some(child => child.href === path);
                if (hasActiveChild) {
                    return item.id;
                }
            }
        }
        return null;
    };

    // Initialize expanded items based on current path
    useEffect(() => {
        const parentAccordion = findParentAccordion(pathname);
        if (parentAccordion) {
            setExpandedItems(prev => {
                const newSet = new Set(prev);
                newSet.add(parentAccordion);
                return newSet;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleExpanded = (id: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    return (
        <div
            className={cn(
                "h-screen relative flex flex-col  bg-gradient-to-bl from-black via-blue-950 to-black text-white shadow-lg transition-all duration-300",
                isCollapsed ? "w-16" : "w-72"
            )}
        >
            <div className="absolute top-12 -right-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2  rounded-full  border bg-blue-950 transition-colors"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {
                        isCollapsed ? <ChevronRight className="h-3 w-3 text-slate-100" /> : <ChevronLeft className="h-3 w-3 text-slate-100" />
                    }
                </button>
            </div>
            {/* Header */}
            <div className="h-16 flex items-center px-4  border-b border-white/10">

                {!isCollapsed ? (
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src={LOGO_WHITE_URL}
                            alt="logo"
                            width={32}
                            height={32}
                            className="w-32 shrink-0 "
                        />
                    </Link>
                ) : (
                    <Link href="/" className="flex items-center justify-center w-full">
                        <Image
                            src={'/images/icon_logo.webp'}
                            alt="logo"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                    </Link>
                )}
            </div>

            {/* Navigation Items */}
            <div className={cn("flex-1 p-3 space-y-1", isCollapsed ? "" : "overflow-y-auto custom-scroll")}>
                {filteredSidebarItems.map((item) => (
                    <DashboardSidebarItemComponent
                        key={item.id}
                        item={item}
                        expandedItems={expandedItems}
                        onToggle={toggleExpanded}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className={`${isCollapsed ? 'p-0' : 'p-4'}  space-y-2 border-t border-white/15`}>
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2 p-3 rounded-md hover:bg-white/10 transition-colors
            ${pathname === href ? "bg-white/15" : ""} 
            ${isCollapsed ? "justify-center" : ""}`}
                    >
                        <Icon className="text-gray-400" />
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                ))}
            </div>
        </div>
    );
}
