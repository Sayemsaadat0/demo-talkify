'use client'
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { RootState } from "@/redux/store"
import NextTopLoader from 'nextjs-toploader';

import { useSelector } from "react-redux"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const Template = ({ children }: { children: React.ReactNode }) => {
    const isCollapsed = useSelector((state: RootState) => state.layout.isSidebarCollapsed)
    const { isAuthenticated  } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    if (!isAuthenticated) {
        router.push('/login');
    }


    return (
        <div className="flex h-screen  relative">
            <NextTopLoader showSpinner={false} color="#2299DD" />
            {/* Professional Noisy Background */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, rgba(0,0,0,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 0%, transparent 50%),
                        linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.02) 50%, transparent 60%),
                        linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.02) 50%, transparent 60%)
                    `,
                    backgroundSize: '100px 100px, 150px 150px, 50px 50px, 50px 50px',
                    backgroundPosition: '0 0, 75px 75px, 0 0, 25px 25px'
                }}
            />

            {/* Main Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200" />

            {/* Content Layer */}
            <div className="relative z-10 flex w-full h-full">
                <NextTopLoader showSpinner={false} color="#2299DD" />
                {/* Fixed Sidebar */}
                <div className="fixed  left-0 z-50">
                    <DashboardSidebar />
                </div>

                {/* Main Content */}
                <div
                    className={cn(
                        "flex-1 flex flex-col transition-all duration-300 ease-in-out ",
                        isCollapsed ? "pl-16" : "pl-72"
                    )}

                >
                    <DashboardHeader />
                    <main className="flex-1 overflow-auto p-3">
                        <>
                            {children}
                        </>

                    </main>
                </div>
            </div>
        </div>
    )
}

export default Template
