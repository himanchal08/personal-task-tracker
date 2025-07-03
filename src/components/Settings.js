import React, { useState } from "react";
import {
  removeStoredData,
} from "../utils/localStorage";
import { FiTrash2, FiDownload } from "react-icons/fi";

const PRIORITIES = ["high", "medium", "low"];

const Settings = ({ tasks, setTasks }) => {
  const [exportPriority, setExportPriority] = useState("");
  const [dateType, setDateType] = useState("createdAt");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClearTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
      removeStoredData("tasks");
    }
  };

  const handleExport = () => {
    let filteredTasks = tasks;
    if (exportPriority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === exportPriority
      );
    }
    if (startDate) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task[dateType] && new Date(task[dateType]) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task[dateType] && new Date(task[dateType]) <= new Date(endDate)
      );
    }
    const json = JSON.stringify(filteredTasks, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-section">
      <h2>Settings</h2>
      <button onClick={handleClearTasks} style={{ marginBottom: 16 }}>
        <FiTrash2 style={{ verticalAlign: "middle", marginRight: 4 }} /> Clear
        All Tasks
      </button>
      <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
        <h3>Export Tasks</h3>
        <div>
          <label>
            Priority:
            <select
              value={exportPriority}
              onChange={(e) => setExportPriority(e.target.value)}
            >
              <option value="">All</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Date Type:
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
            >
              <option value="createdAt">Created At</option>
              <option value="dueDate">Due Date</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleExport} style={{ marginTop: 12 }}>
          <FiDownload style={{ verticalAlign: "middle", marginRight: 4 }} />{" "}
          Export Filtered Tasks
        </button>
      </div>
    </div>
  );
};

export default Settings;
