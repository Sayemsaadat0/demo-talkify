"use client";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { USER_LEADS_GET_API } from "@/api/api";

// Individual lead type
export type LeadType = {
    id: number;
    property_id: string;
    chat_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: string | null;
    updated_at: string | null;
};

// Full API response type
export type LeadsApiResponse = {
    status: boolean;
    message: string;
    data: LeadType[];
};

export const useGetLeads = () => {
    const [data, setData] = useState<LeadType[] | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(USER_LEADS_GET_API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const json: LeadsApiResponse = await response.json();
            setData(json.data);
        } catch (err) {
            console.error("Error fetching leads", err);
            setError("Failed to fetch leads");
            setData(undefined);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchData();
    }, [fetchData, token]);

    const refetch = async () => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 500));
        await fetchData();
    };

    return { data, loading, error, refetch };
};
