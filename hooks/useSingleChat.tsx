/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
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
  file_list: any[];
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
  const { subscribeToChannel, unsubscribeFromChannel } = useSocket();

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

  // Real-time message handler for chat updates
  const handleRealTimeMessage = useCallback((messageData: any) => {
    console.log("💬 useSingleChat: Real-time message received:", messageData);
    
    if (!data) return;

    // Extract message content - handle both string and object formats
    let messageContent = '';
    let messageType = 'visitor';
    let senderName = null;
    let messageTime = new Date().toISOString();
    let fileCount = 0;
    let fileList: any[] = [];

    if (typeof messageData.message === 'string') {
      // Direct string message
      messageContent = messageData.message;
      messageType = messageData.type || 'visitor';
      senderName = messageData.sender_name || null;
      messageTime = messageData.time || messageTime;
      fileCount = messageData.file_count || 0;
      fileList = messageData.file_list || [];
    } else if (messageData.message && typeof messageData.message === 'object') {
      // Message is an object with nested structure
      messageContent = messageData.message.message || '';
      messageType = messageData.message.type || 'visitor';
      senderName = messageData.message.sender_name || null;
      messageTime = messageData.message.time || messageTime;
      fileCount = messageData.message.file_count || 0;
      fileList = messageData.message.file_list || [];
    } else {
      console.warn("💬 useSingleChat: Invalid message format:", messageData);
      return;
    }

    if (!messageContent) return;

    // Parse the time properly - handle different time formats
    let parsedTime = messageTime;
    if (messageTime && typeof messageTime === 'string' && messageTime !== new Date().toISOString()) {
      try {
        // Handle formats like "14 Sep 06.09am"
        if (messageTime.includes('am') || messageTime.includes('pm')) {
          // Convert to ISO format
          const now = new Date();
          const currentYear = now.getFullYear();
          const timeStr = messageTime.replace(/(\d{1,2})\s+(\w{3})\s+(\d{1,2}\.\d{2})(am|pm)/, (match, day, month, time, period) => {
            const monthMap: { [key: string]: string } = {
              'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
              'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
              'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
            };
            const [hours, minutes] = time.split('.');
            let hour24 = parseInt(hours);
            if (period === 'pm' && hour24 !== 12) hour24 += 12;
            if (period === 'am' && hour24 === 12) hour24 = 0;
            return `${currentYear}-${monthMap[month]}-${day.padStart(2, '0')}T${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00.000Z`;
          });
          parsedTime = timeStr;
        }
        
        // Validate the parsed date
        const testDate = new Date(parsedTime);
        if (isNaN(testDate.getTime())) {
          parsedTime = new Date().toISOString();
        }
      } catch (error) {
        console.warn("💬 useSingleChat: Failed to parse time:", messageTime, error);
        parsedTime = new Date().toISOString();
      }
    }

    // Create new message object from WebSocket data
    const newMessage: ChatDetail = {
      id: Date.now(), // Temporary ID for real-time messages
      property_id: data.chat.property_id,
      chat_id: data.chat.id,
      name: senderName,
      contact: null,
      message: messageContent,
      link: null,
      file: null,
      status: 1,
      type: messageType,
      created_at: parsedTime,
      updated_at: new Date().toISOString(),
      file_count: fileCount,
      file_list: fileList
    };

    // Add new message to chat details
    setData(prevData => {
      if (!prevData) return prevData;

      // Check if message already exists (prevent duplicates)
      const messageExists = prevData.chat.chat_details.some(
        msg => msg.message === messageContent && 
               Math.abs(new Date(msg.created_at).getTime() - new Date(parsedTime).getTime()) < 5000
      );

      if (messageExists) {
        console.log("💬 useSingleChat: Message already exists, skipping");
        return prevData;
      }

      console.log("💬 useSingleChat: Adding new message to chat:", newMessage);

      return {
        ...prevData,
        chat: {
          ...prevData.chat,
          chat_details: [...prevData.chat.chat_details, newMessage],
          total_message: prevData.chat.total_message + 1,
          updated_at: new Date().toISOString()
        }
      };
    });
  }, [data]);

  // Subscribe to real-time chat messages
  useEffect(() => {
    if (hashSlug && token) {
      console.log(`💬 useSingleChat: Subscribing to chat messages for ${hashSlug}`);
      
      const chatChannel = `chatting-event.${hashSlug}`;
      subscribeToChannel(chatChannel, handleRealTimeMessage);

      return () => {
        console.log(`💬 useSingleChat: Unsubscribing from chat messages for ${hashSlug}`);
        unsubscribeFromChannel(chatChannel);
      };
    }
  }, [hashSlug, token, subscribeToChannel, unsubscribeFromChannel, handleRealTimeMessage]);

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

  return { data, loading, error, fetchSingleChat };
};
