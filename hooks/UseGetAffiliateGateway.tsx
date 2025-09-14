import { useCallback, useEffect, useState } from "react";
import { AFFILIATE_GATEWAYS_LIST_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


interface GatewayData {
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
}

interface Gateway {
    id: number;
    user_id: number;
    type: string;
    data: GatewayData;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
}

interface GatewaysPagination {
    current_page: number;
    data: Gateway[];
}

interface GatewayTypes {
    [key: string]: string; // e.g. "net_banking": "Net Banking"
}

interface AffiliateGatewaysData {
    types: GatewayTypes;
    gateways: GatewaysPagination;
}




export const UseGetAffiliateGateway = () => {
    const [data, setData] = useState<AffiliateGatewaysData | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(AFFILIATE_GATEWAYS_LIST_API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Application: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            setData(json.data);
        } catch (err) {
            console.error("Error fetching Data", err);
            setError("Failed to fetch Data");
            setData(undefined);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const refetch = async () => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 2000));
        await fetchData();
    };

    return { data, loading, refetch, error };
};
