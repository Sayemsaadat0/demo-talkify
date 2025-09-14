import { GET_PROPERTY_DETAILS_API } from "@/api/api";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export interface PropertyDetails {
  id: number;
  user_id: number;
  property_name: string;
  site_url: string;
  property_id: string;
  image: string | null;
  driver: string | null;
  status: number;
  region: string | null;
  visitor_ip_tracking: number;
  total_incoming_visitors: number;
  report_sent: string;
  created_at: string;
  updated_at: string;
  image_url: string
}

export type PropertyDetailsApiResponse = {
  status: boolean;
  message: string;
  data: {
    property: PropertyDetails;
  };
};

export const useGetPropertyDetails = ({ propertyId }: { propertyId?: string }) => {
  const [data, setData] = useState<PropertyDetails | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = useCallback(async () => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${GET_PROPERTY_DETAILS_API}${propertyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json: PropertyDetailsApiResponse = await response.json();

      if (json.status && json.data?.property) {
        setData(json.data.property);
      } else {
        throw new Error(json.message || "Failed to fetch property details");
      }
    } catch (err) {
      console.error("Error fetching property details", err);
      setError(err instanceof Error ? err.message : "Failed to fetch property details");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [propertyId, token]);

  useEffect(() => {
    if (token && propertyId) {
      fetchData();
    }
  }, [fetchData, token, propertyId]);

  const refetch = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    await fetchData();
  };

  return { data, loading, error, refetch };
};
