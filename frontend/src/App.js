import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      
      if (response.ok) {
        setNewTask({ title: '', description: '' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        setEditingTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = (task) => {
    updateTask(task.id, { ...task, completed: !task.completed });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
      </header>

      <main className="container">
        <form onSubmit={createTask} className="task-form">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button type="submit">Add Task</button>
        </form>

        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              {editingTask === task.id ? (
                <EditTaskForm 
                  task={task} 
                  onSave={(updates) => updateTask(task.id, updates)}
                  onCancel={() => setEditingTask(null)}
                />
              ) : (
                <TaskDisplay 
                  task={task}
                  onEdit={() => setEditingTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onToggleComplete={() => toggleComplete(task)}
                  onToggleComments={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  showComments={expandedTask === task.id}
                />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TaskDisplay({ task, onEdit, onDelete, onToggleComplete, onToggleComments, showComments }) {
  return (
    <>
      <div className="task-header">
        <div className="task-content">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <small>Created: {new Date(task.created_at).toLocaleDateString()}</small>
        </div>
        <div className="task-actions">
          <button onClick={onToggleComplete}>
            {task.completed ? 'Undo' : 'Complete'}
          </button>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onToggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
          <button onClick={onDelete} className="delete-btn">Delete</button>
        </div>
      </div>
      {showComments && <Comments taskId={task.id} />}
    </>
  );
}

function EditTaskForm({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    completed: task.completed
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE}/comments?task_id=${taskId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, content: newComment })
      });
      
      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        setEditingComment(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comments-section">
      <h4>Comments</h4>
      
      <form onSubmit={createComment} className="comment-form">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          required
        />
        <button type="submit">Add Comment</button>
      </form>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            {editingComment === comment.id ? (
              <EditCommentForm 
                comment={comment}
                onSave={(content) => updateComment(comment.id, content)}
                onCancel={() => setEditingComment(null)}
              />
            ) : (
              <>
                <p>{comment.content}</p>
                <div className="comment-meta">
                  <small>Created: {new Date(comment.created_at).toLocaleDateString()}</small>
                  <div className="comment-actions">
                    <button onClick={() => setEditingComment(comment.id)}>Edit</button>
                    <button onClick={() => deleteComment(comment.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditCommentForm({ comment, onSave, onCancel }) {
  const [content, setContent] = useState(comment.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave(content);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="3"
        required
      />
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}


export default App;