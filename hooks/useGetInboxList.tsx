/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, useState } from "react";
import { CHAT_INBOX_LIST_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "./useSocket";

// Type definitions for inbox list data
export interface InboxChatItemType {
  id: number;
  property_id: number;
  user_id: number | null;
  name: string;
  contact: string;
  visitor: string;
  visitor_ip: string;
  visitor_country: string;
  visitor_device: string;
  visitor_browser: string;
  visitor_os: string;
  navigator_title: string | null;
  last_visited_link: string;
  hash_slug: string;
  total_message: number;
  total_visit: number;
  status: number;
  monitoring_time: string;
  mouse_over_action: string;
  created_at: string;
  updated_at: string;
  chat_details_count: number;
  details_route: string;
}

export interface InboxPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface InboxPagination {
  current_page: number;
  data: InboxChatItemType[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: InboxPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface InboxListData {
  chats: InboxPagination;
  totalChats: number;
}

export interface InboxListResponse {
  status: boolean;
  message: string;
  data: InboxListData;
}


export const useGetInboxList = (
  status: 'all' | 'unanswered' | 'answered' | 'closed' | 'read' = 'unanswered',
  page = 1,
  perPage = 20
) => {
  const [data, setData] = useState<InboxListData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const { subscribeToChannel, unsubscribeFromChannel } = useSocket();

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${CHAT_INBOX_LIST_API}?status=${status}&page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: InboxListResponse = await res.json();
      setData(json.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch inbox data");
    } finally {
      setLoading(false);
    }
  }, [status, page, perPage, token]);

  // Handler for chat messages from any chat channel
  const handleChatMessage = useCallback((messageData: any) => {
    console.log("📨 Chat message received:", messageData);
    
    setData(prevData => {
      if (!prevData || !messageData.channel) return prevData;

      // Extract hash_slug from channel name (e.g., "chatting-event.XDR51WPI0PTSUXG" -> "XDR51WPI0PTSUXG")
      const hashSlug = messageData.channel.replace('chatting-event.', '');
      
      const updatedChats = prevData.chats.data.map(chat => {
        if (chat.hash_slug === hashSlug) {
          return {
            ...chat,
            total_message: chat.total_message + 1,
            updated_at: new Date().toISOString()
          };
        }
        return chat;
      });

      // Sort chats by updated_at (most recent first)
      updatedChats.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      return {
        ...prevData,
        chats: {
          ...prevData.chats,
          data: updatedChats
        }
      };
    });
  }, []);

  useEffect(() => {
    if (!token) return;

    fetchData();

    // Subscribe to general inbox updates
    const inboxChannel = 'inbox-updates';
    const inboxHandler = () => fetchData();

    subscribeToChannel(inboxChannel, inboxHandler);

    // Subscribe to all chatting events using a wildcard pattern
    // Note: You might need to adjust this based on your WebSocket server's wildcard support
    const chatChannel = 'chatting-event.*';
    subscribeToChannel(chatChannel, handleChatMessage);

    return () => {
      unsubscribeFromChannel(inboxChannel);
      unsubscribeFromChannel(chatChannel);
    };
  }, [token, fetchData, subscribeToChannel, unsubscribeFromChannel, handleChatMessage]);


  return { data, loading, error, refetch: fetchData };
};
