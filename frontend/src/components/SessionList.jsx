import { Play, Square, Calendar, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { sessionAPI } from '../services/api';
import './SessionList.css';

function SessionList({ sessions, onSessionStatusChange }) {
  const handleStatusChange = async (sessionId, newStatus) => {
    const confirmMessages = {
      live: 'Are you sure you want to start this live session?',
      ended: 'Are you sure you want to end this live session?',
      scheduled: 'Are you sure you want to reschedule this session?'
    };

    if (!confirm(confirmMessages[newStatus])) return;

    try {
      const response = await sessionAPI.updateStatus(sessionId, newStatus);
      toast.success(`Session ${newStatus} successfully`);
      onSessionStatusChange(response.data.data);
    } catch (error) {
      toast.error('Failed to update session status');
      console.error(error);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await sessionAPI.delete(sessionId);
      toast.success('Session deleted successfully');
      onSessionStatusChange();
    } catch (error) {
      toast.error('Failed to delete session');
      console.error(error);
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="empty-state">
        <Calendar size={48} className="text-muted" />
        <p>No sessions yet. Create your first live session!</p>
      </div>
    );
  }

  return (
    <div className="session-list">
      {sessions.map(session => (
        <div key={session._id} className="session-card card">
          <div className="session-header">
            <div>
              <h3>{session.title}</h3>
              <p>{session.description}</p>
            </div>
            <span className={`badge badge-${getStatusColor(session.status)}`}>
              {session.status.toUpperCase()}
            </span>
          </div>

          <div className="session-meta">
            <div className="meta-item">
              <Package size={16} />
              <span>{session.products.length} Products</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{new Date(session.startTime).toLocaleDateString()}</span>
            </div>
          </div>

          {session.products.length > 0 && (
            <div className="session-products">
              {session.products.slice(0, 3).map(product => (
                <div key={product._id} className="mini-product">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/50'} 
                    alt={product.name}
                  />
                  <span>{product.name}</span>
                </div>
              ))}
              {session.products.length > 3 && (
                <div className="more-products">
                  +{session.products.length - 3} more
                </div>
              )}
            </div>
          )}

          <div className="session-actions">
            {session.status === 'scheduled' && (
              <button
                className="btn btn-success"
                onClick={() => handleStatusChange(session._id, 'live')}
              >
                <Play size={16} />
                Start Live
              </button>
            )}
            
            {session.status === 'live' && (
              <button
                className="btn btn-danger"
                onClick={() => handleStatusChange(session._id, 'ended')}
              >
                <Square size={16} />
                End Session
              </button>
            )}

            {session.status === 'ended' && (
              <button
                className="btn btn-outline"
                onClick={() => handleDelete(session._id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const getStatusColor = (status) => {
  const colors = {
    scheduled: 'warning',
    live: 'success',
    ended: 'danger'
  };
  return colors[status] || 'primary';
};

export default SessionList;
