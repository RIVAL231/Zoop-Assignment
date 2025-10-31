import Session from '../models/Session.js';

// Store active viewers
const activeViewers = new Map();
const sessionRooms = new Map();

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join live session
    socket.on('join-session', async (sessionId) => {
      try {
        socket.join(sessionId);
        
        // Add to active viewers
        if (!activeViewers.has(sessionId)) {
          activeViewers.set(sessionId, new Set());
        }
        activeViewers.get(sessionId).add(socket.id);

        const currentViewers = activeViewers.get(sessionId).size;

        // Update session analytics
        const session = await Session.findById(sessionId);
        if (session) {
          session.analytics.totalViewers = Math.max(
            session.analytics.totalViewers,
            currentViewers
          );
          session.analytics.peakViewers = Math.max(
            session.analytics.peakViewers,
            currentViewers
          );
          await session.save();

          // Broadcast viewer count to all users in session
          io.to(sessionId).emit('viewer-count', currentViewers);
          
          socket.emit('join-success', {
            sessionId,
            viewerCount: currentViewers
          });

          console.log(`👥 User ${socket.id} joined session ${sessionId}. Active viewers: ${currentViewers}`);
        }
      } catch (error) {
        console.error('Error joining session:', error);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Leave session
    socket.on('leave-session', async (sessionId) => {
      try {
        socket.leave(sessionId);
        
        if (activeViewers.has(sessionId)) {
          activeViewers.get(sessionId).delete(socket.id);
          const currentViewers = activeViewers.get(sessionId).size;
          
          io.to(sessionId).emit('viewer-count', currentViewers);
          
          console.log(`👋 User ${socket.id} left session ${sessionId}. Active viewers: ${currentViewers}`);
        }
      } catch (error) {
        console.error('Error leaving session:', error);
      }
    });

    // Send reaction
    socket.on('send-reaction', async ({ sessionId, reactionType, userId }) => {
      try {
        const session = await Session.findById(sessionId);
        if (session) {
          // Update reaction count
          session.analytics.totalReactions += 1;
          if (session.analytics.reactionBreakdown[reactionType] !== undefined) {
            session.analytics.reactionBreakdown[reactionType] += 1;
          }
          await session.save();

          // Broadcast reaction to all users in session
          io.to(sessionId).emit('new-reaction', {
            reactionType,
            userId,
            timestamp: Date.now(),
            analytics: session.analytics
          });

          console.log(`❤️ Reaction ${reactionType} sent to session ${sessionId}`);
        }
      } catch (error) {
        console.error('Error sending reaction:', error);
        socket.emit('error', { message: 'Failed to send reaction' });
      }
    });

    // Send question
    socket.on('send-question', async ({ sessionId, question, userName }) => {
      try {
        const session = await Session.findById(sessionId);
        if (session) {
          session.analytics.totalQuestions += 1;
          await session.save();

          const questionData = {
            id: Date.now().toString(),
            userName: userName || 'Anonymous',
            question,
            timestamp: new Date().toISOString()
          };

          // Broadcast question to admin/host
          io.to(sessionId).emit('new-question', questionData);

          console.log(`❓ Question received in session ${sessionId}: ${question}`);
        }
      } catch (error) {
        console.error('Error sending question:', error);
        socket.emit('error', { message: 'Failed to send question' });
      }
    });

    // Product highlight (admin only)
    socket.on('highlight-product', ({ sessionId, productId }) => {
      io.to(sessionId).emit('product-highlighted', { productId });
      console.log(`⭐ Product ${productId} highlighted in session ${sessionId}`);
    });

    // Session status update
    socket.on('update-session-status', async ({ sessionId, status }) => {
      try {
        io.to(sessionId).emit('session-status-changed', { status });
        console.log(`📢 Session ${sessionId} status changed to ${status}`);
      } catch (error) {
        console.error('Error updating session status:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      
      // Remove from all sessions
      for (const [sessionId, viewers] of activeViewers.entries()) {
        if (viewers.has(socket.id)) {
          viewers.delete(socket.id);
          const currentViewers = viewers.size;
          io.to(sessionId).emit('viewer-count', currentViewers);
          
          // Clean up empty sessions
          if (viewers.size === 0) {
            activeViewers.delete(sessionId);
          }
        }
      }
    });

    // Typing indicator for questions
    socket.on('typing-question', ({ sessionId, userName, isTyping }) => {
      socket.to(sessionId).emit('user-typing', { userName, isTyping });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socket.emit('error', { message: 'An error occurred' });
    });
  });

  // Helper function to get active viewers count
  io.getViewerCount = (sessionId) => {
    return activeViewers.get(sessionId)?.size || 0;
  };
};
