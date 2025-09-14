import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { AFFILIATE_COMMISION_API } from "@/api/api";
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
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}

interface FilterTypeStatus {
    commission: string;
    withdraw: string;
}

interface FilterStatus {
    pending: string;
    approved: string;
    paid: string;
    rejected: string;
}

interface Filter {
    type: FilterTypeStatus;
    status: FilterStatus;
}

interface WithdrawParam {
    name: string;
    label: string;
    required: number; // 1 or 0
}

interface Transaction {
    id: number;
    user_id: number;
    payment_gateway_id: number | null;
    purchase_id: number;
    amount: string;
    type: string;
    status: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

interface TransactionsPagination {
    current_page: number;
    data: Transaction[];
    per_page: number;
    total: number;
    last_page: number;
}

interface DataResponse {
    current_balance: number;
    total_commission: string;
    total_withdraw: number;
    pending_withdraw_count: number;
    gateways: Gateway[];
    filter: Filter;
    withdraw_params: WithdrawParam[];
    transactions: TransactionsPagination;
}


type useGetAffiliateCommisionProps = {
    type?: string;
    page?: number; // ✅ add page param

    status?: string;
}

export const useGetAffiliateCommision = ({
    type,
    status,
    page = 1,
}: useGetAffiliateCommisionProps) => {
    const [data, setData] = useState<DataResponse | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debounceType = useDebounce(type || "", 300);
    const debounceStatus = useDebounce(status || "", 300);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params only if they have values
            const params = new URLSearchParams();
            if (debounceType.trim()) params.append("type", debounceType.trim());
            if (debounceStatus.trim()) params.append("status", debounceStatus.trim());
            params.append("page", String(page)); // ✅ send page to API


            const url = `${AFFILIATE_COMMISION_API}${params.toString() ? "?" + params.toString() : ""}`;

            const response = await fetch(url, {
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
    }, [debounceType, debounceStatus, page, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const refetch = useCallback(async () => {
        setLoading(true);
        await fetchData();
    }, [fetchData]);

    return { data, loading, refetch, error };
};
