import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SINGLE_CHAT_API } from '@/api/api';
import { useSocket } from './useSocket';

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
  const [realtimeMessages, setRealtimeMessages] = useState<ChatDetail[]>([]);
  const isSubscribed = useRef(false);
  const recentlySentMessages = useRef<Set<string>>(new Set());

  const token = useSelector((state: RootState) => state?.auth?.token);
  const { subscribeToChannel, unsubscribeFromChannel, getConnectionStatus } = useSocket();

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
      
      // Clear realtime messages and recently sent messages when fetching fresh data
      setRealtimeMessages([]);
      recentlySentMessages.current.clear();
    } catch (err) {
      console.error("Error fetching single chat", err);
      setError("Failed to fetch chat details");
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Handle incoming WebSocket messages
  const handleRealtimeMessage = useCallback((messageData: unknown) => {
    console.log("📨 useSingleChat: Real-time message received:", messageData);
    
    const data = messageData as { message?: Record<string, unknown> };
    if (data.message) {
      const msg = data.message;
      const messageText = (msg.message as string) || (msg.content as string) || '';
      const messageType = (msg.type as string) || (msg.sender_type as string) || 'user';
      
      // Temporarily disable filtering to debug
      console.log("📨 useSingleChat: Message details:", {
        messageText,
        messageType,
        isAdmin: messageType === 'admin',
        isRecentlySent: recentlySentMessages.current.has(messageText),
        recentlySentMessages: Array.from(recentlySentMessages.current)
      });
      
      // Check if this is a message we recently sent (admin type with same content)
      if (messageType === 'admin' && recentlySentMessages.current.has(messageText)) {
        console.log("📨 useSingleChat: Skipping recently sent message:", messageText);
        return;
      }
      
      const newMessage: ChatDetail = {
        id: (msg.id as number) || Date.now(),
        property_id: (msg.property_id as number) || 0,
        chat_id: (msg.chat_id as number) || 0,
        name: (msg.name as string) || null,
        contact: (msg.contact as string) || null,
        message: messageText,
        link: (msg.link as string) || null,
        file: (msg.file as string) || null,
        status: (msg.status as number) || 1,
        type: messageType,
        created_at: (msg.created_at as string) || (msg.timestamp as string) || new Date().toISOString(),
        updated_at: (msg.updated_at as string) || new Date().toISOString(),
        file_count: (msg.file_count as number) || 0,
        file_list: (msg.file_list as unknown[]) || []
      };

      // Check if message already exists in realtime messages
      setRealtimeMessages(prev => {
        const exists = prev.some(existingMsg => 
          existingMsg.id === newMessage.id || 
          (existingMsg.message === newMessage.message && existingMsg.created_at === newMessage.created_at)
        );
        
        if (exists) {
          console.log("📨 useSingleChat: Message already exists, skipping duplicate");
          return prev;
        }
        
        console.log("📨 useSingleChat: Adding new real-time message");
        return [...prev, newMessage];
      });
    }
  }, []);

  // Subscribe to WebSocket events for real-time updates
  useEffect(() => {
    if (hashSlug && !isSubscribed.current) {
      console.log(`📡 useSingleChat: Subscribing to real-time updates for ${hashSlug}`);
      console.log(`📡 useSingleChat: WebSocket connection status:`, getConnectionStatus());
      const channel = `chatting-event.${hashSlug}`;
      console.log(`📡 useSingleChat: Channel: ${channel}`);
      subscribeToChannel(channel, handleRealtimeMessage);
      isSubscribed.current = true;
      
      return () => {
        console.log(`📡 useSingleChat: Unsubscribing from real-time updates for ${hashSlug}`);
        unsubscribeFromChannel(channel);
        isSubscribed.current = false;
      };
    } else if (!hashSlug) {
      console.log(`📡 useSingleChat: No hashSlug provided, skipping subscription`);
    } else if (isSubscribed.current) {
      console.log(`📡 useSingleChat: Already subscribed to ${hashSlug}`);
    }
  }, [hashSlug, subscribeToChannel, unsubscribeFromChannel, handleRealtimeMessage, getConnectionStatus]);

  // Automatically call fetchSingleChat when hashSlug changes
  useEffect(() => {
    if (hashSlug && token) {
      fetchSingleChat(hashSlug);
    } else {
      // Clear data when no hashSlug is provided
      setData(undefined);
      setError(null);
      setRealtimeMessages([]);
      recentlySentMessages.current.clear();
    }
  }, [hashSlug, token, fetchSingleChat]);

  // Function to mark a message as recently sent
  const markMessageAsSent = useCallback((messageText: string) => {
    console.log("📝 useSingleChat: Marking message as sent:", messageText);
    console.log("📝 useSingleChat: Current recently sent messages:", Array.from(recentlySentMessages.current));
    recentlySentMessages.current.add(messageText);
    console.log("📝 useSingleChat: After adding, recently sent messages:", Array.from(recentlySentMessages.current));
    
    // Remove from recently sent after 10 seconds to allow for server processing
    setTimeout(() => {
      recentlySentMessages.current.delete(messageText);
      console.log("🗑️ useSingleChat: Removed message from recently sent:", messageText);
      console.log("🗑️ useSingleChat: After removing, recently sent messages:", Array.from(recentlySentMessages.current));
    }, 10000);
  }, []);

  // Combine server data with real-time messages
  const combinedData = data ? {
    ...data,
    chat: {
      ...data.chat,
      chat_details: [...(data.chat.chat_details || []), ...realtimeMessages]
    }
  } : undefined;

  return { 
    data: combinedData, 
    loading, 
    error, 
    fetchSingleChat,
    realtimeMessages,
    markMessageAsSent
  };
};
