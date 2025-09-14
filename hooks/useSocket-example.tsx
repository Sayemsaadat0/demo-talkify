// Example usage of the updated useSocket hook

import { useSocket } from './useSocket';

export const SocketExample = () => {
  // Connect without requiring hash_slug
  const { 
    sendWSMessage, 
    getConnectionStatus, 
    switchToChat, 
    subscribeToChannel, 
    unsubscribeFromChannel,
    isConnected 
  } = useSocket();

  const handleChatSelection = (hashSlug: string) => {
    // Switch to specific chat channels
    switchToChat(hashSlug);
  };

  const handleCustomSubscription = () => {
    // Subscribe to any custom channel
    subscribeToChannel('custom-channel', (data) => {
      console.log('Custom message received:', data);
    });
  };

  const handleSendMessage = (hashSlug: string, message: string) => {
    // Send message to specific chat
    sendWSMessage(`chatting-event.${hashSlug}`, {
      type: "admin",
      message: message,
    });
  };

  return (
    <div>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={() => getConnectionStatus()}>
        Check Status
      </button>
      <button onClick={() => handleChatSelection('chat-123')}>
        Switch to Chat 123
      </button>
      <button onClick={handleCustomSubscription}>
        Subscribe to Custom Channel
      </button>
    </div>
  );
};
