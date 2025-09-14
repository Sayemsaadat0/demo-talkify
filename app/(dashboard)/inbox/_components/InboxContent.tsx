/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { InboxChatItemType, useGetInboxList } from '@/hooks/useGetInboxList';
import { useSingleChat, SingleChatData } from '@/hooks/useSingleChat';
import { useSocketProvider } from './useSocketProvider';
import { CheckCircle } from 'lucide-react';
import { getFirstLetter, formatTime } from '@/lib/chatUtils';
import { useState, useEffect, useCallback } from 'react';
import { ChatList } from './ChatList';
import { ChatBox } from './ChatBox';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CHAT_INBOX_LIST_API } from '@/api/api';

// User Details Component
const UserDetails = ({
  selectedChatData,
  singleChatData
}: {
  selectedChatData: InboxChatItemType | null;
  singleChatData: SingleChatData | undefined;
}) => {
  return (
    <div className="lg:col-span-1 bg-white border-l border-gray-200 flex flex-col shadow-sm min-h-0 w-full h-full">
      {selectedChatData ? (
        <>
          {/* User Info */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full backdrop-blur-sm bg-white/20 border border-white/30 shadow-lg flex items-center justify-center text-xl font-semibold text-gray-700 relative overflow-hidden mx-auto mb-3">
                {/* Glassmorphism background effect with status-based colors */}
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedChatData.status === 0 ? 'from-red-500/20 to-red-400/10' :
                  selectedChatData.status === 1 ? 'from-green-500/20 to-green-400/10' :
                    selectedChatData.status === 2 ? 'from-gray-500/20 to-gray-400/10' :
                      selectedChatData.status === 3 ? 'from-blue-500/20 to-blue-400/10' :
                        'from-gray-500/20 to-gray-400/10'
                  } rounded-full`}></div>
                <span className="relative z-10">{selectedChatData.visitor.charAt(0).toUpperCase()}</span>
              </div>
              <h4 className="font-semibold text-gray-900">{selectedChatData.visitor}</h4>
              <p className="text-sm text-gray-600">{selectedChatData.visitor_country}</p>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">Device Info</h5>
                <p className="text-sm text-gray-600">{selectedChatData.visitor_device}</p>
                <p className="text-sm text-gray-600">{selectedChatData.visitor_browser}</p>
                <p className="text-sm text-gray-600">{selectedChatData.visitor_os}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">Visit Info</h5>
                <p className="text-sm text-gray-600">Total Visits: {selectedChatData.total_visit}</p>
                <p className="text-sm text-gray-600">Messages: {selectedChatData.total_message}</p>
                <p className="text-sm text-gray-600">Started: {formatTime(selectedChatData.created_at)}</p>
              </div>

              {singleChatData?.notes && singleChatData.notes.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                  {singleChatData.notes.map((note, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded border">
                      <h6 className="font-medium text-sm text-gray-800">{note.title}</h6>
                      <p className="text-xs text-gray-600">{note.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">User Details</h3>
            <p className="text-gray-600">Select a conversation to view user details</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Inbox Content Component
export const InboxContent = () => {
   // Only use hook for initial load (page 1)
   const [allChats, setAllChats] = useState<InboxChatItemType[]>([])
   const [currentPage, setCurrentPage] = useState(1)
   const [selectedChatData, setSelectedChatData] = useState<InboxChatItemType | null>(null)
   const [status, setStatus] = useState<'all' | 'unanswered' | 'answered' | 'closed' | 'read'>('all')
   const [loadingMore, setLoadingMore] = useState(false)
   const [hasMorePages, setHasMorePages] = useState(true)
   const perPage = 20
 
  const { data: inboxList, loading , refetch } = useGetInboxList(status, 1, perPage)
  const { data: singleChatData, loading: singleChatLoading } = useSingleChat(selectedChatData?.hash_slug)
  const { subscribeToInboxUpdates, unsubscribeFromInboxUpdates } = useSocketProvider()
 
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(true)
  const [mobileView, setMobileView] = useState<'chatList' | 'chatBox' | 'userDetails'>('chatList')
  

  console.log('InboxContent - selectedChatData:', selectedChatData)
  console.log('InboxContent - inboxList:', inboxList ? `${inboxList.chats?.data?.length || 0} chats` : 'loading...')
  console.log('InboxContent - allChats:', allChats.length, 'chats')
  /* 
    // Subscribe to WS events when a chat is selected
  useSocket("wss://staging.talkify.pro/ws/", selectedChatData ? [
    {
      channel: `chatting-event.${selectedChatData.hash_slug}`,
      handler: (data) => {
        if (data.message) {
          setSelectedChatData((prev) =>
            prev ? { ...prev, chat_details_count: prev.chat_details_count + 1 } : prev
          );
          // Append new message to your local chat state
          console.log("New chat message:", data.message);
        }
      },
    },
    {
      channel: `user-typing-event.${selectedChatData.hash_slug}`,
      handler: (data) => {
        console.log("User typing:", data);
      },
    },
  ] : []);
  */
  // Pagination state

  // Get token from Redux
  const token = useSelector((state: RootState) => state?.auth?.token)

 
  // Removed replyText state for better performance - now handled directly in ChatBox

  // Direct real-time message handler for local state
  const handleDirectChatMessage = useCallback((messageData: any) => {
    console.log("🎯 InboxContent: Inbox update received:", messageData);
    
    // Handle inbox updates - this could be new messages, status changes, etc.
    if (messageData.type === 'new_message' && messageData.chat) {
      const updatedChat = messageData.chat;
      const hashSlug = updatedChat.hash_slug;
      
      setAllChats(prevChats => {
        const chatIndex = prevChats.findIndex(chat => chat.hash_slug === hashSlug);
        
        if (chatIndex !== -1) {
          // Update existing chat
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            total_message: updatedChats[chatIndex].total_message + 1,
            updated_at: new Date().toISOString()
          };
          
          // Sort chats by updated_at (most recent first)
          updatedChats.sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          console.log("🎯 InboxContent: Updated existing chat:", hashSlug);
          return updatedChats;
        } else {
          // Add new chat to the beginning of the list
          const newChat = {
            ...updatedChat,
            updated_at: new Date().toISOString()
          };
          
          const updatedChats = [newChat, ...prevChats];
          console.log("🎯 InboxContent: Added new chat:", hashSlug);
          return updatedChats;
        }
      });
    }
  }, []);


  const handleMessageSelect = (message: InboxChatItemType) => {
    setSelectedMessage(message.id)
    setSelectedChatData(message)
    // On mobile, switch to chat view when a message is selected
    setMobileView('chatBox')
    // singleChat will be called automatically via useEffect in useSingleChat hook
  }

  const handleStatusChange = (newStatus: 'all' | 'unanswered' | 'answered' | 'closed' | 'read') => {
    setStatus(newStatus)
    // Clear selected message when status changes
    setSelectedMessage(null)
    setSelectedChatData(null)
    // Reset pagination when status changes
    setAllChats([])
    setCurrentPage(1)
    setHasMorePages(true)
  }

  const handleToggleUserDetails = () => {
    setShowUserDetails(!showUserDetails)
  }

  const handleStatusUpdate = (newStatus: number) => {
    if (selectedChatData) {
      // Update the selectedChatData status
      setSelectedChatData({
        ...selectedChatData,
        status: newStatus
      })
    }
  }

  // Initialize data when inboxList changes (only for first page)
  useEffect(() => {
    if (inboxList?.chats?.data && !loading && currentPage === 1) {
      setAllChats(inboxList.chats.data)
      setHasMorePages(!!inboxList.chats.next_page_url)
    }
  }, [inboxList, loading, currentPage])

  // Sync local allChats with real-time updates from useGetInboxList
  useEffect(() => {
    if (inboxList?.chats?.data && !loading) {
      console.log('🔄 InboxContent: Syncing real-time updates', {
        currentPage,
        hookDataLength: inboxList.chats.data.length,
        localDataLength: allChats.length
      })
      
      // Always update the first page data with real-time updates
      setAllChats(prevChats => {
        const firstPageData = inboxList.chats.data
        
        // If we're on page 1, replace all data
        if (currentPage === 1) {
          console.log('📝 InboxContent: Replacing all data with first page')
          return firstPageData
        }
        
        // If we have more pages loaded, merge first page data with existing data
        const existingData = prevChats.slice(perPage)
        console.log('📝 InboxContent: Merging first page with existing data')
        return [...firstPageData, ...existingData]
      })
    }
  }, [inboxList?.chats?.data, loading, currentPage, perPage, allChats.length])

  // Calculate if there are more pages based on total and current data
  useEffect(() => {
    if (inboxList?.chats) {
      const totalPages = Math.ceil(inboxList.chats.total / perPage)
      setHasMorePages(currentPage < totalPages)
    }
  }, [inboxList, currentPage, perPage])

  // Subscribe to inbox updates for real-time chat list updates
  useEffect(() => {
    if (token) {
      console.log("🎯 InboxContent: Subscribing to inbox updates");
      
      subscribeToInboxUpdates(handleDirectChatMessage);

      return () => {
        console.log("🎯 InboxContent: Unsubscribing from inbox updates");
        unsubscribeFromInboxUpdates();
      };
    }
  }, [token, subscribeToInboxUpdates, unsubscribeFromInboxUpdates, handleDirectChatMessage]);

  // Separate function to fetch next page without component reload
  const fetchNextPage = async (page: number) => {
    try {
      const response = await fetch(`${CHAT_INBOX_LIST_API}?status=${status}&page=${page}&per_page=${perPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json()
      if (json?.data?.chats?.data) {
        return json.data.chats.data
      }
      return []
    } catch (error) {
      console.error("Error fetching next page:", error)
      return []
    }
  }

  // Load more function
  const handleLoadMore = async () => {
    if (loadingMore || !hasMorePages) return

    setLoadingMore(true)
    const nextPage = currentPage + 1
    
    try {
      const newData = await fetchNextPage(nextPage)
      if (newData.length > 0) {
        setAllChats(prev => [...prev, ...newData])
        setCurrentPage(nextPage)
      }
    } catch (error) {
      console.error("Error loading more data:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ maxHeight: 'calc(100vh - 105px)' }}>
      {/* Responsive Header */}
      <div className="hidden md:flex  items-center justify-between p-3 sm:p-4 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-2 rounded-md ${status === 'unanswered' ? 'bg-red-100' :
            status === 'answered' ? 'bg-green-100' :
              status === 'closed' ? 'bg-gray-100' :
                status === 'read' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
            <CheckCircle className={`h-4 w-4 ${status === 'unanswered' ? 'text-red-600' :
              status === 'answered' ? 'text-green-600' :
                status === 'closed' ? 'text-gray-600' :
                  status === 'read' ? 'text-blue-600' : 'text-gray-600'
              }`} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 hidden sm:block">
              {status === 'all' ? 'All Messages' :
                status === 'unanswered' ? 'Unanswered Messages' :
                  status === 'answered' ? 'Answered Messages' :
                    status === 'closed' ? 'Closed Messages' : 'Read Messages'}
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              {status === 'all' ? 'All chat messages' :
                status === 'unanswered' ? 'Messages waiting for response' :
                  status === 'answered' ? 'Messages that have been responded to' :
                    status === 'closed' ? 'Messages that have been closed' : 'Messages that have been read'}
            </p>
          </div>
        </div>
        <div className={`hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border ${status === 'unanswered' ? 'bg-red-50 border-red-200' :
          status === 'answered' ? 'bg-green-50 border-green-200' :
            status === 'closed' ? 'bg-gray-50 border-gray-200' :
              status === 'read' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
          }`}>
          <span className={`text-xs sm:text-sm font-medium ${status === 'unanswered' ? 'text-red-700' :
            status === 'answered' ? 'text-green-700' :
              status === 'closed' ? 'text-gray-700' :
                status === 'read' ? 'text-blue-700' : 'text-gray-700'
            }`}>Total: {inboxList?.totalChats}</span>
        </div>
      </div>

      {/* Responsive Main Layout */}
      <div className="flex-1 bg-gray-50 min-h-0">
        {/* Desktop Layout */}
        <div className={`hidden lg:grid h-full ${showUserDetails ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          <ChatList
            inboxList={inboxList ? {
              chats: {
                current_page: inboxList.chats.current_page,
                data: allChats.length > 0 ? allChats : inboxList.chats.data,
                first_page_url: inboxList.chats.first_page_url,
                from: inboxList.chats.from,
                last_page: inboxList.chats.last_page,
                last_page_url: inboxList.chats.last_page_url,
                links: inboxList.chats.links,
                next_page_url: inboxList.chats.next_page_url,
                path: inboxList.chats.path,
                per_page: inboxList.chats.per_page,
                prev_page_url: inboxList.chats.prev_page_url,
                to: inboxList.chats.to,
                total: inboxList.chats.total
              },
              totalChats: allChats.length > 0 ? allChats.length : inboxList.totalChats
            } : undefined}
            loading={loading}
            selectedMessage={selectedMessage}
            onMessageSelect={handleMessageSelect}
            getFirstLetter={getFirstLetter}
            formatTime={formatTime}
            status={status}
            onStatusChange={handleStatusChange}
            onLoadMore={handleLoadMore}
            loadingMore={loadingMore}
            hasMorePages={hasMorePages}
          />

          <ChatBox
            selectedChatData={selectedChatData}
            singleChatData={singleChatData}
            refetch={refetch}
            singleChatLoading={singleChatLoading}
            onToggleUserDetails={handleToggleUserDetails}
            onStatusUpdate={handleStatusUpdate}
            setSelectedMessage={setSelectedMessage}
            setSelectedChatData={setSelectedChatData}
            setMobileView={setMobileView}
            setStatus={setStatus}
          />

          {showUserDetails && (
            <UserDetails
              selectedChatData={selectedChatData}
              singleChatData={singleChatData}
            />
          )}
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden h-full">
          {mobileView === 'chatList' && (
            <ChatList
              inboxList={inboxList ? {
                chats: {
                  current_page: inboxList.chats.current_page,
                  data: allChats.length > 0 ? allChats : inboxList.chats.data,
                  first_page_url: inboxList.chats.first_page_url,
                  from: inboxList.chats.from,
                  last_page: inboxList.chats.last_page,
                  last_page_url: inboxList.chats.last_page_url,
                  links: inboxList.chats.links,
                  next_page_url: inboxList.chats.next_page_url,
                  path: inboxList.chats.path,
                  per_page: inboxList.chats.per_page,
                  prev_page_url: inboxList.chats.prev_page_url,
                  to: inboxList.chats.to,
                  total: inboxList.chats.total
                },
                totalChats: allChats.length > 0 ? allChats.length : inboxList.totalChats
              } : undefined}
              loading={loading}
              selectedMessage={selectedMessage}
              onMessageSelect={handleMessageSelect}
              getFirstLetter={getFirstLetter}
              formatTime={formatTime}
              status={status}
              onStatusChange={handleStatusChange}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
              hasMorePages={hasMorePages}
            />
          )}

          {mobileView === 'chatBox' && (
            <ChatBox
              selectedChatData={selectedChatData}
              singleChatData={singleChatData}
              refetch={refetch}
              singleChatLoading={singleChatLoading}
              onToggleUserDetails={handleToggleUserDetails}
              onStatusUpdate={handleStatusUpdate}
              setSelectedMessage={setSelectedMessage}
              setSelectedChatData={setSelectedChatData}
              setMobileView={setMobileView}
              setStatus={setStatus}
            />
          )}

          {mobileView === 'userDetails' && (
            <div className="h-full relative">
              <UserDetails
                selectedChatData={selectedChatData}
                singleChatData={singleChatData}
              />
              {/* Mobile back button */}
              <button
                onClick={() => setMobileView('chatBox')}
                className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
