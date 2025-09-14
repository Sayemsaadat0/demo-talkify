import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { AFFILIATE_USER_LIST_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";



export interface AffiliateUserType {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    balance: number;
    active_property_id: number | null;
    referral_id: number;
    language_id: number;
    email: string;
    country_code: string;
    country: string;
    phone_code: string;
    phone: string;
    image: string | null;
    image_driver: string | null;
    state: string | null;
    city: string | null;
    zip_code: string | null;
    address_one: string | null;
    address_two: string | null;
    provider: string | null;
    provider_id: string | null;
    status: number;
    identity_verify: number;
    address_verify: number;
    two_fa: number;
    two_fa_verify: number;
    two_fa_code: string | null;
    email_verification: number;
    sms_verification: number;
    verify_code: string | null;
    sent_at: string | null;
    last_login: string | null;
    last_seen: string | null;
    time_zone: string | null;
    github_id: string | null;
    google_id: string | null;
    facebook_id: string | null;
    linkedin_id: string | null;
    email_verified_at: string | null;
    deleted_at: string | null;
    timezone: string | null;
    plan_id: number;
    created_at: string;
    updated_at: string;
    "last-seen-activity": boolean;
    fullname: string;
}


export interface AffiliateUserListType {
    total_users: number;
    active_users: number,
    property_owner: number,
    users: {
        current_page: number,
        data: AffiliateUserType[]
        per_page: number;
        total: number;
        last_page: number;


    }
}

type useGetAffiliateUserListProps = {
    name?: string;
    email?: string;
    page?: number; // ✅ add page param

}

export const useGetAffiliateUserList = ({
    name,
    email,
    page = 1,

}: useGetAffiliateUserListProps) => {
    const [data, setData] = useState<AffiliateUserListType | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debounceName = useDebounce(name || "", 300);
    const debounceEmail = useDebounce(email || "", 300);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params only if they have values
            const params = new URLSearchParams();
            if (debounceName.trim()) params.append("name", debounceName.trim());
            if (debounceEmail.trim()) params.append("email", debounceEmail.trim());
            params.append("page", String(page)); // ✅ send page to API


            const url = `${AFFILIATE_USER_LIST_API}${params.toString() ? "?" + params.toString() : ""}`;

            const response = await fetch(`${url}`, {
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
    }, [debounceName, debounceEmail, token, page]);

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
