import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { AFFILIATE_COMMISION_DETAILS_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


interface PaymentGatewayData {
    account_holder_name: string
    account_number: string
    ifsc_code: string
    bank_name: string
}

interface PaymentGateway {
    id: number
    user_id: number
    type: string
    data: PaymentGatewayData
    created_at: string
    updated_at: string
}

interface User {
    id: number
    firstname: string
    lastname: string
    username: string
    balance: number
    active_property_id: number
    referral_id: number
    language_id: number
    email: string
    country_code: string
    country: string
    phone_code: string
    phone: string
    image: string | null
    plan_id: number
    created_at: string
    updated_at: string
    "last-seen-activity": boolean
    fullname: string
}

export interface CommissionDetailsDataType {
    id: number
    user_id: number
    payment_gateway_id: number
    purchase_id: number | null
    amount: string
    type: string
    status: string
    notes: string
    created_at: string
    updated_at: string
    payment_gateway: PaymentGateway
    user: User
}

type useGetCommissionDetailsProps = {
    id: number;
}

export const useGetCommissionDetails = ({
    id,
}: useGetCommissionDetailsProps) => {
    const [data, setData] = useState<CommissionDetailsDataType | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debounceId = useDebounce(id || "", 300);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${AFFILIATE_COMMISION_DETAILS_API}${debounceId}`, {
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
    }, [debounceId, token]);

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
