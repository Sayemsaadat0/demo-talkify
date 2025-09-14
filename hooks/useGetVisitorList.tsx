import { useState, useEffect, useCallback } from "react";
import { VISITOR_LIST_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDebounce } from "./useDebounce";

interface VisitorType {
    id: number;
    user_id: number;
    property_id: number;
    visitor_identity: string;
    note: string | null;
    created_at: string;
    updated_at: string | null;
}

interface VisitorListType {
    current_page: number;
    data: VisitorType[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface useGetVisitorListProps {
    visitor_identity?: string;
    note?: string;
    created_at?: string;
    page?: number;
}

export const useGetVisitorList = ({
    visitor_identity,
    note,
    created_at,
    page = 1,
}: useGetVisitorListProps) => {
    const [data, setData] = useState<VisitorListType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    const debounceVisitorIdentity = useDebounce(visitor_identity, 500);
    const debounceNote = useDebounce(note, 500);
    const debounceCreatedAt = useDebounce(created_at, 500);

    const fetchData = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (debounceVisitorIdentity) params.append("visitor_identity", debounceVisitorIdentity);
            if (debounceNote) params.append("note", debounceNote);
            if (debounceCreatedAt) params.append("created_at", debounceCreatedAt);
            if (page > 1) params.append("page", page.toString());

            const url = `${VISITOR_LIST_API}${params.toString() ? "?" + params.toString() : ""}`;
            const response = await fetch(`${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Application: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching visitor list:", err);
        } finally {
            setLoading(false);
        }
    }, [debounceVisitorIdentity, debounceNote, debounceCreatedAt, token, page]);

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
