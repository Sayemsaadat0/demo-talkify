/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// Socket provider for inbox real-time updates
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SocketContextType {
  connected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscribeToInboxUpdates: (handler: (data: any) => void) => void;
  unsubscribeFromInboxUpdates: () => void;
  retryConnection: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const inboxHandler = useRef<((data: any) => void) | null>(null);
  const [connected, setConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [allowFallback, setAllowFallback] = useState(false);
  const maxRetries = 3; // Reduced retries for faster fallback
  const connectionTimeout = 8000; // 8 seconds
  const retryDelay = 2000; // 2 seconds
  const heartbeatInterval = 30000; // 30 seconds
  const timeoutMessageDelay = 10000; // Show timeout message after 10 seconds
  const fallbackDelay = 20000; // Allow fallback after 20 seconds
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutMessageRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (timeoutMessageRef.current) {
      clearTimeout(timeoutMessageRef.current);
      timeoutMessageRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  };


  const retryConnection = () => {
    console.log("🔄 Manual retry triggered");
    cleanup();
    setRetryCount(0);
    setConnectionStatus('connecting');
  };


  useEffect(() => {
    const scheduleRetry = () => {
      if (retryCount < maxRetries) {
        console.log(`🔄 Scheduling retry in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`);
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      } else {
        console.error("❌ Max retry attempts reached. WebSocket connection failed.");
        setConnectionStatus('error');
      }
    };

    const startHeartbeat = () => {
      cleanup();
      heartbeatTimeoutRef.current = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log("💓 Sending heartbeat...");
          try {
            ws.current.send(JSON.stringify({ action: "ping" }));
          } catch (error) {
            console.error("❌ Heartbeat failed:", error);
            setConnectionStatus('error');
            setConnected(false);
          }
        }
      }, heartbeatInterval);
    };

    const connectWebSocket = () => {
      cleanup();
      
      if (ws.current) {
        ws.current.close();
      }
      
      setConnectionStatus('connecting');
      setShowTimeoutMessage(false);
      console.log(`🔄 Attempting to connect to WebSocket... (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        console.error("⏰ Connection timeout");
        setConnectionStatus('error');
        setConnected(false);
        if (ws.current) {
          ws.current.close();
        }
        scheduleRetry();
      }, connectionTimeout);

      // Set timeout message timer
      timeoutMessageRef.current = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, timeoutMessageDelay);

      // Set fallback timer to allow page loading even if WebSocket fails
      fallbackTimeoutRef.current = setTimeout(() => {
        console.log("⚠️ WebSocket connection timeout - allowing fallback mode");
        setAllowFallback(true);
        setConnectionStatus('error');
      }, fallbackDelay);
      
      try {
        console.log("🔌 Creating WebSocket connection to: wss://staging.talkify.pro/ws/");
        ws.current = new WebSocket("wss://staging.talkify.pro/ws/");

        ws.current.onopen = () => {
          console.log("✅ WebSocket connected successfully");
          setConnected(true);
          setConnectionStatus('connected');
          setRetryCount(0);
          cleanup();
          startHeartbeat();
        };

        ws.current.onmessage = (evt) => {
          try {
            const data = JSON.parse(evt.data);
            console.log("📨 WebSocket message received:", data);
            
            // Handle heartbeat response
            if (data.action === 'pong') {
              console.log("💓 Heartbeat received");
              startHeartbeat(); // Reset heartbeat timer
              return;
            }
            
            // Handle inbox updates
            if (data.channel === 'inbox-updates' && inboxHandler.current) {
              inboxHandler.current(data);
            }
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error);
          }
        };

        ws.current.onclose = (event) => {
          console.log("⚠️ WebSocket disconnected", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            attempt: retryCount + 1
          });
          setConnected(false);
          setConnectionStatus('disconnected');
          cleanup();
          
          // Retry connection if it wasn't a clean close and we haven't exceeded max retries
          if (!event.wasClean && retryCount < maxRetries) {
            scheduleRetry();
          } else if (retryCount >= maxRetries) {
            setConnectionStatus('error');
          }
        };

        ws.current.onerror = (error) => {
          console.error("❌ WebSocket connection error:", {
            error: error || 'Unknown error',
            readyState: ws.current?.readyState,
            url: ws.current?.url,
            attempt: retryCount + 1,
            timestamp: new Date().toISOString()
          });
          setConnected(false);
          setConnectionStatus('error');
          cleanup();
          
          // Don't retry immediately on error, wait a bit
          if (retryCount < maxRetries) {
            scheduleRetry();
          }
        };
      } catch (error) {
        console.error("❌ Failed to create WebSocket:", error);
        setConnectionStatus('error');
        setConnected(false);
        cleanup();
        scheduleRetry();
      }
    };

    connectWebSocket();
    
    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      cleanup();
      ws.current?.close();
    };
  }, [retryCount, maxRetries, connectionTimeout, retryDelay]);

  const subscribeToInboxUpdates = (handler: (data: any) => void) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ Cannot subscribe: WebSocket not connected");
      return;
    }
    inboxHandler.current = handler;
    try {
      ws.current.send(JSON.stringify({ action: "subscribe", channel: "inbox-updates" }));
      console.log("✅ Subscribed to inbox-updates");
    } catch (error) {
      console.error("❌ Error subscribing to inbox-updates:", error);
    }
  };

  const unsubscribeFromInboxUpdates = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ Cannot unsubscribe: WebSocket not connected");
      return;
    }
    try {
      ws.current.send(JSON.stringify({ action: "unsubscribe", channel: "inbox-updates" }));
      console.log("✅ Unsubscribed from inbox-updates");
    } catch (error) {
      console.error("❌ Error unsubscribing from inbox-updates:", error);
    }
    inboxHandler.current = null;
  };

  // Don't render children until connection is established (unless fallback is allowed)
  if (!connected && !allowFallback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Connection Status */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
              connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <div className={`rounded-full h-3 w-3 mr-2 ${
                connectionStatus === 'connecting' ? 'animate-spin border-b-2 border-yellow-600' :
                connectionStatus === 'error' ? 'animate-spin border-b-2 border-red-600' :
                'border-b-2 border-gray-600'
              }`}></div>
              {connectionStatus === 'connecting' && `Connecting to chat... (${retryCount + 1}/${maxRetries + 1})`}
              {connectionStatus === 'error' && retryCount > 0 && `Retrying connection... (${retryCount}/${maxRetries})`}
              {connectionStatus === 'error' && retryCount === 0 && 'Connection failed'}
              {connectionStatus === 'disconnected' && 'Disconnected'}
            </div>

            {/* Main Message */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {connectionStatus === 'connecting' ? 'Connecting to Chat Server' :
                 connectionStatus === 'error' ? 'Connection Failed' :
                 'Establishing Connection'}
              </h2>
              <p className="text-gray-600">
                {connectionStatus === 'connecting' ? 'Please wait while we establish a secure connection to the chat server.' :
                 connectionStatus === 'error' ? 'Unable to connect to the chat server. This may be due to network issues or server maintenance.' :
                 'Setting up real-time communication...'}
              </p>
            </div>

            {/* Connection Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Connection Details:</div>
                <div className="text-xs text-gray-600">
                  WebSocket: <code className="bg-gray-200 px-1 rounded">wss://staging.talkify.pro/ws/</code>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Status: <span className={`font-medium ${
                    connectionStatus === 'connecting' ? 'text-yellow-600' :
                    connectionStatus === 'error' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>{connectionStatus}</span>
                </div>
              </div>
            </div>

            {/* Timeout Message */}
            {showTimeoutMessage && connectionStatus === 'connecting' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-yellow-800">
                  <div className="font-medium mb-1">⏱️ Connection Taking Longer Than Expected</div>
                  <div className="text-xs text-yellow-700">
                    This might be due to network conditions or server load. We&apos;ll keep trying to connect.
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {connectionStatus === 'error' && retryCount >= maxRetries && (
              <div className="space-y-3">
                <button
                  onClick={retryConnection}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
                <div className="text-xs text-gray-500">
                  If the problem persists, please check your internet connection or contact support.
                </div>
              </div>
            )}

            {/* Loading Animation */}
            {connectionStatus === 'connecting' && (
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${Math.min(((retryCount + 1) / (maxRetries + 1)) * 100, 90)}%` 
                    }}
                  ></div>
                </div>
                
                {/* Loading Dots */}
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <SocketContext.Provider value={{ 
      connected, 
      connectionStatus, 
      subscribeToInboxUpdates, 
      unsubscribeFromInboxUpdates, 
      retryConnection 
    }}>
      {!connected && allowFallback && (
        <div className="bg-yellow-100 border-b border-yellow-400 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="animate-pulse w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
              <span className="text-sm text-yellow-800">
                Real-time updates unavailable. Some features may be limited.
              </span>
            </div>
            <button
              onClick={retryConnection}
              className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketProvider = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocketProvider must be used inside a SocketProvider");
  return context;
};
