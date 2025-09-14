"use client";
import { useCallback, useEffect, useState } from "react";
import {  KNOWLEDGEBASE_GET_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Category type (nested object)
export interface KnowledgeCategory {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    created_at: string; // ISO date
    updated_at: string; // ISO date
}

// Knowledge base article type
export interface KnowledgeArticle {
    id: number;
    category_id: number;
    user_id: number;
    property_id: number;
    title: string;
    details: string; // HTML content as string
    featured: number; // could also make this `boolean` if API returns 0/1
    status: number;   // could also be union type (0 | 1)
    created_at: string;
    updated_at: string;
    category: KnowledgeCategory; // nested category object
}

// Pagination type
export type PaginatedKnowledgeCategory = {
    current_page: number;
    data: KnowledgeArticle[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

// Full API response type
export type KnowledgeCategoryResponse = {
    status: boolean;
    message: string;
    data: PaginatedKnowledgeCategory;
};

// Hook
export const useGetKowlegdeList = (page: number) => {
    const [data, setData] = useState<PaginatedKnowledgeCategory | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state?.auth?.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const url = page
                ? `${KNOWLEDGEBASE_GET_API}?page=${page}`
                : KNOWLEDGEBASE_GET_API;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json: KnowledgeCategoryResponse = await response.json();
            setData(json.data); // ✅ only save pagination block
        } catch (err) {
            console.error("Error fetching knowledge categories:", err);
            setError("Failed to fetch knowledge categories");
            setData(undefined);
        } finally {
            setLoading(false);
        }
    }, [token, page]);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [fetchData, token, page]);

    const refetch = async () => {
        setLoading(true);
        await fetchData();
    };

    return { data, loading, error, refetch };
};
