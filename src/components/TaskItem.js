"use client";

import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiFlag,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";

const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} day(s)`,
        status: "overdue",
      };
    } else if (diffDays === 0) {
      return { text: "Due today", status: "today" };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", status: "soon" };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, status: "soon" };
    } else {
      return { text: `Due ${formatDate(dateString)}`, status: "normal" };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#e53e3e";
      case "medium":
        return "#dd6b20";
      case "low":
        return "#38a169";
      default:
        return "#718096";
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div
      className={`task-item ${
        task.completed ? "completed" : "pending"
      } task-animate`}
    >
      <div className="task-content">
        <div className="task-header">
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              id={`task-${task.id}`}
            />
            <label
              htmlFor={`task-${task.id}`}
              className="checkbox-label"
            ></label>
          </div>

          <div className="task-info">
            <div className="task-title-row">
              <h4
                className={`task-title ${
                  task.completed ? "completed-text" : ""
                }`}
              >
                {task.title}
              </h4>
              <div
                className="priority-indicator"
                style={{
                  backgroundColor: getPriorityColor(task.priority),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                }}
                title={`${task.priority} priority`}
              >
                <FiFlag style={{ marginRight: 2 }} />
              </div>
            </div>

            {task.description && (
              <p
                className={`task-description ${
                  task.completed ? "completed-text" : ""
                }`}
              >
                {task.description}
              </p>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag, index) => (
                  <span key={index} className="task-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="task-meta">
              <span className="task-date">
                Created: {formatDate(task.createdAt)}
              </span>

              {dueInfo && (
                <span className={`due-date due-${dueInfo.status}`}>
                  <FiCircle style={{ marginRight: 2 }} /> {dueInfo.text}
                </span>
              )}

              <span
                className={`task-status ${
                  task.completed ? "status-completed" : "status-pending"
                }`}
                style={{ display: "flex", alignItems: "center" }}
              >
                {task.completed ? (
                  <FiCheckCircle color="#38a169" style={{ marginRight: 4 }} />
                ) : (
                  <FiCircle color="#718096" style={{ marginRight: 4 }} />
                )}
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="task-actions">
          <button
            onClick={() => onEditTask(task)}
            className="edit-button"
            disabled={task.completed}
            title={task.completed ? "Cannot edit completed tasks" : "Edit task"}
          >
            <FiEdit2 />
          </button>

          <button
            onClick={handleDeleteClick}
            className="delete-button"
            title="Delete task"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation slide-down">
          <p>Are you sure you want to delete this task?</p>
          <div className="confirmation-buttons">
            <button onClick={handleConfirmDelete} className="confirm-delete">
              Yes, Delete
            </button>
            <button onClick={handleCancelDelete} className="cancel-delete">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
