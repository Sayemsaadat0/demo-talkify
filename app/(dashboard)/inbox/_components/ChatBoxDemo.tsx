/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useRef } from 'react';
import { ChatDetailsType } from '../_types/inbox.types';
import { useSocket } from '@/contexts/SocketProvider';
import { getMessages, joinChat, sendMessage } from '../_hooks/inbox.hooks';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Paperclip, Smile, X, File, FileText, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { InboxChatItemType } from '@/hooks/useGetInboxList';

interface Props {
  hash_slug: string;
  chatStatus: number;
  chatData: InboxChatItemType;
}

export const ChatBoxDemo: React.FC<Props> = ({ hash_slug, chatStatus, chatData }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [messages, setMessages] = useState<ChatDetailsType[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(chatStatus);
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  // const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showFilePanel, setShowFilePanel] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { subscribe, unsubscribe, unsubscribeAll, connected, eventData } = useSocket();

  // Replace with actual logged-in user id

  const messageChannel = `chatting-event.${hash_slug}`;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      
      if (behavior === 'smooth') {
        container.scrollTo({
          top: maxScroll,
          behavior: 'smooth'
        });
      } else {
        container.scrollTop = maxScroll;
      }
      setIsAtBottom(true);
    }
  };

  // const scrollToBottomInstant = () => {
  //   if (messagesContainerRef.current) {
  //     const container = messagesContainerRef.current;
  //     const scrollHeight = container.scrollHeight;
  //     const clientHeight = container.clientHeight;
  //     container.scrollTop = scrollHeight - clientHeight;
  //     setIsAtBottom(true);
  //   }
  // };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px threshold
      setIsAtBottom(isNearBottom);
    }
  };

  // Always scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      // Use multiple methods to ensure scroll happens
      const scrollToBottomNow = () => {
        const container = messagesContainerRef.current;
        if (container) {
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;
          container.scrollTop = scrollHeight - clientHeight;
          setIsAtBottom(true);
        }
      };

      // Try multiple times to ensure scroll happens
      setTimeout(scrollToBottomNow, 0);
      setTimeout(scrollToBottomNow, 10);
      setTimeout(scrollToBottomNow, 50);
      requestAnimationFrame(scrollToBottomNow);
    }
  }, [messages]);

  // Scroll to bottom when chat changes (new conversation)
  useEffect(() => {
    const forceScrollToBottom = () => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        container.scrollTop = scrollHeight - clientHeight;
        setIsAtBottom(true);
      }
    };
    
    setTimeout(forceScrollToBottom, 100);
    setTimeout(forceScrollToBottom, 200);
  }, [hash_slug]);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // typing event listener
  useEffect(() => {
    if (!eventData) return;
    // console.log(eventData);
    if (eventData.channel?.startsWith('user-typing-event.')) {
      if (eventData.status === 'typing') {
        setIsTyping(true);
      } else if (eventData.status === 'stopped') {
        setIsTyping(false);
      }
    }
  }, [eventData]);

  // Load initial messages
  useEffect(() => {
    const initChat = async () => {
      if (!token) return;

      const res = await getMessages(hash_slug, token);
      if (res?.data?.chat?.chat_details) {
        setMessages(res.data.chat.chat_details);
        // Force scroll to bottom after loading messages
        const forceScrollToBottom = () => {
          if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            container.scrollTop = scrollHeight - clientHeight;
            setIsAtBottom(true);
          }
        };
        
        setTimeout(forceScrollToBottom, 100);
        setTimeout(forceScrollToBottom, 200);
        setTimeout(forceScrollToBottom, 300);
        requestAnimationFrame(forceScrollToBottom);
      }
    };
    initChat();
  }, [hash_slug, token]);

  // subscribe chat
  useEffect(() => {
    if (status !== 1 || !connected) return;

    const handleChatMessage = (data: any) => {
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        if (data.message.type === 'end') {
          setStatus(2);
          unsubscribeAll();
        }
      }
    };

    subscribe(messageChannel, handleChatMessage);
    return () => {
      unsubscribe(messageChannel);
    };
  }, [hash_slug, status, connected, messageChannel, subscribe, unsubscribe, unsubscribeAll]);

  const handleSend = async () => {
    if (!input || !token) return;
    await sendMessage(hash_slug, input, token);
    setInput('');
  };

  const handleJoin = async () => {
    if (!input || !token) return;
    const res = await joinChat(hash_slug, token);
    if (res?.status) setStatus(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // Auto-resize textarea
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 72);
    textarea.style.height = newHeight + 'px';
  };

  // Media component functions
  const handleEmojiClick = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleEmojiPanel = () => {
    setShowEmojiPanel(!showEmojiPanel);
    setShowFilePanel(false);
  };

  const toggleFilePanel = () => {
    setShowFilePanel(!showFilePanel);
    setShowEmojiPanel(false);
  };

  // Combined Media Component
  const MediaComponent = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileSelect([...attachedFiles, ...files]);
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
      <>
        {/* Media Icons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFilePanel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={toggleEmojiPanel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* File Panel */}
        {showFilePanel && (
          <div className="absolute bottom-full left-0 mb-2 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Attach Files</h3>
                <button
                  onClick={() => setShowFilePanel(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 mb-3"
              >
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm font-medium">Click to add files</span>
                </div>
              </button>

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
                        onClick={() => handleRemoveFile(index)}
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
        )}

        {/* Emoji Panel */}
        {showEmojiPanel && (
          <div className="absolute bottom-full left-0 mb-2 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Choose an emoji</h3>
                <button
                  onClick={() => setShowEmojiPanel(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <EmojiPicker
                onEmojiClick={(emojiData: any) => {
                  handleEmojiClick(emojiData.emoji);
                }}
                width={320}
                height={300}
                searchDisabled={false}
                skinTonesDisabled={false}
                previewConfig={{
                  showPreview: true
                }}
                theme={'light' as any}
              />
            </div>
          </div>
        )}
      </>
    );
  };



  // console.log(chatData)

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {chatData?.visitor || 'V'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {chatData?.visitor || 'Visitor'}
            </h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">
                {status === 1 ? 'Active now' : 'Not joined'}
              </p>
              {/* {chatData?.country && (
                <>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-500">
                    {chatData.visitor.country}
                  </p>
                </>
              )} */}
            </div>
          </div>
          {(status === 0) && (
            <button
              onClick={handleJoin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Join Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((msg, index) => {
          const isOutgoing = msg.type !== 'visitor'; // visitor = left, else right

          return (
            <div
              key={index}
              className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 ${isOutgoing ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!isOutgoing && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">{msg.name?.[0] || 'V'}</span>
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isOutgoing
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                >
                  {!isOutgoing && (
                    <div className="text-xs font-medium text-gray-600 mb-1">{msg.name}</div>
                  )}
                  <div className="text-sm">{msg.message}sdss</div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">V</span>
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Bottom Button */}
        {!isAtBottom && (
          <div className="absolute bottom-20 right-6 z-10">
            <button
              onClick={() => scrollToBottom('smooth')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              title="Scroll to bottom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Input - Only show when status is 1 */}
      {status === 1 && (
        <div className="bg-white border-t border-gray-200 p-4 md:p-6 relative">
          <div className="flex items-center space-x-3">
            {/* Textarea + Media */}
            <div className="flex-1 relative">
              {/* Media / attachment button */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                <MediaComponent />
              </div>

              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full pl-24 pr-16 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden text-gray-700 placeholder-gray-400 transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '100px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full shadow-md transition-colors duration-200"
            >
              <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
