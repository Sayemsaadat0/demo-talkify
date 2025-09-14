# Socket.IO Installation Guide

## Install Socket.IO Client

To use the Socket.IO chat functionality, you need to install the Socket.IO client:

```bash
npm install socket.io-client
```

For TypeScript support, also install the types:

```bash
npm install @types/socket.io-client
```

Or install both at once:

```bash
npm install socket.io-client @types/socket.io-client
```

## What's Included

After installation, you'll have access to:

### 1. **useSocketChat Hook** (`hooks/useSocketChat.tsx`)
A comprehensive React hook for Socket.IO communication with features:
- Real-time messaging
- Typing indicators
- Auto-reconnection
- Error handling
- Channel subscriptions
- TypeScript support

### 2. **ChatWidget Component** (`components/chat/ChatWidget.tsx`)
A complete chat interface component with:
- Modern UI design
- Message display
- Typing indicators
- Connection status
- Sound notifications
- Auto-scroll

### 3. **Example Page** (`app/(dashboard)/chat-widget/example/page.tsx`)
A demonstration page showing how to use the chat functionality.

## Usage Examples

### Basic Hook Usage
```typescript
import { useSocketChat } from '@/hooks/useSocketChat';

const { sendMessage, messages, isConnected } = useSocketChat({
  hash_slug: 'your-room-id',
  onMessage: (msg) => console.log('New message:', msg)
});
```

### Complete Widget Usage
```typescript
import ChatWidget from '@/components/chat/ChatWidget';

<ChatWidget hash_slug="your-room-id" />
```

## Server Configuration

The hook is configured to connect to:
- **URL**: `wss://staging.talkify.pro`
- **Transports**: WebSocket only
- **Auto-reconnection**: Enabled with exponential backoff
- **Channels**: 
  - `chatting-event.{hash_slug}`
  - `user-typing-event.{hash_slug}`

## Features

✅ **Real-time messaging**  
✅ **Typing indicators**  
✅ **Auto-reconnection**  
✅ **Error handling**  
✅ **TypeScript support**  
✅ **Memory leak prevention**  
✅ **Modern React patterns**  

## Next Steps

1. Install the dependencies: `npm install socket.io-client @types/socket.io-client`
2. Import and use the hook or widget in your components
3. Customize the styling and behavior as needed
4. Test the connection with your Socket.IO server
