import { Heart, Flame, ThumbsUp, Smile } from 'lucide-react';
import './ReactionBar.css';

const reactions = [
  { type: 'like', icon: ThumbsUp, label: 'Like', color: '#3b82f6' },
  { type: 'love', icon: Heart, label: 'Love', color: '#ef4444' },
  { type: 'wow', icon: Smile, label: 'Wow', color: '#f59e0b' },
  { type: 'fire', icon: Flame, label: 'Fire', color: '#ec4899' }
];

function ReactionBar({ onReaction, disabled }) {
  const handleReaction = (type) => {
    if (disabled) return;
    onReaction(type);
  };

  return (
    <div className="reaction-bar">
      <span className="reaction-label">React:</span>
      <div className="reactions">
        {reactions.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            className="reaction-btn"
            onClick={() => handleReaction(type)}
            disabled={disabled}
            style={{ '--reaction-color': color }}
            title={label}
          >
            <Icon size={24} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ReactionBar;
