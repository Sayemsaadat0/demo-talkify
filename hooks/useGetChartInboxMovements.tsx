'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CHART_INBOX_MOVEMENTS_API } from "@/api/api";

export interface ChartInboxMovementsData {
  dates: string[];
  answered: number[];
  closed: number[];
  unAnswered: number[];
}

export interface ChartInboxMovementsResponse {
  status: boolean;
  message: string;
  data: ChartInboxMovementsData;
}

interface UseGetChartInboxMovementsProps {
  enabled?: boolean;
}

export const useGetChartInboxMovements = ({ enabled = true }: UseGetChartInboxMovementsProps = {}) => {
  const [data, setData] = useState<ChartInboxMovementsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchChartInboxMovements = useCallback(async () => {
    if (!token || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CHART_INBOX_MOVEMENTS_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ChartInboxMovementsResponse = await response.json();
      
      if (result.status) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch chart inbox movements');
      }
    } catch (err) {
      console.error('Error fetching chart inbox movements:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching chart inbox movements');
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    fetchChartInboxMovements();
  }, [fetchChartInboxMovements]);

  const refetch = useCallback(() => {
    fetchChartInboxMovements();
  }, [fetchChartInboxMovements]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
