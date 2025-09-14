'use client'

import { useState } from "react";
import { useGetAffiliateUserList } from "@/hooks/useGetAffiliateUserList";
import { Building2, User, Users2 } from "lucide-react";
import { SkeletonCard, SkeletonTableRow } from "@/components/loader/Skeleton";




const AffiliateUserListSection = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [page, setPage] = useState(1); // ✅ track current page


    const { data, loading } = useGetAffiliateUserList({
        name,
        email,
        page, // ✅ pass to hook
    });

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => {
        if (data?.users?.last_page && page < data.users.last_page) {
            setPage((p) => p + 1);
        }
    };


    const statsData = [
        { id: "total_users", title: "Total Users", value: data?.total_users, icon: User, bgColor: "bg-blue-100" },
        { id: "active_users", title: "Active Users", value: data?.active_users, icon: Users2, bgColor: "bg-green-100" },
        { id: "properties_owned", title: "Properties Owned", value: data?.property_owner, icon: Building2, bgColor: "bg-purple-100" },
    ];
    return (
        <div className="space-y-10">

            <p className="text-3xl border-b w-fit border-b-gray-300">Affiliate User List</p>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {loading || !data ? (
                    [1, 2, 3].map((key) => <SkeletonCard key={key} />)
                ) : (
                    statsData.map(({ id, title, value, icon: Icon, bgColor }) => (
                        <div key={id} className={`${bgColor} shadow-md rounded-lg p-6 flex items-center gap-4`}>
                            <Icon className="text-blue-500 text-3xl" />
                            <div>
                                <h3 className="text-gray-700 font-medium">{title}</h3>
                                <p className="text-2xl font-semibold">{value}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Search inputs */}


            {/* Data table */}
            <div className="overflow-x-auto">
                <div className="flex justify-end flex-row mb-4">
                    <div className="flex flex-col max sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={name}
                            onChange={(e) => {
                                setPage(1); // ✅ reset page on search
                                setName(e.target.value);
                            }} className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="email"
                            placeholder="Search by email"
                            value={email}
                            onChange={(e) => {
                                setPage(1); // ✅ reset page on search
                                setEmail(e.target.value);
                            }} className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                </div>
                <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">

                    <thead className="bg-gray-50 rounded-t-lg">
                        <tr>
                            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tl-lg">ID</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Name</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Email</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Phone</th>
                            <th className="text-right px-6 py-3 font-semibold  text-gray-600 border-b border-gray-200 rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading || !data ? (
                            // Show 5 skeleton rows while loading
                            [...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)
                        ) : data?.users?.data?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data?.users?.data?.map((row, i) => (
                                <tr
                                    key={row.id}
                                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-6 py-4 border-b border-gray-200">{i + 1}</td>
                                    <td className="px-6 py-4 border-b border-gray-200">{row.fullname}</td>
                                    <td className="px-6 py-4 border-b border-gray-200">{row.email}</td>
                                    <td className="px-6 py-4 border-b border-gray-200">{row.phone_code || 'N/A'} - {row.phone || 'N/A'}</td>
                                    <td className={`px-6 py-4 border-b border-gray-200 text-white font-semibold rounded-md text-end`}>
                                        <span className={`p-1 text-sm rounded-md ${row.status === 1 ? "bg-green-500" : "bg-red-500"}`}>
                                            {row.status === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {data?.users?.last_page && data.users.last_page > 0 && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={handlePrev}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-md border ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                        >
                            Prev
                        </button>
                        <span className="self-center">Page {page} of {data.users.last_page}</span>
                        <button
                            onClick={handleNext}
                            disabled={page === data.users.last_page}
                            className={`px-4 py-2 rounded-md border ${page === data.users.last_page ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AffiliateUserListSection;
