/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSocket } from './useSocket';

// Types for socket chat functionality
export interface SocketMessage {
  id?: string;
  type: string;
  content: string;
  sender: string;
  timestamp?: string;
  channel?: string;
}

export interface TypingUser {
  user: string;
  isTyping: boolean;
  timestamp?: string;
}

export interface SocketChatOptions {
  hash_slug: string;
  autoConnect?: boolean;
  onMessage?: (message: SocketMessage) => void;
  onTyping?: (typingStatus: any) => void;
  onChatEnd?: () => void;
  onConnectionChange?: (state: any) => void;
}

export interface SocketChatReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: SocketMessage[];
  typingUsers: TypingUser[];
  sendMessage: (message: Partial<SocketMessage>) => boolean;
  sendTypingStatus: (isTyping: boolean, userName: string) => boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketChat = (options: SocketChatOptions): SocketChatReturn => {
  const {
    hash_slug,
    autoConnect = true,
    onMessage,
    onTyping,
    onChatEnd,
    onConnectionChange,
  } = options;

  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const messageIdCounter = useRef(0);
  const { 
    isConnected, 
    sendWSMessage, 
    subscribeToChannel, 
    unsubscribeFromChannel,
    getConnectionStatus 
  } = useSocket();

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${++messageIdCounter.current}`;
  }, []);

  // Handle incoming messages
  const handleIncomingMessage = useCallback((data: any) => {
    console.log('📨 Chat message received:', data);
    
    if (data.message) {
      const newMessage: SocketMessage = {
        id: data.message.id || generateMessageId(),
        type: data.message.type || 'message',
        content: data.message.content || data.message.message || '',
        sender: data.message.sender || data.message.sender_type || 'Unknown',
        timestamp: data.message.timestamp || new Date().toISOString(),
        channel: data.channel,
      };
      
      setMessages(prev => [...prev, newMessage]);
      onMessage?.(newMessage);
    }
  }, [generateMessageId, onMessage]);

  // Handle typing status updates
  const handleTypingStatus = useCallback((data: any) => {
    console.log('⌨️ Typing status received:', data);
    
    if (data.user && typeof data.isTyping === 'boolean') {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.user !== data.user);
        return data.isTyping ? [...filtered, { 
          user: data.user, 
          isTyping: true, 
          timestamp: data.timestamp || new Date().toISOString() 
        }] : filtered;
      });
    }
    
    onTyping?.(data);
  }, [onTyping]);

  // Handle connection changes
  const handleConnectionChange = useCallback(() => {
    const status = getConnectionStatus();
    console.log('🔄 Connection state changed:', status);
    onConnectionChange?.(status);
  }, [getConnectionStatus, onConnectionChange]);

  // Send message
  const sendMessage = useCallback((message: Partial<SocketMessage>): boolean => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send message - not connected');
      return false;
    }

    try {
      const messageData = {
        type: message.type || 'message',
        content: message.content || '',
        sender: message.sender || 'User',
        timestamp: new Date().toISOString(),
        id: message.id || generateMessageId(),
      };

      sendWSMessage(`chatting-event.${hash_slug}`, messageData);
      console.log('📤 Message sent:', messageData);
      return true;
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      setError('Failed to send message');
      return false;
    }
  }, [isConnected, hash_slug, sendWSMessage, generateMessageId]);

  // Send typing status
  const sendTypingStatus = useCallback((isTyping: boolean, userName: string): boolean => {
    if (!isConnected) {
      console.warn('⚠️ Cannot send typing status - not connected');
      return false;
    }

    try {
      const typingData = {
        user: userName,
        isTyping,
        timestamp: new Date().toISOString(),
      };

      sendWSMessage(`user-typing-event.${hash_slug}`, typingData);
      console.log('⌨️ Typing status sent:', typingData);
      return true;
    } catch (err) {
      console.error('❌ Failed to send typing status:', err);
      return false;
    }
  }, [isConnected, hash_slug, sendWSMessage]);

  // Connect to chat
  const connect = useCallback(() => {
    setIsConnecting(true);
    setError(null);
    console.log(`🔌 Connecting to chat: ${hash_slug}`);
  }, [hash_slug]);

  // Disconnect from chat
  const disconnect = useCallback(() => {
    setIsConnecting(false);
    console.log(`🔌 Disconnecting from chat: ${hash_slug}`);
  }, [hash_slug]);

  // Subscribe to chat channels when connected
  useEffect(() => {
    if (isConnected && hash_slug) {
      console.log(`📡 Subscribing to chat channels for: ${hash_slug}`);
      
      // Subscribe to chat messages
      subscribeToChannel(`chatting-event.${hash_slug}`, handleIncomingMessage);
      
      // Subscribe to typing events
      subscribeToChannel(`user-typing-event.${hash_slug}`, handleTypingStatus);

      return () => {
        console.log(`📡 Unsubscribing from chat channels for: ${hash_slug}`);
        unsubscribeFromChannel(`chatting-event.${hash_slug}`);
        unsubscribeFromChannel(`user-typing-event.${hash_slug}`);
      };
    }
  }, [isConnected, hash_slug, subscribeToChannel, unsubscribeFromChannel, handleIncomingMessage, handleTypingStatus]);

  // Handle connection status changes
  useEffect(() => {
    handleConnectionChange();
  }, [isConnected, handleConnectionChange]);

  // Auto-connect when component mounts
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting) {
      connect();
    }
  }, [autoConnect, isConnected, isConnecting, connect]);

  // Clear typing users after timeout
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => prev.filter(user => 
        Date.now() - new Date(user.timestamp || 0).getTime() < 3000
      ));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    messages,
    typingUsers,
    sendMessage,
    sendTypingStatus,
    connect,
    disconnect,
  };
};
