'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CHART_INBOX_STATEMENT_API } from "@/api/api";

export interface ChartInboxStatementData {
  months: string[];
  answered: number[];
  closed: number[];
}

export interface ChartInboxStatementResponse {
  status: boolean;
  message: string;
  data: ChartInboxStatementData;
}

interface UseGetChartInboxStatementProps {
  enabled?: boolean;
}

export const useGetChartInboxStatement = ({ enabled = true }: UseGetChartInboxStatementProps = {}) => {
  const [data, setData] = useState<ChartInboxStatementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchChartInboxStatement = useCallback(async () => {
    if (!token || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CHART_INBOX_STATEMENT_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ChartInboxStatementResponse = await response.json();
      
      if (result.status) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch chart inbox statement');
      }
    } catch (err) {
      console.error('Error fetching chart inbox statement:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching chart inbox statement');
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    fetchChartInboxStatement();
  }, [fetchChartInboxStatement]);

  const refetch = useCallback(() => {
    fetchChartInboxStatement();
  }, [fetchChartInboxStatement]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
