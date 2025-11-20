import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    // Use environment variable or fallback to localhost for development
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
