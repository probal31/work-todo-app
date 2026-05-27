import { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(task.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
          aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="task-edit-input"
            autoFocus
          />
        ) : (
          <span 
            className="task-text"
            onClick={() => setIsEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="task-btn save-btn"
              aria-label="Save"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="task-btn cancel-btn"
              aria-label="Cancel"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="task-btn edit-btn"
              aria-label="Edit task"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="task-btn delete-btn"
              aria-label="Delete task"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskItem;

// Made with Bob
