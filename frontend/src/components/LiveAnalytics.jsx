import { TrendingUp, Users, Heart, MessageCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './LiveAnalytics.css';

function LiveAnalytics({ analytics, viewerCount }) {
  if (!analytics) {
    return (
      <div className="live-analytics card">
        <h3>Live Analytics</h3>
        <p className="text-muted">No analytics data available</p>
      </div>
    );
  }

  const reactionData = [
    { name: 'Like', value: analytics.reactionBreakdown.like, color: '#3b82f6' },
    { name: 'Love', value: analytics.reactionBreakdown.love, color: '#ef4444' },
    { name: 'Wow', value: analytics.reactionBreakdown.wow, color: '#f59e0b' },
    { name: 'Fire', value: analytics.reactionBreakdown.fire, color: '#ec4899' }
  ];

  const engagementRate = analytics.totalViewers > 0 
    ? ((analytics.totalReactions + analytics.totalQuestions) / analytics.totalViewers * 100).toFixed(1)
    : 0;

  return (
    <div className="live-analytics card">
      <div className="analytics-header">
        <div className="header-title">
          <TrendingUp size={20} />
          <h3>Live Analytics</h3>
        </div>
        <span className="live-indicator">LIVE</span>
      </div>

      <div className="analytics-stats">
        <div className="stat-card">
          <Users size={24} className="stat-icon" />
          <div>
            <span className="stat-value">{viewerCount}</span>
            <span className="stat-label">Current Viewers</span>
          </div>
        </div>

        <div className="stat-card">
          <Activity size={24} className="stat-icon" />
          <div>
            <span className="stat-value">{analytics.peakViewers}</span>
            <span className="stat-label">Peak Viewers</span>
          </div>
        </div>

        <div className="stat-card">
          <Heart size={24} className="stat-icon" />
          <div>
            <span className="stat-value">{analytics.totalReactions}</span>
            <span className="stat-label">Total Reactions</span>
          </div>
        </div>

        <div className="stat-card">
          <MessageCircle size={24} className="stat-icon" />
          <div>
            <span className="stat-value">{analytics.totalQuestions}</span>
            <span className="stat-label">Questions</span>
          </div>
        </div>
      </div>

      <div className="engagement-metric">
        <div className="metric-header">
          <span>Engagement Rate</span>
          <span className="metric-value">{engagementRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(engagementRate, 100)}%` }}
          />
        </div>
      </div>

      {analytics.totalReactions > 0 && (
        <div className="reaction-chart">
          <h4>Reaction Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={reactionData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => entry.value > 0 ? entry.name : ''}
              >
                {reactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="reaction-legend">
            {reactionData.map((reaction) => (
              <div key={reaction.name} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: reaction.color }}
                />
                <span>{reaction.name}: {reaction.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveAnalytics;
