"use client";
import { useCallback, useEffect, useState } from "react";
import { KNOWLEDGEBASE_CATEGORY_GET_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Single category type
export type KnowledgeCategoryType = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  parent: KnowledgeCategoryType | null;
  created_at: string;
  updated_at: string;
};

// Pagination type
export type PaginatedKnowledgeCategory = {
  current_page: number;
  data: KnowledgeCategoryType[];
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
export const useGetKnowledgeCategory = (page: number) => {
  const [data, setData] = useState<PaginatedKnowledgeCategory | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state?.auth?.token);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = page
        ? `${KNOWLEDGEBASE_CATEGORY_GET_API}?page=${page}`
        : KNOWLEDGEBASE_CATEGORY_GET_API;

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
