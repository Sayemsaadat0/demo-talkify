import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CONTACT_LIST_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface ContactType {
    id: number;
    user_id: number;
    property_id: number | null;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    note: string | null;
    created_at: string;
    updated_at: string;
}

export interface ContactListType {
    data: ContactType[];
}

type useGetContactListProps = {
    first_name?: string;
    last_name?: string;
    email?: string;
    created_at?: string;
}

export const useGetContactList = ({
    first_name,
    last_name,
    email,
    created_at,
}: useGetContactListProps) => {
    const [data, setData] = useState<ContactListType | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debounceFirstName = useDebounce(first_name || "", 300);
    const debounceLastName = useDebounce(last_name || "", 300);
    const debounceEmail = useDebounce(email || "", 300);
    const debounceCreatedAt = useDebounce(created_at || "", 300);
    const token = useSelector((state: RootState) => state.auth.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params only if they have values
            const params = new URLSearchParams();
            if (debounceFirstName.trim()) params.append("first_name", debounceFirstName.trim());
            if (debounceLastName.trim()) params.append("last_name", debounceLastName.trim());
            if (debounceEmail.trim()) params.append("email", debounceEmail.trim());
            if (debounceCreatedAt.trim()) params.append("created_at", debounceCreatedAt.trim());

            const url = `${CONTACT_LIST_API}${params.toString() ? "?" + params.toString() : ""}`;

            const response = await fetch(`${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Application: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            setData(json);
        } catch (err) {
            console.error("Error fetching contact list", err);
            setError("Failed to fetch contact list");
            setData(undefined);
        } finally {
            setLoading(false);
        }
    }, [debounceFirstName, debounceLastName, debounceEmail, debounceCreatedAt, token]);

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
