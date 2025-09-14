/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPropertyList } from '@/hooks/useGetPropertyList';
import { Building2, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PROPERTY_ACTIVE_API } from '@/api/api';
import toast from 'react-hot-toast';
import { resetIsRefetchPropertyList, setProperty } from '@/redux/features/dashboardPropertySlice';
import { useGetMe } from '@/hooks/useGetMe';

const DashboardPropertySelection = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [page] = useState<number>(1);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const { refetch: refetchMe } = useGetMe()
    

    const { token, user } = useSelector((state: RootState) => state.auth);
    const shouldRefetch = useSelector((state: RootState) => state.dashboardPropertys.isRefetchProductList);

    // Fetch property list for dropdown
    const { data, loading, error, refetch } = useGetPropertyList(page, 1);
    const propertyData = data as { data: any[]; current_page: number; last_page: number } | undefined;

    // Initialize selected property based on user.active_property_id
    useEffect(() => {
        if (propertyData?.data?.length && user?.active_property_id) {

            const activeProp = propertyData.data.find(p => p.id === user.active_property_id);
            if (activeProp) {
                setSelectedProperty(activeProp);
                dispatch(setProperty(activeProp));
            }
        }
    }, [propertyData, user, dispatch]);

    const handleSelectProperty = async (property: any) => {
        try {
            const response = await fetch(PROPERTY_ACTIVE_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ property_id: property.property_id }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to select property");

            setSelectedProperty(property);
            dispatch(setProperty(property));
            refetchMe()

            toast.success(data?.data || "Property selected");
            router.push(`/create-property/property-overview?propertyId=${property.property_id}`);
        } catch (error: any) {
            console.error("API Error:", error);
            toast.error(error.message || "Something went wrong");
        }
    };

    const getImageUrl = (imagePath: string | null) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/assets/upload/${imagePath}`;
    };

    // Refetch if needed
    useEffect(() => {
        if (shouldRefetch) {
            (async () => {
                await refetch();
                dispatch(resetIsRefetchPropertyList());
            })();
        }
    }, [shouldRefetch, dispatch, refetch]);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                            <Image
                                width={400}
                                height={400}
                                src={selectedProperty?.image ? getImageUrl(selectedProperty.image) : 'https://placehold.co/600x400/000000/FFFFFF.png'}
                                alt="Property preview"
                                className="w-full h-10 object-cover rounded-xl shadow-md"
                            />
                        </div>
                        <div className="hidden sm:block text-left">
                            {propertyData?.data?.length === 0 ? (
                                <>
                                    <div className="text-sm font-semibold text-slate-800">Property</div>
                                    <div className="text-xs text-slate-500">No properties available</div>
                                </>
                            ) : selectedProperty ? (
                                <>
                                    <div className="text-sm font-semibold text-slate-800">{selectedProperty.property_name}-{selectedProperty.id}</div>
                                    <div className="text-xs text-slate-500">{selectedProperty.site_url}</div>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm font-semibold text-slate-800">Select Property</div>
                                    <div className="text-xs text-slate-500">Choose a property to load into dashboard</div>
                                </>
                            )}
                        </div>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-60 p-2 max-h-[70vh] overflow-y-auto" align="end">
                    {loading && (
                        <div className="flex items-center gap-2 p-3 text-slate-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading properties...
                        </div>
                    )}
                    {error && <div className="p-3 text-sm text-red-600">{error}</div>}

                    {!loading && !error && (
                        <div className="space-y-1">
                            {propertyData?.data?.length ? (
                                propertyData.data.map((p: any) => (
                                    <DropdownMenuItem
                                        key={p.id}
                                        onClick={() => handleSelectProperty(p)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-100 ${selectedProperty?.property_id === p.property_id ? 'bg-blue-100' : ''
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-white font-medium text-lg">
                                            {p.image ? (
                                                <Image
                                                    width={400}
                                                    height={400}
                                                    src={getImageUrl(p.image)}
                                                    alt="Property preview"
                                                    className="w-full h-10 object-cover rounded-xl shadow-md"
                                                />
                                            ) : (
                                                <Building2 className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">{p.property_name} - {p.id}</div>
                                            <div className="text-xs text-gray-500 truncate">{p.site_url}</div>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="p-3 text-sm text-slate-600">No properties found.</div>
                            )}
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DashboardPropertySelection;
