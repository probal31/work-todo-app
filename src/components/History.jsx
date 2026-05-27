import { useState, useEffect } from 'react';
import './History.css';

function History({ githubAPI, onClose }) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const history = await githubAPI.fetchCommitHistory(20);
      setCommits(history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString();
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h2>📜 Change History</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="history-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading history...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
              <button className="retry-btn" onClick={loadHistory}>
                Retry
              </button>
            </div>
          ) : commits.length === 0 ? (
            <div className="empty-state">
              <p>No history yet</p>
              <p className="empty-subtitle">Changes will appear here once you start modifying tasks.</p>
            </div>
          ) : (
            <div className="commits-list">
              {commits.map((commit) => (
                <div key={commit.sha} className="commit-item">
                  <div className="commit-header">
                    <span className="commit-sha">{commit.sha}</span>
                    <span className="commit-date">{formatDate(commit.date)}</span>
                  </div>
                  <div className="commit-message">{commit.message}</div>
                  <div className="commit-author">by {commit.author}</div>
                  <a 
                    href={commit.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="commit-link"
                  >
                    View on GitHub →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;

// Made with Bob
