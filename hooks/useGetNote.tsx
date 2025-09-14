"use client";
import { useCallback, useEffect, useState } from "react";
import { NOTE_GET_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export type NoteType = {
  id: number;
  user_id: number;
  property_id: number;
  title: string;
  details: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
};

export type PaginationLinkType = {
  url: string | null;
  label: string;
  active: boolean;
};

export type PaginatedNotesType = {
  current_page: number;
  data: NoteType[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type NoteListResponseType = {
  data: PaginatedNotesType;
};

export const useGetNote = (page: number) => {
  const [data, setData] = useState<NoteListResponseType | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state?.auth?.token);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = page ? `${NOTE_GET_API}?page=${page}` : NOTE_GET_API;

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
      setData(json);
    } catch (err) {
      console.error("Error fetching notes", err);
      setError("Failed to fetch notes");
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
    await new Promise((res) => setTimeout(res, 2000));
    await fetchData();
  };

  return { data, loading, error, refetch };
};
