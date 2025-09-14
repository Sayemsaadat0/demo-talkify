'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GET_RECORDS_API } from "@/api/api";

export interface RecordsData {
  unAnsweredChat: string;
  answerChat: string;
  closeChat: string;
  savedKb: string;
  savePersonalNote: string;
  savedContact: string;
  todayVisitors: string;
  yesterdayVisitors: string;
  savedVisitors: string;
  pendingTicket: string;
  openTicket: string;
  closeTicket: string;
  totalProperty: string;
  totalMembers: string;
  totalVisitors: string;
}

export interface RecordsResponse {
  status: boolean;
  message: string;
  data: RecordsData;
}

interface UseGetRecordsProps {
  enabled?: boolean;
}

export const useGetRecords = ({ enabled = true }: UseGetRecordsProps = {}) => {
  const [data, setData] = useState<RecordsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchRecords = useCallback(async () => {
    if (!token || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GET_RECORDS_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: RecordsResponse = await response.json();
      
      if (result.status) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching records');
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const refetch = useCallback(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
