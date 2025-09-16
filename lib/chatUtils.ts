
// Utility functions for chat components

import { DELETE_CHAT_INBOX_LIST_API, END_CHAT_API, JOIN_CHAT_API } from "@/api/api";
import { InboxChatItemType } from "@/hooks/useGetInboxList";
import { toast } from 'react-hot-toast';

/**
 * Generate a random color for avatar based on string input
 * @param str - String to generate color from
 * @returns Tailwind CSS color class
 */
export const getRandomColor = (str: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
  ];
  const index = str.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Get the first letter of a string in uppercase
 * @param visitor - String to get first letter from
 * @returns First letter in uppercase
 */
export const getFirstLetter = (visitor: string): string => {
  return visitor.charAt(0).toUpperCase();
};

/**
 * Format a date string to relative time or actual date
 * @param dateString - ISO date string
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  // Handle invalid or empty date strings
  if (!dateString || dateString === 'Invalid Date' || dateString === '') {
    return 'Just now';
  }
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Just now';
  }
  
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  // For dates older than 1 day, show actual date and time
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleDateString('en-US', options);
};


export const scrollToBottom = (messagesEndRef: React.RefObject<HTMLDivElement>, smooth = false) => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }
};



// delete 

export const handleEndChat = async (selectedChatData: InboxChatItemType, token: string, onStatusUpdate: (newStatus: number) => void) => {
  if (!selectedChatData) {
    return;
  }

  try {
    const response = await fetch(`${END_CHAT_API}${selectedChatData.hash_slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.ok) {
      // Update status to 2 (closed) when ending chat
      onStatusUpdate?.(2);
    } else {
      console.error('Failed to end chat');
    }
  } catch (error) {
    console.error('Error ending chat:', error);
  }
};


// Joining Chat
export const handleJoinChat = async (selectedChatData: InboxChatItemType, token: string, onStatusUpdate: (newStatus: number) => void, setIsJoining: (isJoining: boolean) => void) => {
  if (!selectedChatData) {
    return;
  }

  setIsJoining(true);
  
  try {
    const response = await fetch(`${JOIN_CHAT_API}${selectedChatData.hash_slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.ok) {
      // Update status to 1 (joined/answered) after successful join
      onStatusUpdate?.(1);
    } else {
      console.error('Failed to join chat');
    }
  } catch (error) {
    console.error('Error joining chat:', error);
  } finally {
    setIsJoining(false);
  }
};



// Deleting Chat 
export const handleDeleteChat = async (selectedChatData: InboxChatItemType, token: string, onStatusUpdate: (newStatus: number) => void, setSelectedMessage: (message: number | null) => void, setSelectedChatData: (chat: InboxChatItemType | null) => void, setReplyText: (text: string) => void, setMobileView: (view: 'chatList' | 'chatBox' | 'userDetails') => void, refetch: () => void) => {
  if (!selectedChatData) {
    return;
  }

  try {
    const response = await fetch(`${DELETE_CHAT_INBOX_LIST_API}${selectedChatData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.ok) {
      toast.success('Chat deleted successfully');
      // Clear selected chat data and trigger refetch by updating status
      setSelectedMessage(null);
      setSelectedChatData(null);
      setReplyText('');
      refetch()
      setMobileView('chatList');
      // Trigger refetch by updating status (this will cause useGetInboxList to refetch)
      onStatusUpdate(0); 
    } else {
      console.error('Failed to delete chat');
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};
