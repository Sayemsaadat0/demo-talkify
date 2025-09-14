'use client';;
import { useCallback, useEffect, useState } from "react";
import { WEBHOOK_CONFIGURE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// import { setCredentials } from "@/redux/features/authSlice";

export const useGetWebHook = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state?.auth?.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(WEBHOOK_CONFIGURE_API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            setData(json?.data || []);

        } catch (err) {
            console.error("Error fetching Data", err);
            setError("Failed to fetch data");
            setData(undefined);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // initial fetch
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [fetchData, token]);

    // exposed refetch function with 3s loading
    const refetch = async () => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 2000));
        await fetchData();
    };

    return { data, loading, error, refetch };
};
