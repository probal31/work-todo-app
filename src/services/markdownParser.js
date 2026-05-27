// Markdown parser for task checkboxes

export const parseMarkdownTasks = (markdown) => {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const tasks = [];
  
  lines.forEach((line, index) => {
    // Match markdown checkbox pattern: - [ ] or - [x]
    const checkboxMatch = line.match(/^(\s*)-\s+\[([ xX])\]\s+(.+)$/);
    
    if (checkboxMatch) {
      const [, indent, checked, text] = checkboxMatch;
      tasks.push({
        id: `task-${index}`,
        text: text.trim(),
        completed: checked.toLowerCase() === 'x',
        lineNumber: index,
        indent: indent.length
      });
    }
  });

  return tasks;
};

export const generateMarkdownFromTasks = (tasks, originalMarkdown = '') => {
  // Parse original markdown to preserve non-task content
  const lines = originalMarkdown.split('\n');
  const newLines = [];
  let taskIndex = 0;

  // Find the tasks section
  let inTasksSection = false;
  let tasksStartIndex = -1;
  let tasksEndIndex = -1;

  lines.forEach((line, index) => {
    if (line.match(/^##\s+Tasks\s*$/)) {
      inTasksSection = true;
      tasksStartIndex = index;
    } else if (inTasksSection && line.match(/^##\s+/)) {
      inTasksSection = false;
      tasksEndIndex = index;
    } else if (inTasksSection && line.match(/^-\s+\[/)) {
      if (tasksEndIndex === -1) {
        tasksEndIndex = index + 1;
      }
    }
  });

  // If no tasks section found, create a default structure
  if (tasksStartIndex === -1) {
    return `# My Work & Todo List

## Tasks

${tasks.map(task => `- [${task.completed ? 'x' : ' '}] ${task.text}`).join('\n')}

---

*This file is managed by the Work & Todo App. Changes are tracked via Git commits.*`;
  }

  // Rebuild markdown with updated tasks
  for (let i = 0; i < lines.length; i++) {
    if (i === tasksStartIndex) {
      // Add tasks section header
      newLines.push(lines[i]);
      newLines.push('');
      
      // Add all tasks
      tasks.forEach(task => {
        const checkbox = task.completed ? '[x]' : '[ ]';
        newLines.push(`- ${checkbox} ${task.text}`);
      });
      
      // Skip old task lines
      i = tasksEndIndex - 1;
    } else if (i < tasksStartIndex || i >= tasksEndIndex) {
      newLines.push(lines[i]);
    }
  }

  return newLines.join('\n');
};

export const addTask = (tasks, text) => {
  const newTask = {
    id: `task-${Date.now()}`,
    text: text.trim(),
    completed: false,
    lineNumber: tasks.length,
    indent: 0
  };
  return [...tasks, newTask];
};

export const toggleTask = (tasks, taskId) => {
  return tasks.map(task =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );
};

export const updateTask = (tasks, taskId, newText) => {
  return tasks.map(task =>
    task.id === taskId
      ? { ...task, text: newText.trim() }
      : task
  );
};

export const deleteTask = (tasks, taskId) => {
  return tasks.filter(task => task.id !== taskId);
};

export const reorderTasks = (tasks, startIndex, endIndex) => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  // Update line numbers
  return result.map((task, index) => ({
    ...task,
    lineNumber: index
  }));
};

// Made with Bob
