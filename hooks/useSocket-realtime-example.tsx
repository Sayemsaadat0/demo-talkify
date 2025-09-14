// Example of how real-time messaging works with the updated hooks

import { useGetInboxList } from './useGetInboxList';
import { useSocket } from './useSocket';

export const RealTimeInboxExample = () => {
  // This hook now automatically listens for real-time updates
  const { data: inboxData, loading } = useGetInboxList('all', 1, 20);
  
  const { sendWSMessage } = useSocket();

  // Example: Send a test message to trigger real-time updates
  const sendTestMessage = () => {
    sendWSMessage('new-message-global', {
      chat_hash_slug: 'test-chat-123',
      message: 'Hello from real-time!',
      sender_type: 'user',
      timestamp: new Date().toISOString()
    });
  };

  // Example: Create a new chat
  const createTestChat = () => {
    sendWSMessage('new-chat-global', {
      id: Date.now(),
      visitor: 'Test User',
      visitor_country: 'Test Country',
      hash_slug: `test-chat-${Date.now()}`,
      total_message: 1,
      status: 0
    });
  };

  return (
    <div>
      <h2>Real-Time Inbox</h2>
      
      <div className="mb-4">
        <button onClick={sendTestMessage} className="mr-2">
          Send Test Message
        </button>
        <button onClick={createTestChat}>
          Create Test Chat
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Total Chats: {inboxData?.totalChats}</p>
          <ul>
            {inboxData?.chats.data.map(chat => (
              <li key={chat.id} className="border p-2 mb-2">
                <strong>{chat.visitor}</strong> - {chat.total_message} messages
                <br />
                <small>Last updated: {new Date(chat.updated_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

