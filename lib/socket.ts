/* eslint-disable @typescript-eslint/no-explicit-any */
// WebSocket connection for Talkify
let ws: WebSocket | null = null
const channels: Record<string, (data: any) => void> = {}

export const getSocket = (): WebSocket | null => {
  return ws
}

export const connectSocket = (): WebSocket | null => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    console.log('🔌 Connecting to WebSocket...')
    
    try {
      ws = new WebSocket('wss://staging.talkify.pro/ws/')
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected')
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 WebSocket message received:', data)
          const handler = channels[data.channel]
          if (handler) handler(data)
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('❌ WebSocket disconnected')
      }
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
      }
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error)
    }
  }
  
  return ws
}

export const disconnectSocket = () => {
  if (ws) {
    ws.close()
    ws = null
    console.log('🔌 WebSocket disconnected')
  }
}

export const subscribe = (channel: string, callback: (data: any) => void) => {
  channels[channel] = callback
  console.log(`📡 Subscribed to channel: ${channel}`)
}

export const unsubscribe = (channel: string) => {
  delete channels[channel]
  console.log(`📡 Unsubscribed from channel: ${channel}`)
}

export const unsubscribeAll = () => {
  Object.keys(channels).forEach(channel => {
    delete channels[channel]
  })
  console.log('📡 Unsubscribed from all channels')
}

export const getConnectionStatus = () => {
  return {
    connected: ws?.readyState === WebSocket.OPEN,
    readyState: ws?.readyState,
    url: ws?.url
  }
}