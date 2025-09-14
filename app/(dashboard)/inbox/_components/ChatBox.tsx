/* eslint-disable @typescript-eslint/no-explicit-any */
import { InboxChatItemType } from "@/hooks/useGetInboxList";
import { ChatDetail, SingleChatData } from "@/hooks/useSingleChat";
import { formatTime } from "@/lib/chatUtils";
import { SEND_TEXT_API, JOIN_CHAT_API, END_CHAT_API, DELETE_CHAT_INBOX_LIST_API } from "@/api/api";
import EmojiPicker from "emoji-picker-react";
import { MessageCircle, Paperclip, Send, Smile, ChevronRight, X, File, Image as ImageIcon, FileText, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks/useSocket";




const AttachmentSection = ({
  attachedFiles,
  onFileSelect,
  onRemoveFile,
  onClose
}: {
  attachedFiles: File[];
  onFileSelect: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClose: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect([...attachedFiles, ...files]);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="absolute bottom-full w-full left-1 sm:left-4 mb-2 z-50 attachment-section">
      {/* Mobile: Full width with margins */}
      <div className="block sm:hidden">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 mx-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Attach Files</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
          />

          {/* Add file button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 mb-3"
          >
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm font-medium">Click to add files</span>
            </div>
          </button>

          {/* File list */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Fixed width */}
      <div className="hidden sm:block">
        <div className="bg-white relative rounded-2xl shadow-2xl p-6 w-fit">
          <button
            onClick={onClose}
            className="absolute -top-7 -right-6 z-20 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Attach Files</h3>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
            />

            {/* Add file button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Paperclip className="w-5 h-5" />
                <span className="text-sm font-medium">Click to add files</span>
              </div>
            </button>

            {/* File list */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto w-80">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmojiSection = ({ onEmojiClick, onClose }: { onEmojiClick: (emoji: string) => void; onClose: () => void }) => {
  return (
    <div className="absolute bottom-full w-full  left-1 sm:left-4 mb-2 z-50 emoji-section">
      {/* Mobile: Full width with margins */}
      <div className="block sm:hidden">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 mx-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Choose an emoji</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto">
            <EmojiPicker
              onEmojiClick={(emojiData: any) => {
                onEmojiClick(emojiData.emoji);
              }}
              width={320}
              height={250}
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: true
              }}
              theme={'light' as any}
            />
          </div>
        </div>
      </div>

      {/* Desktop: Fixed width */}
      <div className="hidden sm:block">
        <div className="bg-white relative rounded-2xl shadow-2xl  p-6 w-fit">
          {/* <div className="flex items-center justify-between mb-4">
             
            </div> */}
          <div className=" relative">
            <button
              onClick={onClose}
              className="absolute -top-7 -right-6  z-20 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <EmojiPicker
              onEmojiClick={(emojiData: any) => {
                onEmojiClick(emojiData.emoji);
              }}
              width={400}
              height={350}
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: true
              }}
              theme={'light' as any}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
/* 

epr_q53mwh epr_vl50xg epr_-3yva2a epr_c90x4z epr_-sisw4f epr_mw4zr1 epr_-kg0voo epr_iogimd epr_wtwvf4 epr_-lzq3oa
*/





// Chat Box Component
export const ChatBox = ({
  selectedChatData,
  singleChatData,
  singleChatLoading,
  onToggleUserDetails,
  refetch,
  onStatusUpdate,
  // Chat list management props
  setSelectedMessage,
  setSelectedChatData,
  setMobileView,
  setStatus
}: {
  selectedChatData: InboxChatItemType | null;
  singleChatData: SingleChatData | undefined;
  singleChatLoading: boolean;
  refetch: () => void;
  onToggleUserDetails?: () => void;
  onStatusUpdate?: (newStatus: number) => void;
  // Chat list management props
  setSelectedMessage: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedChatData: React.Dispatch<React.SetStateAction<InboxChatItemType | null>>;
  setMobileView: React.Dispatch<React.SetStateAction<'chatList' | 'chatBox' | 'userDetails'>>;
  setStatus: React.Dispatch<React.SetStateAction<'all' | 'unanswered' | 'answered' | 'closed' | 'read'>>;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = useSelector((state: RootState) => state?.auth?.token);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiSection, setShowEmojiSection] = useState(false);
  const [showAttachmentSection, setShowAttachmentSection] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [localMessages, setLocalMessages] = useState<ChatDetail[]>([]);
  const [hasText, setHasText] = useState(false); // Track if textarea has content
  const { sendWSMessage, switchToChat } = useSocket();

  // Memoize the combined message list to prevent unnecessary re-renders
  const allMessages = useMemo(() => {
    if (!singleChatData?.chat?.chat_details) return localMessages;
    return [...singleChatData.chat.chat_details, ...localMessages];
  }, [singleChatData?.chat?.chat_details, localMessages]);

  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    }
  }, []);

  // Debounced scroll function to prevent rapid scroll calls
  const debouncedScrollToBottom = useCallback(() => {
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-resize function and text tracking
  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      
      // Update hasText state for send button reactivity
      const hasContent = textareaRef.current.value.trim().length > 0;
      setHasText(hasContent);
    }
  };

  // Initialize hasText state when component mounts or textarea changes
  useEffect(() => {
    if (textareaRef.current) {
      const hasContent = textareaRef.current.value.trim().length > 0;
      setHasText(hasContent);
    }
  }, []);

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    // Insert emoji directly into textarea without state update
    if (textareaRef.current) {
      const currentValue = textareaRef.current.value;
      const cursorPosition = textareaRef.current.selectionStart;
      const newValue = currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
      textareaRef.current.value = newValue;
      
      // Set cursor position after emoji
      const newCursorPosition = cursorPosition + emoji.length;
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      
      // Auto-resize textarea and update hasText state
      autoResizeTextarea();
      
      // Focus back to textarea after emoji selection
      textareaRef.current.focus();
    }
  };

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteChat = useCallback(async () => {
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
        // Clear textarea if it exists
        if (textareaRef.current) {
          textareaRef.current.value = '';
        }
        setHasText(false);
        refetch()
        setMobileView('chatList');
        // Trigger refetch by updating status (this will cause useGetInboxList to refetch)
        setStatus(prevStatus => prevStatus);
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }, [selectedChatData, refetch, token, setSelectedMessage, setSelectedChatData, setMobileView, setStatus]);

  const handleJoinChat = async () => {
    if (!selectedChatData || isJoining) {
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

  const handleEndChat = async () => {
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

  const handleSendMessage = async () => {
    if (!textareaRef.current || !selectedChatData || isSending) {
      return;
    }

    const messageText = textareaRef.current.value.trim();
    if (!messageText) {
      return;
    }

    setIsSending(true);

    // Create local message immediately for real-time display
    const tempMessage: ChatDetail = {
      id: Date.now(), // Temporary ID
      property_id: selectedChatData.property_id,
      chat_id: selectedChatData.id,
      name: null,
      contact: null,
      message: messageText,
      link: null,
      file: null,
      status: 1,
      type: 'admin', // Mark as admin message
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      file_count: 0,
      file_list: []
    };

    // Add to local messages immediately
    setLocalMessages(prev => [...prev, tempMessage]);

    // Clear the input immediately
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
    setHasText(false); // Reset hasText state

    // Scroll to bottom immediately
    setTimeout(() => scrollToBottom(true), 100);

    try {
      const response = await fetch(SEND_TEXT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hash_slug: selectedChatData.hash_slug,
          message: messageText,
        }),
      });

      if (response.ok) {
        // toast.success('Message sent successfully');
        // Remove temp message immediately - server will broadcast the real message
        setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        
        // Don't send via WebSocket - server will broadcast automatically
        // This prevents duplicate messages from appearing

        // Notify global channels about new message for inbox updates
        sendWSMessage('new-message-global', {
          chat_hash_slug: selectedChatData.hash_slug,
          message: messageText,
          sender_type: 'admin',
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('Failed to send message');
        toast.error('Failed to send message');
        setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
      // Remove the temp message if sending failed
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  // Clear local messages when chat data is refetched (but avoid clearing on every render)
  useEffect(() => {
    if (singleChatData?.chat.chat_details) {
      // Only clear local messages if we're switching to a different chat
      // This prevents clearing messages unnecessarily on refetches
      setLocalMessages(prev => {
        // Keep local messages that haven't been confirmed by server yet
        return prev.filter(localMsg => {
          // If server data doesn't contain this local message, keep it
          return !singleChatData.chat.chat_details.some(serverMsg => 
            serverMsg.id === localMsg.id || 
            (serverMsg.message === localMsg.message && serverMsg.created_at === localMsg.created_at)
          );
        });
      });
    }
  }, [singleChatData?.chat?.id, singleChatData?.chat?.chat_details]); // Trigger when chat ID or data changes


  // Only scroll smoothly when new chat is selected, not when data refetches
  useEffect(() => {
    if (selectedChatData) {
      scrollToBottom(false); // Instant scroll for new chat selection
      // Clear attachments when switching to a different chat
      setAttachedFiles([]);
      // Close attachment section if open
      setShowAttachmentSection(false);
      // Reset textarea content and hasText state
      if (textareaRef.current) {
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
      }
      setHasText(false);
      
      // Switch WebSocket to new chat channels
      switchToChat(selectedChatData.hash_slug);
    }
  }, [selectedChatData, switchToChat]);

  // Keep scroll at bottom when new messages arrive (but not on every data update)
  useEffect(() => {
    if (allMessages.length > 0) {
      // Only scroll if we have messages and this is a new message addition
      const cleanup = debouncedScrollToBottom();
      return cleanup;
    }
  }, [allMessages.length, debouncedScrollToBottom]); // Only trigger when message count changes

  // Close emoji and attachment sections when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (showEmojiSection) {
        if (!target.closest('.emoji-section') && !target.closest('button[onclick*="setShowEmojiSection"]')) {
          setShowEmojiSection(false);
        }
      }

      if (showAttachmentSection) {
        if (!target.closest('.attachment-section') && !target.closest('button[onclick*="setShowAttachmentSection"]')) {
          setShowAttachmentSection(false);
        }
      }
    };

    if (showEmojiSection || showAttachmentSection) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiSection, showAttachmentSection]);



  return (
    <div className="lg:col-span-3 bg-white relative flex flex-col min-h-0 w-full h-full">
      {selectedChatData ? (
        <>
          {/* Modern Conversation Header */}
          <div className="px-1 sm:px-6 py-4 border sm:py-5 border-b border-gray-100 bg-white flex-shrink-0">
            {/* Mobile Layout */}
            <div className="lg:hidden flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={() => setMobileView('chatList')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="relative">
                  <div className="w-8 m:w-10 h-8 m:h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-sm flex items-center justify-center text-sm font-semibold text-slate-700">
                    {selectedChatData.visitor.charAt(0).toUpperCase()}
                  </div>
                  {/* Modern status indicator */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${selectedChatData.status === 0 ? 'bg-red-500' :
                    selectedChatData.status === 1 ? 'bg-emerald-500' :
                      selectedChatData.status === 2 ? 'bg-gray-500' :
                        selectedChatData.status === 3 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900">{selectedChatData.visitor}</h3>
                  <p className="text-xs text-gray-500">{selectedChatData.visitor_country}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Join Chat Button for Mobile */}
                {selectedChatData.status === 0 || selectedChatData.status === 3 ? (
                  <button
                    onClick={handleJoinChat}
                    disabled={isJoining}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${isJoining
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {isJoining ? (
                      <div className="flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        Joining...
                      </div>
                    ) : (
                      'Join'
                    )}
                  </button>
                ) : selectedChatData.status === 1 ? (
                  <button
                    onClick={handleEndChat}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                  >
                    End Chat
                  </button>
                ) : null}

                {/* Details Button for Mobile */}
                <button
                  onClick={() => setMobileView('userDetails')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  title="User Details"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-sm flex items-center justify-center text-base font-semibold text-slate-700">
                    {selectedChatData.visitor.charAt(0).toUpperCase()}
                  </div>
                  {/* Modern status indicator */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${selectedChatData.status === 0 ? 'bg-red-500' :
                    selectedChatData.status === 1 ? 'bg-emerald-500' :
                      selectedChatData.status === 2 ? 'bg-gray-500' :
                        selectedChatData.status === 3 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedChatData.visitor}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {selectedChatData.visitor_country}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Conditional Button based on Status */}
                {selectedChatData.status === 0 || selectedChatData.status === 3 ? (
                  // Status 0 or 3: Show Join Chat Button
                  <button
                    onClick={handleJoinChat}
                    disabled={isJoining}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isJoining
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                  >
                    {isJoining ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Joining...
                      </div>
                    ) : (
                      'Join'
                    )}
                  </button>
                ) : selectedChatData.status === 1 ? (
                  // Status 1: Show End Chat Button
                  <button
                    onClick={handleEndChat}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 hover:shadow-md transition-all duration-200"
                  >
                    End Chat
                  </button>
                ) : selectedChatData.status === 2 ? (
                  // Status 2: Show no button (empty div for spacing)
                  <div></div>
                ) : null}

                {/* Collapse Details Button */}
                <button
                  onClick={onToggleUserDetails}
                  className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm"
                  title="Toggle User Details"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Delete Chat Button */}
                <button
                  onClick={handleDeleteChat}
                  className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
                  title="Delete Chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Modern Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {singleChatLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600"></div>
                  <span className="text-sm font-medium">Loading conversation...</span>
                </div>
              </div>
            ) : singleChatData ? (
              <div className="space-y-4 px-4 sm:px-6 py-4 sm:py-6">
                {allMessages.map((message: ChatDetail, index: number) => {
                  // Modern system info messages
                  if (message.type === 'info') {
                    return (
                      <div key={`${message.id}-${index}-${message.type}`} className="flex justify-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2 text-sm text-blue-700 max-w-md text-center shadow-sm">
                          <span className="font-medium">{message.message}</span>
                        </div>
                      </div>
                    );
                  }

                  const isUser = message.type === 'user';
                  const isAdmin = message.type === 'admin';

                  return (
                    <div key={`${message.id}-${index}-${message.type}-${message.created_at}`} className={`flex ${isUser || isAdmin ? 'justify-end' : 'justify-start'} group`}>
                      <div className={`flex items-end gap-3 max-w-2xl ${isUser || isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Modern Message Bubble */}
                        <div className={`relative ${isUser || isAdmin ? 'ml-3' : 'mr-3'}`}>
                          <div className={`rounded-2xl px-4 py-2 shadow-sm transition-all duration-200 group-hover:shadow-md ${isUser || isAdmin
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                            }`}>
                            <div className="flex items-center gap-2">
                              <p className=" leading-relaxed font-medium">{message.message}</p>
                              {isAdmin && localMessages.some(localMsg => localMsg.id === message.id) && (
                                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                              )}
                            </div>
                          </div>

                          {/* Modern Timestamp */}
                          <div className={`mt-2 text-xs font-medium ${isUser || isAdmin ? 'text-right text-blue-600' : 'text-left text-gray-500'
                            }`}>
                            {formatTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Closed Conversation Message */}
                {selectedChatData.status === 2 && (
                  <div className="flex justify-center mt-6">
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-sm text-red-700 max-w-md text-center shadow-sm">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-semibold">Conversation Closed</span>
                      </div>
                      <p className="text-red-600">This conversation has been closed and is no longer active.</p>
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-sm">
                    <MessageCircle className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>

          {/* Modern Reply Input */}
          {selectedChatData && selectedChatData.status !== 0 && selectedChatData.status !== 2 && (
            <div className="flex items-center p-3 sm:p-4 flex-shrink-0 bg-white border-t border-gray-200 shadow-md relative">
              {/* Attachment & Emoji Buttons */}
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowAttachmentSection(!showAttachmentSection)}
                    className={`p-2.5 sm:p-3 transition-all duration-200 rounded-full shadow-sm ${showAttachmentSection
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* File count badge */}
                  {attachedFiles.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                      {attachedFiles.length > 99 ? '99+' : attachedFiles.length}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowEmojiSection(!showEmojiSection)}
                  className={`p-2.5 sm:p-3 transition-all duration-200 rounded-full shadow-sm ${showEmojiSection
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Beautiful Emoji Section */}
              {showEmojiSection && (
                <EmojiSection
                  onEmojiClick={handleEmojiClick}
                  onClose={() => setShowEmojiSection(false)}
                />
              )}

              {/* File Attachment Section */}
              {showAttachmentSection && (
                <AttachmentSection
                  attachedFiles={attachedFiles}
                  onFileSelect={handleFileSelect}
                  onRemoveFile={handleRemoveFile}
                  onClose={() => setShowAttachmentSection(false)}
                />
              )}

              {/* Textarea */}
              <div className="flex-1  items-center justify-center h-full relative ml-3">
                <textarea
                  ref={textareaRef}
                  placeholder="Type a message..."
                  onInput={autoResizeTextarea}
                  onKeyDown={handleKeyDown}
                  className="w-full px-5 pr-10 mt-2 py-3 sm:py-5  text-lg bg-gray-100 rounded-2xl resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 shadow-inner"
                  rows={1}
                  style={{ minHeight: '60px', maxHeight: '180px' }}
                />

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  className={`absolute right-4 bottom-4 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-200 transform ${hasText && !isSending
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-110'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  disabled={!hasText || isSending}
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-sm">
              <MessageCircle className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Chat</h3>
            <p className="text-gray-600 font-medium">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};