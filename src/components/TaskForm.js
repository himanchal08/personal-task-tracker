"use client";

import { useState, useEffect } from "react";

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
      setDueDate(editingTask.dueDate ? editingTask.dueDate.slice(0, 16) : "");
      setTags(editingTask.tags ? editingTask.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setTags("");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags: tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    };

    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setTags("");
    setError("");
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setTags("");
    setError("");
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="task-form-container">
      <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <div className="input-group flex-2">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task-input"
              required
            />
          </div>

          <div className="input-group flex-1">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="task-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="task-textarea"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="input-group flex-1">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="task-input"
            />
          </div>

          <div className="input-group flex-1">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              placeholder="work, personal, urgent (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="task-input"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            {editingTask ? "Update Task" : "Add Task"}
          </button>

          {editingTask && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
