'use client';
import { InboxChatItemType } from '@/hooks/useGetInboxList';
import { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatBox } from './ChatBox';
export default function InboxContent() {
  const [selectedChat, setSelectedChat] = useState<InboxChatItemType | null>(null);

  // Clear selected chat when filter changes
  const handleFilterChange = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <div className=' h-screen overflow-y-auto flex' style={{ maxHeight: 'calc(100vh - 115px)' }}>
        {/* Left side: Inbox */}
        <ChatList 
          selectedChat={selectedChat} 
          onSelect={(chat: InboxChatItemType) => setSelectedChat(chat)}
          onFilterChange={handleFilterChange}
        />

        {/* Right side: Chat window OR fallback */}
        <div style={{ flex: 1, border: '1px solid #ccc', }} className='custom-scroll'>
          {selectedChat ? (
            <ChatBox
              hash_slug={selectedChat.hash_slug}
              chatStatus={selectedChat.status}
              chatData={selectedChat}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white p-6">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <svg
                  className="w-12 h-12 text-gray-400 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-gray-700 text-lg font-medium mb-2 text-center">
                👉 Select a conversation to start chatting
              </h2>
              {/* <p className="text-gray-400 text-sm max text-center">
                Your chats will appear here. Click on any conversation from the list to view messages.
              </p> */}
            </div>

          )}
        </div>
      </div>
    </>
  );
}
