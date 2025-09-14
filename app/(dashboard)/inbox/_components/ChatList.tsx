import { InboxChatItemType, InboxListData } from "@/hooks/useGetInboxList";
import { ChevronDown, Filter, MessageCircle, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const ChatList = ({
    inboxList,
    loading,
    selectedMessage,
    onMessageSelect,
    getFirstLetter,
    formatTime,
    status,
    onStatusChange,
    onLoadMore,
    loadingMore,
    hasMorePages
  }: {
    inboxList: InboxListData | undefined;
    loading: boolean;
    selectedMessage: number | null;
    onMessageSelect: (message: InboxChatItemType) => void;
    getFirstLetter: (str: string) => string;
    formatTime: (str: string) => string;
    status: 'all' | 'unanswered' | 'answered' | 'closed' | 'read';
    onStatusChange: (status: 'all' | 'unanswered' | 'answered' | 'closed' | 'read') => void;
    onLoadMore?: () => void;
    loadingMore?: boolean;
    hasMorePages?: boolean;
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
  
      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen]);
  
    const MessageSkeleton = () => (
      <div className="flex flex-col gap-1 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-3 rounded-md bg-white border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  
  return (
    <div className="flex flex-col border-r border-gray-200 min-h-0 bg-white w-full">
  
        {/* Search and Filter */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex items-center p-2 sm:p-0">
  
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500
                     focus:outline-none border-none ring-0 bg-transparent"
              />
            </div>
  
            {/* Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2.5 hover:bg-gray-50 text-sm transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>
  
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg z-20 rounded-md">
                  <div className="flex flex-col py-1">
                    {(['all', 'unanswered', 'answered', 'closed', 'read'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onStatusChange(s);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors
                    ${status === s ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}{s === 'all' ? ' Chats' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
  
          </div>
        </div>
  
  
        {/* Chat Items */}
        {loading ? (
          <MessageSkeleton />
        ) : inboxList?.chats?.data && inboxList.chats.data.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
            {inboxList.chats.data.map((msg, index) => {
              const isSelected = selectedMessage === msg.id;
              const isUnanswered = msg.status === 0;
              const isAnswered = msg.status === 1;
              const isClosed = msg.status === 2;
              const isRead = msg.status === 3;
  
              // Status indicator with specific colors
              const getStatusIndicator = () => {
                if (isUnanswered) return { dot: 'bg-red-500', text: 'New' };
                if (isAnswered) return { dot: 'bg-green-500', text: 'Answered' };
                if (isClosed) return { dot: 'bg-gray-500', text: 'Closed' };
                if (isRead) return { dot: 'bg-blue-500', text: 'Read' };
                return { dot: 'bg-gray-500', text: 'Unknown' };
              };
  
              // Status badge configuration with specific colors
              const getStatusBadge = () => {
                if (isUnanswered) return {
                  text: 'Unanswered',
                  className: 'bg-red-100 text-red-700 border-red-500'
                };
                if (isAnswered) return {
                  text: 'Answered',
                  className: 'bg-green-100 text-green-700 border-green-500'
                };
                if (isClosed) return {
                  text: 'Closed',
                  className: 'bg-gray-100 text-gray-700 border-gray-500'
                };
                if (isRead) return {
                  text: 'Read',
                  className: 'bg-blue-100 text-blue-700 border-blue-500'
                };
                return {
                  text: 'Unknown',
                  className: 'bg-gray-100 text-gray-700 border-gray-500'
                };
              };
  
              // Glassmorphism background colors based on status
              const getGlassmorphismBg = () => {
                if (isUnanswered) return 'from-red-500/20 to-red-400/10';
                if (isAnswered) return 'from-green-500/20 to-green-400/10';
                if (isClosed) return 'from-gray-500/20 to-gray-400/10';
                if (isRead) return 'from-blue-500/20 to-blue-400/10';
                return 'from-gray-500/20 to-gray-400/10';
              };
  
              const statusIndicator = getStatusIndicator();
              const statusBadge = getStatusBadge();
              const glassmorphismBg = getGlassmorphismBg();
  
              return (
                <div
                  key={`${msg.id}-${msg.hash_slug}-${index}`}
                  onClick={() => onMessageSelect(msg)}
                  className={`group relative shadow-sm p-3 rounded-md transition-all duration-150 cursor-pointer border border-transparent
                    ${isSelected
                      ? 'bg-indigo-100  border-indigo-300'
                      : isUnanswered
                        ? 'bg-red-50 border-red-100 hover:border-red-200 hover:bg-red-50/50'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                    {statusBadge.text}
                  </div>
  
                  <div className="flex items-center gap-3 pr-20">
                    {/* Glassmorphism Avatar */}
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full backdrop-blur-sm bg-white/20 border border-white/30 shadow-lg flex items-center justify-center font-medium text-sm text-gray-700 relative overflow-hidden">
                        {/* Glassmorphism background effect with status-based colors */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${glassmorphismBg} rounded-full`}></div>
                        <span className="relative z-10">{getFirstLetter(msg.visitor)}</span>
                      </div>
  
                      {/* Minimal status dot */}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusIndicator.dot} border-2 border-white rounded-full shadow-sm`}></div>
                    </div>
  
                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-sm font-medium text-gray-900">
                        {msg.visitor}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{msg.visitor_country} • {msg.visitor_device} • {msg.visitor_browser}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Load More Button */}
            {onLoadMore && hasMorePages && (
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  {loadingMore ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
            
            {/* End of list indicator */}
            {onLoadMore && !hasMorePages && inboxList?.chats?.data && inboxList.chats.data.length > 0 && (
              <div className="p-3 border-t border-gray-100">
                <div className="text-center text-gray-400 text-sm">
                  {`You've reached the end of the list`}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No chats found</h3>
              <p className="text-xs text-gray-500">
                {status === 'all' ? 'No chats available' :
                  status === 'unanswered' ? 'No unanswered chats' :
                    status === 'answered' ? 'No answered chats' : 'No closed chats'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  