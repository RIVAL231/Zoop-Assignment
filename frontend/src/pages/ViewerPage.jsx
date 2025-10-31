import { useState, useEffect, useCallback } from 'react';
import { Eye, Heart, Flame, Smile, ThumbsUp, MessageCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { sessionAPI } from '../services/api';
import socketService from '../services/socket';
import ProductShowcase from '../components/ProductShowcase';
import ReactionBar from '../components/ReactionBar';
import QuestionPanel from '../components/QuestionPanel';
import LiveAnalytics from '../components/LiveAnalytics';
import './ViewerPage.css';

function ViewerPage() {
  const [session, setSession] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchLiveSession();
    return () => {
      if (session) {
        socketService.leaveSession(session._id);
      }
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (session) {
      setupSocketListeners();
      socketService.joinSession(session._id, (data) => {
        setConnected(true);
        setViewerCount(data.viewerCount);
        toast.success('Connected to live session!');
      });
    }

    return () => {
      if (session) {
        socketService.removeAllListeners('viewer-count');
        socketService.removeAllListeners('new-reaction');
        socketService.removeAllListeners('new-question');
        socketService.removeAllListeners('product-highlighted');
        socketService.removeAllListeners('session-status-changed');
      }
    };
  }, [session]);

  const fetchLiveSession = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getLive();
      setSession(response.data.data);
      
      if (response.data.data) {
        setAnalytics(response.data.data.analytics);
      } else {
        toast.error('No live session available');
      }
    } catch (error) {
      console.error('Failed to fetch live session:', error);
      toast.error('Failed to load live session');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = useCallback(() => {
    socketService.on('viewer-count', (count) => {
      setViewerCount(count);
    });

    socketService.on('new-reaction', (data) => {
      setReactions(prev => [...prev, { ...data, id: Date.now() }]);
      setAnalytics(data.analytics);
      
      // Remove reaction after animation
      setTimeout(() => {
        setReactions(prev => prev.slice(1));
      }, 3000);
    });

    socketService.on('new-question', (question) => {
      setQuestions(prev => [question, ...prev]);
      toast('New question received!', { icon: '❓' });
    });

    socketService.on('product-highlighted', ({ productId }) => {
      const product = session?.products.find(p => p._id === productId);
      if (product) {
        setHighlightedProduct(product);
        toast.success(`Spotlight: ${product.name}`);
        
        setTimeout(() => {
          setHighlightedProduct(null);
        }, 5000);
      }
    });

    socketService.on('session-status-changed', ({ status }) => {
      if (status === 'ended') {
        toast.error('Live session has ended');
        setTimeout(() => {
          fetchLiveSession();
        }, 2000);
      }
    });
  }, [session]);

  const handleReaction = (reactionType) => {
    if (!session || !connected) return;
    socketService.sendReaction(session._id, reactionType);
  };

  const handleQuestionSubmit = (question, userName) => {
    if (!session || !connected) return;
    socketService.sendQuestion(session._id, question, userName);
    toast.success('Question sent!');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading live session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container">
        <div className="no-session">
          <Eye size={64} className="text-muted" />
          <h2>No Live Session</h2>
          <p>There are no live sessions at the moment. Check back soon!</p>
          <button className="btn btn-primary" onClick={fetchLiveSession}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-page">
      <div className="viewer-header">
        <div className="container">
          <div className="session-info">
            <div>
              <div className="live-indicator">LIVE</div>
              <h1>{session.title}</h1>
              <p>{session.description}</p>
            </div>
            <div className="viewer-stats">
              <div className="stat">
                <Users size={20} />
                <span>{viewerCount.toLocaleString()}</span>
                <small>Viewers</small>
              </div>
              <div className="stat">
                <Heart size={20} />
                <span>{analytics?.totalReactions.toLocaleString() || 0}</span>
                <small>Reactions</small>
              </div>
              <div className="stat">
                <MessageCircle size={20} />
                <span>{analytics?.totalQuestions.toLocaleString() || 0}</span>
                <small>Questions</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="viewer-content">
        <div className="container">
          <div className="viewer-grid">
            <div className="main-area">
              <ProductShowcase 
                products={session.products}
                highlightedProduct={highlightedProduct}
              />
              
              <div className="reaction-overlay">
                {reactions.map((reaction) => (
                  <div key={reaction.id} className="floating-reaction">
                    {getReactionEmoji(reaction.reactionType)}
                  </div>
                ))}
              </div>

              <ReactionBar onReaction={handleReaction} disabled={!connected} />
            </div>

            <div className="sidebar">
              <LiveAnalytics analytics={analytics} viewerCount={viewerCount} />
              <QuestionPanel 
                questions={questions}
                onSubmit={handleQuestionSubmit}
                disabled={!connected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getReactionEmoji = (type) => {
  const emojis = {
    like: '👍',
    love: '❤️',
    wow: '😮',
    fire: '🔥'
  };
  return emojis[type] || '👍';
};

export default ViewerPage;
