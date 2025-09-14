'use client';
import React, { useState } from 'react';
import ChatWidget from '@/components/chat/ChatWidget';

export default function ChatWidgetExample() {
  const [hashSlug, setHashSlug] = useState('demo-chat-room-123');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Socket.IO Chat Widget Example</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chat Room Hash Slug:
        </label>
        <input
          type="text"
          value={hashSlug}
          onChange={(e) => setHashSlug(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter chat room hash slug"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Widget */}
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Chat Widget</h2>
          <ChatWidget hash_slug={hashSlug} />
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Connection:</strong> The widget automatically connects to the WebSocket server when mounted.
            </div>
            <div>
              <strong>2. Channels:</strong> Subscribes to two channels:
              <ul className="ml-4 mt-1">
                <li>• chatting-event.{hashSlug}</li>
                <li>• user-typing-event.{hashSlug}</li>
              </ul>
            </div>
            <div>
              <strong>3. Sending Messages:</strong> Type a message and press Enter or click Send.
            </div>
            <div>
              <strong>4. Typing Status:</strong> Shows when other users are typing.
            </div>
            <div>
              <strong>5. Auto-scroll:</strong> Chat area automatically scrolls to show new messages.
            </div>
            <div>
              <strong>6. Reconnection:</strong> Automatically attempts to reconnect if connection is lost.
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Real-time messaging</li>
              <li>✅ Typing indicators</li>
              <li>✅ Auto-reconnection</li>
              <li>✅ Message timestamps</li>
              <li>✅ Connection status</li>
              <li>✅ Error handling</li>
              <li>✅ Cleanup on unmount</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="mt-8 bg-gray-900 text-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Usage Example:</h3>
        <pre className="text-sm overflow-x-auto">
{`import ChatWidget from '@/components/chat/ChatWidget';

function MyPage() {
  return (
    <ChatWidget 
      hash_slug="your-chat-room-id" 
      className="custom-styles"
    />
  );
}`}
        </pre>
      </div>
    </div>
  );
}
