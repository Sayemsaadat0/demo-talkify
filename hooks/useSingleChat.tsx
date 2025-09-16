import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SINGLE_CHAT_API } from '@/api/api';

export interface ChatDetail {
  id: number;
  property_id: number;
  chat_id: number;
  name: string | null;
  contact: string | null;
  message: string;
  link: string | null;
  file: string | null;
  status: number;
  type: string;
  created_at: string;
  updated_at: string;
  file_count: number;
  file_list: unknown[];
}

export interface Chat {
  id: number;
  property_id: number;
  user_id: number;
  name: string;
  contact: string;
  visitor: string;
  visitor_ip: string;
  visitor_country: string;
  visitor_device: string;
  visitor_browser: string;
  visitor_os: string;
  navigator_title: string;
  last_visited_link: string;
  hash_slug: string;
  total_message: number;
  total_visit: number;
  status: number;
  monitoring_time: string;
  mouse_over_action: string | null;
  created_at: string;
  updated_at: string;
  details_route: string;
  chat_details: ChatDetail[];
}

export interface Shortcut {
  id: number;
  property_id: number;
  user_id: number;
  key: string;
  message: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  property_id: number;
  title: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface SingleChatData {
  chat: Chat;
  shortcuts: Shortcut[];
  notes: Note[];
}

export interface SingleChatResponse {
  status: boolean;
  message: string;
  data: SingleChatData;
}

export const useSingleChat = (hashSlug?: string) => {
  const [data, setData] = useState<SingleChatData | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state?.auth?.token);

  const fetchSingleChat = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${SINGLE_CHAT_API}${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json: SingleChatResponse = await response.json();
      setData(json?.data);
      
    } catch (err) {
      console.error("Error fetching single chat", err);
      setError("Failed to fetch chat details");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [token]);



  // Automatically call fetchSingleChat when hashSlug changes
  useEffect(() => {
    if (hashSlug && token) {
      fetchSingleChat(hashSlug);
    } else {
      // Clear data when no hashSlug is provided
      setData(undefined);
      setError(null);
    }
  }, [hashSlug, token, fetchSingleChat]);

  return { 
    data, 
    loading, 
    error, 
    fetchSingleChat
  };
};
