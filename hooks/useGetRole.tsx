"use client";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ROLE_GET_API } from "@/api/api";
// import { ROLE_GET_API } from "@/api/api"; // make sure you define this
   
// Individual role type
export type RoleType = {
    id: number;
    user_id: number;
    property_id: number;
    role_name: string;
    permission: string[]; // array of permission keys
    status: number;
    created_at: string;
    updated_at: string;
};

// Full API response type
export type RoleApiResponse = {
    status: boolean;
    message: string;
    data: {
        roles: RoleType[];
    };
};

export const useGetRole = () => {
    const [data, setData] = useState<RoleType[] | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(ROLE_GET_API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const json: RoleApiResponse = await response.json();
            setData(json.data.roles);
        } catch (err) {
            console.error("Error fetching roles", err);
            setError("Failed to fetch roles");
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
