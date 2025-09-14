/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { PLANS_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type useGetPlansProps = {
  by?: string;
};

export const useGetPlans = ({ by }: useGetPlansProps) => {
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounced = useDebounce(by || "", 300);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = useCallback(async () => {

    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (debounced.trim()) params.append("by", debounced.trim());

      const url = `${PLANS_API}${params.toString() ? "?" + params.toString() : ""
        }`;

      // Build headers
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Application: "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      setData(json.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch Data");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [debounced, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  return { data, loading, refetch, error };
};
