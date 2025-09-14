import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { JOIN_CHAT_API } from '@/api/api';

export interface JoinChatData {
  message: string;
  type: string;
  sender_name: string;
  time: string;
  agent_image: string;
  visitor_image: string;
  file_count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file_list: any[];
}

export interface JoinChatResponse {
  status: boolean;
  message: string;
  data: JoinChatData;
}

export const useJoinChat = (hashSlug?: string) => {
  const [data, setData] = useState<JoinChatData | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state?.auth?.token);

  const joinChat = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${JOIN_CHAT_API}${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json: JoinChatResponse = await response.json();
      setData(json?.data);
    } catch (err) {
      console.error("Error joining chat", err);
      setError("Failed to join chat");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Automatically call joinChat when hashSlug changes
  useEffect(() => {
    if (hashSlug && token) {
      joinChat(hashSlug);
    } else {
      // Clear data when no hashSlug is provided
      setData(undefined);
      setError(null);
    }
  }, [hashSlug, token, joinChat]);

  return { data, loading, error, joinChat };
};
