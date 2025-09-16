'use client';

import { useSocket } from '@/contexts/SocketProvider';
import { Wifi, WifiOff } from 'lucide-react';

export const WebSocketStatus = () => {
  const { connected } = useSocket();

  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-600 font-medium">Disconnected</span>
        </>
      )}
    </div>
  );
};
