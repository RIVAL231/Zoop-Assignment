import { Radio, Square } from 'lucide-react';
import socketService from '../services/socket';
import './LiveSessionControl.css';

function LiveSessionControl({ session, onSessionUpdate }) {
  const handleEndSession = () => {
    if (!confirm('Are you sure you want to end this live session?')) return;
    
    socketService.updateSessionStatus(session._id, 'ended');
  };

  return (
    <div className="live-session-control card">
      <div className="control-content">
        <div className="session-info">
          <Radio size={24} className="live-icon" />
          <div>
            <h3>Live Session Active</h3>
            <p>{session.title}</p>
          </div>
        </div>
        
        <button className="btn btn-danger" onClick={handleEndSession}>
          <Square size={18} />
          End Session
        </button>
      </div>

      <div className="session-stats">
        <div className="stat">
          <span className="stat-label">Products</span>
          <span className="stat-value">{session.products?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Viewers</span>
          <span className="stat-value">{session.analytics?.totalViewers || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Reactions</span>
          <span className="stat-value">{session.analytics?.totalReactions || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Questions</span>
          <span className="stat-value">{session.analytics?.totalQuestions || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default LiveSessionControl;
