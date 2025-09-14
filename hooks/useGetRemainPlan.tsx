'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { REMAIN_PLAN_API } from "@/api/api";

export interface RemainPlanData {
  remainProperty: number;
  totalProperty: number;
  percentProperty: number;
  remainMembers: number;
  totalMember: number;
  percentMember: number;
  remainVisitors: number;
  totalVisitors: number;
  percentVisitor: number;
  remainKb: number;
  totalKb: number;
  percentKb: number;
}

export interface RemainPlanResponse {
  status: boolean;
  message: string;
  data: RemainPlanData;
}

interface UseGetRemainPlanProps {
  enabled?: boolean;
}

export const useGetRemainPlan = ({ enabled = true }: UseGetRemainPlanProps = {}) => {
  const [data, setData] = useState<RemainPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchRemainPlan = useCallback(async () => {
    if (!token || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(REMAIN_PLAN_API, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: RemainPlanResponse = await response.json();
      
      if (result.status) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch remain plan data');
      }
    } catch (err) {
      console.error('Error fetching remain plan data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching remain plan data');
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    fetchRemainPlan();
  }, [fetchRemainPlan]);

  const refetch = useCallback(() => {
    fetchRemainPlan();
  }, [fetchRemainPlan]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
