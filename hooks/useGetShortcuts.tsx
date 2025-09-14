"use client";
import { useCallback, useEffect, useState } from "react";
import { SHORTCUT_GET_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Individual shortcut type
export type ShortCutType = {
  id: number;
  property_id: number;
  user_id: number;
  key: string;
  message: string;
  type: "public" | "private" | string;
  created_at: string;
  updated_at: string;
};

// Pagination links
export type PaginationLinkType = {
  url: string | null;
  label: string;
  active: boolean;
};

// Paginated shortcuts structure
export type PaginatedShortcuts = {
  current_page: number;
  data: ShortCutType[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinkType[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

// Full API response type
export type ShortcutApiResponse = {
  status: boolean;
  message: string;
  data: {
    shortcuts: PaginatedShortcuts;
  };
};

export const useGetShortcuts = (page: number) => {
  const [data, setData] = useState<PaginatedShortcuts | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${SHORTCUT_GET_API}?page=${page}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const json: ShortcutApiResponse = await response.json();

      setData(json.data.shortcuts);
    } catch (err) {
      console.error("Error fetching shortcuts", err);
      setError("Failed to fetch shortcuts");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    if (token) fetchData();
  }, [fetchData, token]);

  const refetch = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500)); // optional small delay
    await fetchData();
  };

  return { data, loading, error, refetch };
};
