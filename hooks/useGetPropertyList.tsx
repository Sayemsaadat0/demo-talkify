/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GET_PROPERTY_API } from "@/api/api"; // define your API URL

// Full API response type
export type PropertyMemberApiResponse = {
    status: boolean;
    message: string;
    data: any;
};

export const useGetPropertyList = (page?: number, active?: number) => {
    const [data, setData] = useState();
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const url = `${GET_PROPERTY_API}?active=${active}&page=${page}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const json: PropertyMemberApiResponse = await response.json();
            setData(json.data);
            setRoles(json.data.roles);
        } catch (err) {
            console.error("Error fetching property members", err);
            setError("Failed to fetch property members");
            setData(undefined);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, [token, page, active]);

    useEffect(() => {
        if (token) fetchData();
    }, [fetchData, token]);

    const refetch = async () => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 500)); // optional small delay
        await fetchData();
    };

    return { data, roles, loading, error, refetch };
};
