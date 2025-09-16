/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Handler = (data: any) => void;

interface SocketContextType {
  connected: boolean;
  subscribe: (channel: string, handler: Handler) => void;
  unsubscribe: (channel: string) => void;
  unsubscribeAll: () => void;
  eventData?: any,

}

const SocketContext = createContext<SocketContextType>({
  connected: false,
  subscribe: () => { },
  eventData: null,
  unsubscribe: () => { },
  unsubscribeAll: () => { },
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null); // WebSocket instance
  const [connected, setConnected] = useState(false); // connection state
  const channels = useRef<Record<string, Handler>>({}); // map of subscribed channels
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null); // reconnect timer
  const [eventData, setEventData] = useState<any>(null)

  const connect = () => {
    ws.current = new WebSocket('wss://staging.talkify.pro/ws/');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);

      // Re-subscribe to all channels after reconnect
      Object.keys(channels.current).forEach((channel) => {
        ws.current?.send(JSON.stringify({ action: 'subscribe', channel }));
        console.log('Resubscribed to', channel);
      });
    };

    ws.current.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        // how can i get this data globally 
        setEventData(data); // store globally
        // console.log(data)
        const handler = channels.current[data.channel];
        if (handler) handler(data);
      } catch (err) {
        console.error('Error parsing WebSocket message', err);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed, attempting to reconnect...');
      setConnected(false);
      attemptReconnect();
    };

    ws.current.onerror = () => {
        // console 
      setConnected(false);
      ws.current?.close(); // ensure onclose triggers
    };
  };

  /**
   * Attempts to reconnect the WebSocket after a delay (3 seconds).
   * Prevents multiple simultaneous reconnect attempts.
   */
  const attemptReconnect = () => {
    if (reconnectTimeout.current) return;
    reconnectTimeout.current = setTimeout(() => {
      console.log('Reconnecting WebSocket...');
      connect();
      reconnectTimeout.current = null;
    }, 3000);
  };

  /**
   * Subscribes to a specific channel.
   * @param channel - the channel name to subscribe
   * @param handler - function to handle messages from this channel
   */
  const subscribe = (channel: string, handler: Handler) => {
    if (!channels.current[channel]) {
      channels.current[channel] = handler;
      if (connected) {
        ws.current?.send(JSON.stringify({ action: 'subscribe', channel }));
        console.log('Subscribed to', channel);
      }
    }
  };

  /**
   * Unsubscribes from a specific channel.
   * @param channel - the channel name to unsubscribe
   */
  const unsubscribe = (channel: string) => {
    if (channels.current[channel]) {
      if (connected) {
        ws.current?.send(JSON.stringify({ action: 'unsubscribe', channel }));
        console.log('Unsubscribed from', channel);
      }
      delete channels.current[channel];
    }
  };

  /**
   * Unsubscribes from all channels at once.
   * Useful when closing the component or leaving a chat room.
   */
  const unsubscribeAll = () => {
    Object.keys(channels.current).forEach(unsubscribe);
  };

  /**
   * Connect WebSocket when provider mounts.
   * Cleanup on unmount by clearing reconnect timer and closing WebSocket.
   */
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ connected, subscribe, unsubscribe, unsubscribeAll,eventData }}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Custom hook to access the WebSocket context easily.
 */
export const useSocket = () => useContext(SocketContext);
