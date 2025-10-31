import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  // Join a live session
  joinSession(sessionId, callback) {
    if (!this.socket) this.connect();
    this.socket.emit('join-session', sessionId);
    
    if (callback) {
      this.socket.once('join-success', callback);
    }
  }

  // Leave a session
  leaveSession(sessionId) {
    if (this.socket) {
      this.socket.emit('leave-session', sessionId);
    }
  }

  // Send reaction
  sendReaction(sessionId, reactionType, userId = 'anonymous') {
    if (!this.socket) return;
    this.socket.emit('send-reaction', { sessionId, reactionType, userId });
  }

  // Send question
  sendQuestion(sessionId, question, userName = 'Anonymous') {
    if (!this.socket) return;
    this.socket.emit('send-question', { sessionId, question, userName });
  }

  // Highlight product (admin)
  highlightProduct(sessionId, productId) {
    if (!this.socket) return;
    this.socket.emit('highlight-product', { sessionId, productId });
  }

  // Update session status (admin)
  updateSessionStatus(sessionId, status) {
    if (!this.socket) return;
    this.socket.emit('update-session-status', { sessionId, status });
  }

  // Typing indicator
  sendTypingIndicator(sessionId, userName, isTyping) {
    if (!this.socket) return;
    this.socket.emit('typing-question', { sessionId, userName, isTyping });
  }

  // Listen to events
  on(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
    this.listeners.delete(event);
  }
}

const socketService = new SocketService();
export default socketService;
