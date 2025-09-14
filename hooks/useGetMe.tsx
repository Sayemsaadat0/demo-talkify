'use client';
import { useCallback, useEffect, useState } from "react";
import { ME_API } from "@/api/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/features/authSlice";
// import { setCredentials } from "@/redux/features/authSlice";

export const useGetMe = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state?.auth?.token);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(ME_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      setData(json?.data || []);

      dispatch(
        setUser({
          token: token || "",
          user: json.data,
        })
      );
    } catch (err) {
      console.error("Error fetching Data", err);
      setError("Failed to fetch data");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [dispatch, token]);

  // initial fetch
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [fetchData, token]);

  // exposed refetch function with 3s loading
  const refetch = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    await fetchData();
  };

  return { data, loading, error, refetch };
};
