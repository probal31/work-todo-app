# React Native Migration Guide

This document outlines how to migrate the Work & Todo App to React Native for Android (and iOS).

## Architecture Overview

The current web app is built with a **service-oriented architecture** that separates business logic from UI components. This makes migration to React Native straightforward.

### Reusable Code (~70%)

The following can be reused with minimal or no changes:

#### 1. Services Layer (100% Reusable)
- `src/services/githubAPI.js` - GitHub API integration
- `src/services/markdownParser.js` - Markdown parsing logic

#### 2. Business Logic (100% Reusable)
- Task management functions (add, update, delete, toggle)
- State management logic
- Data transformation utilities

#### 3. API Integration (100% Reusable)
- GitHub API endpoints
- Authentication flow
- Error handling patterns

### Platform-Specific Code (~30%)

The following need to be adapted for React Native:

#### 1. UI Components
- Replace HTML/CSS with React Native components
- Use React Native styling (StyleSheet)
- Adapt touch interactions

#### 2. Storage
- Replace `localStorage` with `AsyncStorage`
- Implement secure token storage with `react-native-keychain`

#### 3. Navigation
- Use React Navigation instead of web routing

## Step-by-Step Migration

### Phase 1: Setup React Native Project

```bash
# Create new React Native project
npx react-native init WorkTodoApp

# Install dependencies
cd WorkTodoApp
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
```

### Phase 2: Copy Shared Services

```bash
# Copy service files (no changes needed!)
cp ../work-todo-app/src/services/githubAPI.js ./src/services/
cp ../work-todo-app/src/services/markdownParser.js ./src/services/
```

### Phase 3: Adapt Storage Layer

Create `src/services/storage.js`:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

export const storage = {
  // Secure token storage
  async setToken(token) {
    await Keychain.setGenericPassword('github_token', token);
  },
  
  async getToken() {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  },
  
  // Regular storage
  async setItem(key, value) {
    await AsyncStorage.setItem(key, value);
  },
  
  async getItem(key) {
    return await AsyncStorage.getItem(key);
  },
  
  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  }
};
```

Update `githubAPI.js` to use the new storage:

```javascript
import { storage } from './storage';

class GitHubAPI {
  constructor() {
    this.loadCredentials();
  }

  async loadCredentials() {
    this.token = await storage.getToken() || '';
    this.owner = await storage.getItem('github_owner') || '';
    this.repo = await storage.getItem('github_repo') || '';
  }

  async setCredentials(token, owner, repo) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    await storage.setToken(token);
    await storage.setItem('github_owner', owner);
    await storage.setItem('github_repo', repo);
  }
  
  // ... rest of the code remains the same
}
```

### Phase 4: Create React Native Components

#### TaskItem Component

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const TaskItem = ({ task, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(task.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggle(task.id)}>
        <Text style={styles.checkbox}>
          {task.completed ? '☑' : '☐'}
        </Text>
      </TouchableOpacity>
      
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <TouchableOpacity 
          style={styles.textContainer}
          onPress={() => setIsEditing(true)}
        >
          <Text style={[
            styles.text,
            task.completed && styles.completedText
          ]}>
            {task.text}
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Text style={styles.deleteBtn}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  checkbox: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#1f2937',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 6,
  },
  deleteBtn: {
    fontSize: 20,
    marginLeft: 8,
  },
});

export default TaskItem;
```

#### TaskList Component

```javascript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onUpdate, onDelete, onAdd }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAdd(newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Tasks</Text>
        <Text style={styles.stats}>
          {tasks.filter(t => t.completed).length} / {tasks.length} completed
        </Text>
      </View>

      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder="Add a new task..."
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTask}
          disabled={!newTaskText.trim()}
        >
          <Text style={styles.addButtonText}>➕ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🎉 No tasks yet!</Text>
            <Text style={styles.emptySubtext}>Add your first task above</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  stats: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addForm: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 20,
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
});

export default TaskList;
```

### Phase 5: Main App Component

```javascript
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import TaskList from './components/TaskList';
import githubAPI from './services/githubAPI';
import { parseMarkdownTasks, generateMarkdownFromTasks, addTask, toggleTask, updateTask, deleteTask } from './services/markdownParser';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { content } = await githubAPI.fetchFile();
      const parsedTasks = parseMarkdownTasks(content);
      setTasks(parsedTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (updatedTasks, message) => {
    try {
      const markdown = generateMarkdownFromTasks(updatedTasks);
      await githubAPI.updateFile(markdown, message);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  // Handler functions remain the same as web version
  const handleAddTask = (text) => {
    const updatedTasks = addTask(tasks, text);
    saveTasks(updatedTasks, `Add task: ${text}`);
  };

  // ... other handlers

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onAdd={handleAddTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});

export default App;
```

## Code Reusability Summary

| Component | Web | React Native | Reusability |
|-----------|-----|--------------|-------------|
| GitHub API Service | ✅ | ✅ | 100% |
| Markdown Parser | ✅ | ✅ | 100% |
| Business Logic | ✅ | ✅ | 100% |
| UI Components | HTML/CSS | React Native | 0% (rewrite) |
| Storage | localStorage | AsyncStorage | Adapter needed |
| Navigation | React Router | React Navigation | Different library |

**Overall Code Reuse: ~70%**

## Benefits of This Architecture

1. **Shared Business Logic** - No duplication of core functionality
2. **Consistent Behavior** - Same logic across platforms
3. **Easier Maintenance** - Fix bugs once, applies to both platforms
4. **Faster Development** - Focus on UI differences only
5. **Type Safety** - Can add TypeScript to shared services

## Next Steps

1. Set up React Native development environment
2. Create new React Native project
3. Copy and adapt services layer
4. Build React Native UI components
5. Test on Android emulator/device
6. Publish to Google Play Store

## Additional Features for Mobile

- Push notifications for task reminders
- Biometric authentication
- Offline-first with sync queue
- Widget support
- Share tasks via native share sheet
- Camera integration for task attachments

---

This architecture ensures maximum code reuse while maintaining platform-specific optimizations.