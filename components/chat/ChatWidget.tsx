'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSocketChat, SocketMessage } from '@/hooks/useSocketChat';

interface ChatWidgetProps {
  hash_slug: string;
  className?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  hash_slug, 
  className = '' 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('User');
  
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isConnected,
    isConnecting,
    error,
    messages,
    typingUsers,
    sendMessage,
    sendTypingStatus,
    connect,
    disconnect,
  } = useSocketChat({
    hash_slug,
    autoConnect: true,
    onMessage: (message: SocketMessage) => {
      console.log('New message received:', message);
    },
    onTyping: (typingStatus) => {
      console.log('Typing status:', typingStatus);
    },
    onChatEnd: () => {
      console.log('Chat ended');
      // Handle chat end logic here
    },
    onConnectionChange: (state) => {
      console.log('Connection state changed:', state);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle input change and typing status
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    // Send typing status
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      sendTypingStatus(true, userName);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing status
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false, userName);
    }, 1000);
  };

  // Send message
  const handleSendMessage = () => {
    if (inputMessage.trim() && isConnected) {
      const success = sendMessage({
        type: 'message',
        content: inputMessage.trim(),
        sender: userName,
      });

      if (success) {
        setInputMessage('');
        setIsTyping(false);
        sendTypingStatus(false, userName);
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className={`chat-widget ${className}`}>
      {/* Connection Status */}
      <div className="connection-status mb-4 p-2 rounded">
        {isConnecting && (
          <div className="text-yellow-600">Connecting...</div>
        )}
        {isConnected && (
          <div className="text-green-600">Connected</div>
        )}
        {error && (
          <div className="text-red-600">Error: {error}</div>
        )}
        {!isConnected && !isConnecting && !error && (
          <div className="text-gray-600">Disconnected</div>
        )}
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={chatAreaRef}
        className="chat-messages h-96 overflow-y-auto border border-gray-300 rounded p-4 mb-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet. Start a conversation!</div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id || index} className="message mb-3">
              <div className={`message-content p-2 rounded max-w-xs ${
                message.sender === userName 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-white border border-gray-300'
              }`}>
                <div className="message-text">{message.content}</div>
                <div className={`message-time text-xs mt-1 ${
                  message.sender === userName ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator text-gray-500 text-sm italic">
            {typingUsers.map((user, index) => (
              <span key={index}>
                {user.user} is typing...
                {index < typingUsers.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isConnected}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !inputMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>

      {/* Connection Controls */}
      <div className="connection-controls mt-4 flex gap-2">
        <button
          onClick={connect}
          disabled={isConnected || isConnecting}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
        >
          Disconnect
        </button>
      </div>

      {/* User Name Input */}
      <div className="user-name-input mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name:
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default ChatWidget;
