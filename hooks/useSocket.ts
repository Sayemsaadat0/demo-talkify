import { useEffect, useRef, useCallback } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

export function useSocket() {
  const ws = useRef<WebSocket | null>(null);
  const channels = useRef<Record<string, (data: any) => void>>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second
  const isConnected = useRef(false);

  const reconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log(`🚫 WebSocket: Max reconnection attempts (${maxReconnectAttempts}) reached. Giving up.`);
      return;
    }

    const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current); // Exponential backoff
    console.log(`🔄 WebSocket: Attempting reconnection ${reconnectAttempts.current + 1}/${maxReconnectAttempts} in ${delay}ms...`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttempts.current++;
      connect();
    }, delay);
  };

  const connect = () => {
    // Don't create multiple connections
    if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
      console.log("🔄 WebSocket: Already connecting, waiting...");
      return;
    }
    
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("✅ WebSocket: Already connected");
      return;
    }
    
    console.log("🔄 WebSocket: Attempting to connect...");
    ws.current = new WebSocket("wss://staging.talkify.pro/ws/");

    ws.current.onopen = () => {
      console.log("✅ WebSocket: Connected successfully!");
      console.log(`📡 WebSocket: Ready state: ${ws.current?.readyState} (OPEN)`);
      isConnected.current = true;
      
      // Reset reconnection attempts on successful connection
      reconnectAttempts.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Subscribe to global channels (always)
      subscribe("global-notifications", (data) => console.log("Global notification:", data));
      subscribe("system-events", (data) => console.log("System event:", data));
      
      // Note: Chat-specific channels will be subscribed manually via switchToChat()
    };

    ws.current.onmessage = (evt) => {
      console.log("📨 WebSocket: Message received:", evt.data);
      const data = JSON.parse(evt.data);
      
      // Try exact channel match first
      let handler = channels.current[data.channel];
      
      // If no exact match, try wildcard patterns
      if (!handler && data.channel) {
        Object.keys(channels.current).forEach(channelPattern => {
          if (channelPattern.includes('*')) {
            const regex = new RegExp(channelPattern.replace(/\*/g, '.*'));
            if (regex.test(data.channel)) {
              handler = channels.current[channelPattern];
              console.log(`🎯 WebSocket: Matched wildcard pattern ${channelPattern} for ${data.channel}`);
            }
          }
        });
      }
      
      if (handler) {
        console.log(`🎯 WebSocket: Handling message for channel: ${data.channel}`);
        handler(data);
      } else {
        console.warn(`⚠️ WebSocket: No handler found for channel: ${data.channel}`);
        console.log(`📋 WebSocket: Available channels:`, Object.keys(channels.current));
      }
    };

    ws.current.onclose = (event) => {
      console.log("❌ WebSocket: Connection closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      isConnected.current = false;
      
      // Attempt to reconnect unless it was a clean close or we've reached max attempts
      if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
        reconnect();
      } else if (event.wasClean) {
        console.log("✅ WebSocket: Connection closed cleanly - no reconnection needed");
      }
    };
    
    ws.current.onerror = () => {
    //   console.error("💥 WebSocket: Connection error", e);
      console.log(`🔍 WebSocket: Current ready state: ${ws.current?.readyState}`);
      
      // Trigger reconnection on error
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnect();
      }
    };
  };

  const subscribeToChatChannels = useCallback((hash_slug: string) => {
    if (!hash_slug) return;
    
    console.log(`📡 WebSocket: Subscribing to chat channels for ${hash_slug}`);
    subscribe(`chatting-event.${hash_slug}`, (data) => console.log("Chat message:", data));
    subscribe(`user-typing-event.${hash_slug}`, (data) => console.log("Typing:", data));
  }, []);

  const subscribe = (channel: string, handler: (data: any) => void) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log(`📡 WebSocket: Subscribing to channel: ${channel}`);
      ws.current.send(JSON.stringify({ action: "subscribe", channel }));
      channels.current[channel] = handler;
      console.log(`✅ WebSocket: Successfully subscribed to ${channel}`);
    } else {
      console.warn(`⚠️ WebSocket: Cannot subscribe to ${channel} - connection not ready (state: ${ws.current?.readyState})`);
    }
  };

  const unsubscribeAll = () => {
    if (ws.current) {
      console.log(`🔌 WebSocket: Unsubscribing from all channels...`);
      Object.keys(channels.current).forEach((channel) => {
        console.log(`📡 WebSocket: Unsubscribing from ${channel}`);
        ws.current?.send(JSON.stringify({ action: "unsubscribe", channel }));
        delete channels.current[channel];
      });
      console.log("✅ WebSocket: Unsubscribed from all channels");
    }
  };

  const disconnect = useCallback(() => {
    console.log("🔌 WebSocket: Disconnecting...");
    
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Unsubscribe from all channels
    unsubscribeAll();
    
    // Close the connection cleanly
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close(1000, "Component unmounting");
    }
    
    ws.current = null;
    console.log("✅ WebSocket: Disconnected");
  }, []);

  const sendWSMessage = useCallback((channel: string, message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log(`📤 WebSocket: Sending message to ${channel}:`, message);
      ws.current.send(JSON.stringify({ action: "message", channel, message }));
    } else {
      console.warn(`⚠️ WebSocket: Cannot send message to ${channel} - connection not ready (state: ${ws.current?.readyState})`);
    }
  }, []);

  const getConnectionStatus = useCallback(() => {
    if (!ws.current) {
      console.log("🔍 WebSocket: No connection instance");
      return "No connection";
    }
    
    const states = {
      0: "CONNECTING",
      1: "OPEN", 
      2: "CLOSING",
      3: "CLOSED"
    };
    
    const status = states[ws.current.readyState as keyof typeof states] || "UNKNOWN";
    console.log(`🔍 WebSocket: Connection status: ${status} (${ws.current.readyState})`);
    return status;
  }, []);

  const switchToChat = useCallback((newHashSlug: string) => {
    if (!newHashSlug) {
      console.warn("⚠️ WebSocket: Cannot switch to chat - no hash_slug provided");
      return;
    }

    // Unsubscribe from previous chat channels
    Object.keys(channels.current).forEach((channel) => {
      if (channel.includes('chatting-event.') || channel.includes('user-typing-event.')) {
        console.log(`📡 WebSocket: Unsubscribing from ${channel}`);
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ action: "unsubscribe", channel }));
        }
        delete channels.current[channel];
      }
    });

    // Subscribe to new chat channels
    subscribeToChatChannels(newHashSlug);
    console.log(`✅ WebSocket: Switched to chat ${newHashSlug}`);
  }, [subscribeToChatChannels]);

  const subscribeToChannel = useCallback((channel: string, handler: (data: any) => void) => {
    subscribe(channel, handler);
  }, []);

  const unsubscribeFromChannel = useCallback((channel: string) => {
    if (channels.current[channel]) {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log(`📡 WebSocket: Unsubscribing from ${channel}`);
        ws.current.send(JSON.stringify({ action: "unsubscribe", channel }));
      }
      delete channels.current[channel];
      console.log(`✅ WebSocket: Unsubscribed from ${channel}`);
    }
  }, []);

  useEffect(() => {
    // Always connect, regardless of hash_slug
    connect();
    return () => disconnect();
  }, []); // Remove hash_slug dependency

  return { 
    sendWSMessage, 
    getConnectionStatus, 
    disconnect, 
    switchToChat,
    subscribeToChannel,
    unsubscribeFromChannel,
    isConnected: isConnected.current
  };
}
