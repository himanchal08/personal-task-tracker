"use client";

import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import { taskAPI } from "./services/api";
import {
  getStoredData,
  setStoredData,
  removeStoredData,
} from "./utils/localStorage";
import "./styles/App.css";
import Settings from "./components/Settings";
import { FiLogOut, FiSettings, FiMoon, FiSun, FiSearch } from "react-icons/fi";

const PRIMARY_COLOR = "#C08497";
const SECONDARY_COLOR = "#B0D0D3";
const HIGHLIGHT_COLOR = "#F7AF9D";
const BG_LIGHT = "#FFFFFF";
const BG_DARK = "#C08497";
const TEXT_LIGHT = "#C08497";
const TEXT_DARK = "#FFFFFF";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing token and load user
  useEffect(() => {
    const storedUser = getStoredData("username");
    const storedToken = localStorage.getItem("token");
    const storedDarkMode = getStoredData("darkMode");

    if (storedUser && storedToken) {
      setUser(storedUser);
      loadTasks();
    } else {
      setLoading(false);
    }

    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty("--primary-color", PRIMARY_COLOR);
      root.style.setProperty("--secondary-color", SECONDARY_COLOR);
      root.style.setProperty("--highlight-color", HIGHLIGHT_COLOR);
      root.style.setProperty("--bg-primary", BG_DARK);
      root.style.setProperty("--bg-secondary", SECONDARY_COLOR);
      root.style.setProperty("--text-primary", TEXT_DARK);
      root.style.setProperty("--text-secondary", HIGHLIGHT_COLOR);
      root.style.setProperty("--border-color", HIGHLIGHT_COLOR);
      root.style.setProperty("--card-bg", BG_DARK);
    } else {
      root.style.setProperty("--primary-color", PRIMARY_COLOR);
      root.style.setProperty("--secondary-color", SECONDARY_COLOR);
      root.style.setProperty("--highlight-color", HIGHLIGHT_COLOR);
      root.style.setProperty("--bg-primary", BG_LIGHT);
      root.style.setProperty("--bg-secondary", SECONDARY_COLOR);
      root.style.setProperty("--text-primary", TEXT_LIGHT);
      root.style.setProperty("--text-secondary", PRIMARY_COLOR);
      root.style.setProperty("--border-color", PRIMARY_COLOR);
      root.style.setProperty("--card-bg", BG_LIGHT);
    }
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  // Load tasks from backend
  const loadTasks = async () => {
    try {
      const tasksData = await taskAPI.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (username, token) => {
    setUser(username);
    setShowRegister(false);
    loadTasks();
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setEditingTask(null);
    removeStoredData("username");
    localStorage.removeItem("token");
  };

  const handleAddTask = async (taskData) => {
    try {
      // Map frontend task data to backend format
      const backendTaskData = {
        title: taskData.title,
        description: taskData.description || "",
        status: taskData.completed ? "completed" : "pending",
      };

      const newTask = await taskAPI.createTask(backendTaskData);

      // Convert backend task to frontend format
      const frontendTask = {
        ...newTask,
        completed: newTask.status === "completed",
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate || null,
        tags: taskData.tags || [],
      };

      setTasks((prevTasks) => [frontendTask, ...prevTasks]);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      // Map frontend task data to backend format
      const backendTaskData = {
        title: taskData.title,
        description: taskData.description || "",
        status: taskData.completed ? "completed" : "pending",
      };

      await taskAPI.updateTask(taskId, backendTaskData);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...taskData } : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const newStatus = !task.completed;
      const backendTaskData = {
        title: task.title,
        description: task.description || "",
        status: newStatus ? "completed" : "pending",
      };

      await taskAPI.updateTask(taskId, backendTaskData);

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, completed: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      if (editingTask && editingTask.id === taskId) {
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // filter by completion status
    switch (currentFilter) {
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "pending":
        filtered = filtered.filter((task) => !task.completed);
        break;
      default:
        break;
    }

    // filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search) ||
          task.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((task) =>
        task.tags.some(
          (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    // sort by priority and due date
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 1;
      const bPriority = priorityOrder[b.priority] || 1;

      if (aPriority !== bPriority) {
        return bPriority - aPriority; // priority ranking
      }

      // if same priority, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return 0;
    });
  };

  const getAllCategories = () => {
    const allTags = tasks.flatMap((task) => task.tags || []);
    return [...new Set(allTags)].sort();
  };

  // calculate task counts for filter tabs
  const getTaskCounts = () => {
    return {
      all: tasks.length,
      pending: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    };
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setStoredData("darkMode", newDarkMode);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const filteredTasks = getFilteredTasks();
  const taskCounts = getTaskCounts();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Task Tracker</h1>
          <div className="header-controls">
            <button
              onClick={handleDarkModeToggle}
              style={{
                background: "none",
                border: "none",
                color: isDarkMode ? "#ffd700" : "#fff",
                fontSize: 0,
                cursor: "pointer",
                marginRight: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                padding: 0,
              }}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <FiSun
                  size={24}
                  style={{
                    display: "block",
                    margin: 0,
                    verticalAlign: "middle",
                  }}
                />
              ) : (
                <FiMoon
                  size={24}
                  style={{
                    display: "block",
                    margin: 0,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="settings-button"
              title="Settings"
              style={{
                background: "none",
                border: "none",
                fontSize: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                padding: 0,
                marginRight: 8,
                color: isDarkMode ? "#fff" : PRIMARY_COLOR,
              }}
            >
              <FiSettings
                size={22}
                style={{ display: "block", margin: 0, verticalAlign: "middle" }}
              />
            </button>
            <div
              className="user-info"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ marginRight: 8 }}>Welcome, {user}!</span>
              <button
                onClick={handleLogout}
                className="logout-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 0,
                  background: "none",
                  border: "none",
                  color: isDarkMode ? "#fff" : PRIMARY_COLOR,
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                <FiLogOut
                  size={20}
                  style={{
                    verticalAlign: "middle",
                    marginRight: 4,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 16, verticalAlign: "middle" }}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="settings-modal">
          <div>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontSize: 18,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: 16 }}>Settings</h2>
            <Settings tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="container">
          <TaskForm
            onAddTask={handleAddTask}
            editingTask={editingTask}
            onUpdateTask={handleUpdateTask}
            onCancelEdit={handleCancelEdit}
          />

          <div className="search-and-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span
                className="search-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <FiSearch
                  size={18}
                  style={{
                    verticalAlign: "middle",
                    marginRight: 0,
                    display: "block",
                  }}
                />
              </span>
            </div>

            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="all">All Categories</option>
                {getAllCategories().map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tasks-section">
            <TaskFilter
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              taskCounts={taskCounts}
              categories={getAllCategories()}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              currentFilter={currentFilter}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
