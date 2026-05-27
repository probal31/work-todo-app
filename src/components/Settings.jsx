import { useState } from 'react';
import './Settings.css';

function Settings({ githubAPI, onClose, onSave }) {
  const credentials = githubAPI.getCredentials();
  const [token, setToken] = useState(credentials.token);
  const [owner, setOwner] = useState(credentials.owner);
  const [repo, setRepo] = useState(credentials.repo);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsVerifying(true);

    try {
      // Set credentials temporarily to verify
      githubAPI.setCredentials(token, owner, repo);
      
      // Verify connection
      const isValid = await githubAPI.verifyConnection();
      
      if (!isValid) {
        setError('Could not connect to repository. Please check your credentials.');
        setIsVerifying(false);
        return;
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    githubAPI.clearCredentials();
    setToken('');
    setOwner('');
    setRepo('');
    setSuccess('Credentials cleared');
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ GitHub Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-info">
            <p>Configure your GitHub repository to sync tasks.</p>
            <a 
              href="https://github.com/settings/tokens/new?scopes=repo&description=Work%20Todo%20App" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
            >
              Create a Personal Access Token →
            </a>
          </div>

          <div className="form-group">
            <label htmlFor="token">Personal Access Token</label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="input"
            />
            <small>Required scope: <code>repo</code></small>
          </div>

          <div className="form-group">
            <label htmlFor="owner">Repository Owner</label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="your-username"
              className="input"
            />
            <small>Your GitHub username or organization</small>
          </div>

          <div className="form-group">
            <label htmlFor="repo">Repository Name</label>
            <input
              id="repo"
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="work-todo-app"
              className="input"
            />
            <small>The repository containing TASKS.md</small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="settings-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleClear}
              disabled={isVerifying}
            >
              Clear
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={isVerifying || !token || !owner || !repo}
            >
              {isVerifying ? 'Verifying...' : 'Save & Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

// Made with Bob
