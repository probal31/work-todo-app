import { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, onToggle, onUpdate, onDelete, onAdd }) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAdd(newTaskText);
      setNewTaskText('');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>📝 Tasks</h2>
        <div className="task-stats">
          <span className="stat-badge">
            {completedCount} / {totalCount} completed
          </span>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="add-task-input"
          aria-label="New task"
        />
        <button 
          type="submit" 
          className="add-task-btn"
          disabled={!newTaskText.trim()}
          aria-label="Add task"
        >
          ➕ Add
        </button>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>🎉 No tasks yet!</p>
            <p className="empty-subtitle">Add your first task above to get started.</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;

// Made with Bob
