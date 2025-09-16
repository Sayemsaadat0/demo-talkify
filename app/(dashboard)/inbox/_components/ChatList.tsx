'use client';
import { useEffect, useState } from 'react';
import { InboxChatItemType, InboxPagination } from '../_types/inbox.types';
import { getInboxList } from '../_hooks/inbox.hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FilterIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onSelect: (chat: InboxChatItemType) => void; // pass whole chat data
  selectedChat: InboxChatItemType | null;
  onFilterChange?: () => void; // callback to clear selected chat when filter changes
}

type FilterStatus = 'all' | 'unanswered' | 'answered' | 'closed' | 'read';

export const ChatList: React.FC<Props> = ({ onSelect, selectedChat, onFilterChange }) => {
  const [inbox, setInbox] = useState<InboxChatItemType[]>([]);
  const [pagination, setPagination] = useState<InboxPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const token = useSelector((state: RootState) => state.auth.token);


  const fetchInbox = async (page = 1, append = false, status?: string) => {
    if (!token) return;
    try {
      setLoading(true);
      console.log('Fetching inbox with status:', status, 'page:', page);
      const data = await getInboxList(page, token, status); // pass page and status to API
      if (data?.data?.chats) {
        const newChats = data.data.chats.data;
        setPagination(data.data.chats);
        setInbox((prev) => (append ? [...prev, ...newChats] : newChats));
        console.log('Fetched chats:', newChats.length, 'with status filter:', status || 'all');
      }
    } catch (err) {
      console.error('Failed to fetch inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  // Map filter keys to status strings for API
  const getStatusFromFilter = (filter: FilterStatus): string | undefined => {
    switch (filter) {
      case 'unanswered':
        return 'unanswered';
      case 'answered':
        return 'answered';
      case 'closed':
        return 'closed';
      case 'read':
        return 'read';
      case 'all':
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const statusParam = getStatusFromFilter(activeFilter);
    fetchInbox(1, false, statusParam); // first page with filter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeFilter]);

  const handleFilterChange = (filter: FilterStatus) => {
    console.log('Filter changed to:', filter);
    setActiveFilter(filter);
    // Clear selected chat when filter changes
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const getStatusConfig = (status: number) => {
    switch (status) {
      case 0: // Unanswered
        return {
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-200 text-red-800',
          label: 'Unanswered'
        };
      case 1: // Answered
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          badgeColor: 'bg-green-100 text-green-800',
          label: 'Answered'
        };
      case 2: // Closed
        return {
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800',
          label: 'Closed'
        };
      case 3: // Read
        return {
          bgColor: 'bg-blue-50/0',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          badgeColor: 'bg-blue-100 text-blue-800',
          label: 'Read'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800',
          label: 'Unknown'
        };
    }
  };

  const filterOptions = [
    { key: 'all', label: 'All Conversations', count: inbox.length },
    { key: 'unanswered', label: 'Unanswered', count: inbox.filter(chat => chat.status === 0).length },
    { key: 'answered', label: 'Answered', count: inbox.filter(chat => chat.status === 1).length },
    { key: 'closed', label: 'Closed', count: inbox.filter(chat => chat.status === 2).length },
    { key: 'read', label: 'Read', count: inbox.filter(chat => chat.status === 3).length }
  ];


  return (
    <div className="w-80 h-full bg-white  border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white ">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <p className="text-blue-100 text-sm">{inbox.length} conversations</p>
      </div>

      <div className='flex py-3 px-2 items-center gap-1 border '>
        {/* Search Bar */}
        <div className="  flex-1 b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg  focus:ring-0  outline-none transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='border p-2.5 text-gray-500 rounded-lg'>
                <FilterIcon size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuLabel className='absolute'></DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => handleFilterChange(option.key as FilterStatus)}
                  className={`flex items-center justify-between cursor-pointer ${
                    activeFilter === option.key 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {activeFilter === option.key && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <span>{option.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {inbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          inbox.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={`
                  p-4 border-b cursor-pointer transition-all duration-300 relative
                  ${selectedChat?.id === item.id 
                    ? 'bg-gray-200 border-l-4 border-l-blue-500 shadow-md te transform ' 
                    : statusConfig.bgColor
                  }
                  ${statusConfig.borderColor}
                  group
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {/* Selection indicator */}
                      {selectedChat?.id === item.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                      <h3 className={`text-sm font-medium truncate ${
                        selectedChat?.id === item.id ? 'text-blue-900' : statusConfig.textColor
                      }`}>
                        {item.name || item.visitor}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.badgeColor}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {item.visitor_country} • {item.visitor_device}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {item.total_message} messages
                      </span>
                      <span className="flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {item.total_visit} visits
                      </span>
                    </div>
                  </div>
                  <div className="ml-2 text-right">
                    {selectedChat?.id === item.id && (
                      <div className="mb-1">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Active
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More Button */}
      {pagination?.next_page_url && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => fetchInbox(pagination.current_page + 1, true, getStatusFromFilter(activeFilter))}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
