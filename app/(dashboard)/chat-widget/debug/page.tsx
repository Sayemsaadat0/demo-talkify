'use client';
import React, { useState, useEffect } from 'react';
import { useSocketChat } from '@/hooks/useSocketChat';

export default function SocketDebugPage() {
  const [hashSlug, setHashSlug] = useState('test-room-123');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
  } = useSocketChat({
    hash_slug: hashSlug,
    autoConnect: false, // Manual connection for debugging
    onMessage: (message) => addLog(`📨 Message received: ${JSON.stringify(message)}`),
    onTyping: (status) => addLog(`⌨️ Typing status: ${JSON.stringify(status)}`),
    onChatEnd: () => addLog('🔚 Chat ended'),
    onConnectionChange: (state) => addLog(`🔄 Connection state: ${JSON.stringify(state)}`),
  });

  useEffect(() => {
    addLog('🚀 Socket Debug Page Loaded');
  }, []);

  const handleConnect = () => {
    addLog('🔌 Attempting to connect...');
    connect();
  };

  const handleDisconnect = () => {
    addLog('🔌 Disconnecting...');
    disconnect();
  };

  const handleTestMessage = () => {
    if (isConnected) {
      addLog('📤 Sending test message...');
      const success = sendMessage({
        type: 'message',
        content: 'Hello from debug page!',
        sender: 'Debug User',
      });
      addLog(success ? '✅ Message sent successfully' : '❌ Failed to send message');
    } else {
      addLog('❌ Cannot send message - not connected');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Socket.IO Debug Page</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              isConnected ? 'bg-green-100 text-green-800' : 
              isConnecting ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {isConnected ? '✅ Connected' : isConnecting ? '🔄 Connecting' : '❌ Disconnected'}
            </span>
          </div>
          <div>
            <strong>Error:</strong> 
            <span className="ml-2 text-red-600">{error || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hash Slug:
            </label>
            <input
              type="text"
              value={hashSlug}
              onChange={(e) => setHashSlug(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter hash slug"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleConnect}
              disabled={isConnected || isConnecting}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Connect
            </button>
            <button
              onClick={handleDisconnect}
              disabled={!isConnected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              Disconnect
            </button>
            <button
              onClick={handleTestMessage}
              disabled={!isConnected}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Send Test Message
            </button>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Debug Logs</h2>
          <button
            onClick={() => setLogs([])}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
        <div className="h-96 overflow-y-auto bg-gray-50 p-3 rounded border">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center">No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Server Info */}
      <div className="mt-6 p-4 border rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Server Information</h3>
        <div className="text-sm space-y-1">
          <div><strong>Server URL:</strong> https://staging.talkify.pro</div>
          <div><strong>Transports:</strong> websocket, polling</div>
          <div><strong>Auto Connect:</strong> false (manual)</div>
          <div><strong>Reconnection:</strong> enabled</div>
        </div>
      </div>
    </div>
  );
}
