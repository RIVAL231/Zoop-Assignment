import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import './QuestionPanel.css';

function QuestionPanel({ questions, onSubmit, disabled }) {
  const [questionText, setQuestionText] = useState('');
  const [userName, setUserName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!questionText.trim()) return;

    onSubmit(questionText, userName || 'Anonymous');
    setQuestionText('');
    setShowForm(false);
  };

  return (
    <div className="question-panel card">
      <div className="panel-header">
        <div className="header-title">
          <MessageCircle size={20} />
          <h3>Questions</h3>
        </div>
        <span className="question-count">{questions.length}</span>
      </div>

      {!showForm ? (
        <button 
          className="btn btn-primary ask-btn"
          onClick={() => setShowForm(true)}
          disabled={disabled}
        >
          <MessageCircle size={18} />
          Ask a Question
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="question-form">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={50}
          />
          <textarea
            placeholder="Type your question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            maxLength={500}
            autoFocus
          />
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => {
                setShowForm(false);
                setQuestionText('');
                setUserName('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} />
              Send
            </button>
          </div>
        </form>
      )}

      <div className="questions-list">
        {questions.length === 0 ? (
          <p className="text-muted text-center">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="question-item">
              <div className="question-header">
                <strong>{q.userName}</strong>
                <span className="timestamp">
                  {new Date(q.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p>{q.question}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuestionPanel;
