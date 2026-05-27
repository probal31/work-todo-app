import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import Settings from './components/Settings';
import History from './components/History';
import githubAPI from './services/githubAPI';
import {
  parseMarkdownTasks,
  generateMarkdownFromTasks,
  addTask,
  toggleTask,
  updateTask,
  deleteTask
} from './services/markdownParser';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [originalMarkdown, setOriginalMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const credentials = githubAPI.getCredentials();
    setIsConfigured(credentials.isConfigured);
    
    if (credentials.isConfigured) {
      loadTasks();
    } else {
      setLoading(false);
      setShowSettings(true);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const { content } = await githubAPI.fetchFile();
      setOriginalMarkdown(content);
      const parsedTasks = parseMarkdownTasks(content);
      setTasks(parsedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (updatedTasks, commitMessage) => {
    setSyncing(true);
    setError('');

    try {
      const markdown = generateMarkdownFromTasks(updatedTasks, originalMarkdown);
      await githubAPI.updateFile(markdown, commitMessage);
      setOriginalMarkdown(markdown);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
      // Revert to previous state on error
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const handleAddTask = async (text) => {
    const updatedTasks = addTask(tasks, text);
    try {
      await saveTasks(updatedTasks, `Add task: ${text}`);
    } catch (err) {
      // Error already handled in saveTasks
    }
  };

  const handleToggleTask = async (taskId) => {
    const updatedTasks = toggleTask(tasks, taskId);
    const task = tasks.find(t => t.id === taskId);
    const action = task.completed ? 'Mark incomplete' : 'Mark complete';
    
    try {
      await saveTasks(updatedTasks, `${action}: ${task.text}`);
    } catch (err) {
      // Error already handled in saveTasks
    }
  };

  const handleUpdateTask = async (taskId, newText) => {
    const updatedTasks = updateTask(tasks, taskId, newText);
    const task = tasks.find(t => t.id === taskId);
    
    try {
      await saveTasks(updatedTasks, `Update task: ${task.text} → ${newText}`);
    } catch (err) {
      // Error already handled in saveTasks
    }
  };

  const handleDeleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTasks = deleteTask(tasks, taskId);
    
    try {
      await saveTasks(updatedTasks, `Delete task: ${task.text}`);
    } catch (err) {
      // Error already handled in saveTasks
    }
  };

  const handleRefresh = () => {
    loadTasks();
  };

  const handleSettingsSave = () => {
    setIsConfigured(true);
    loadTasks();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>✅ Work & Todo App</h1>
            <div className="header-actions">
              {isConfigured && (
                <>
                  <button
                    onClick={handleRefresh}
                    className="icon-btn"
                    disabled={loading || syncing}
                    title="Refresh tasks"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="icon-btn"
                    title="View history"
                  >
                    📜
                  </button>
                </>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="icon-btn"
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
          
          {syncing && (
            <div className="sync-indicator">
              <span className="sync-dot"></span>
              Syncing with GitHub...
            </div>
          )}
          
          {error && (
            <div className="error-banner">
              ❌ {error}
              <button onClick={() => setError('')} className="dismiss-btn">✕</button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : !isConfigured ? (
            <div className="welcome-container">
              <h2>👋 Welcome!</h2>
              <p>Configure your GitHub repository to get started.</p>
              <button
                onClick={() => setShowSettings(true)}
                className="primary-btn"
              >
                Configure GitHub
              </button>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onAdd={handleAddTask}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Powered by GitHub • 
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"> View on GitHub</a>
          </p>
        </div>
      </footer>

      {showSettings && (
        <Settings
          githubAPI={githubAPI}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}

      {showHistory && (
        <History
          githubAPI={githubAPI}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;

// Made with Bob
