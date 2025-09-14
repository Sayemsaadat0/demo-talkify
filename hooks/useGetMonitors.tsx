'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GET_MONITORS_API } from "@/api/api";

export interface MonitorChat {
  id: number;
  property_id: string;
  visitor_name: string;
  visitor_email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MonitorsData {
  count: number;
  chat: MonitorChat[];
}

export interface MonitorsResponse {
  status: boolean;
  message: string;
  data: MonitorsData;
}

interface UseGetMonitorsProps {
  enabled?: boolean;
}

export const useGetMonitors = ({ enabled = true }: UseGetMonitorsProps = {}) => {
  const [data, setData] = useState<MonitorsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchMonitors = useCallback(async () => {
    if (!token || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GET_MONITORS_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: MonitorsResponse = await response.json();
      
      if (result.status) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch monitors data');
      }
    } catch (err) {
      console.error('Error fetching monitors data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching monitors data');
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  const refetch = useCallback(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
