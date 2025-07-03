"use client"

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: "all", label: "All", count: taskCounts.all },
    { key: "pending", label: "Pending", count: taskCounts.pending },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ]

  return (
    <div className="task-filter">
      {filters.map((filter) => (
        <button
          key={filter.key}
          className={`filter-button ${currentFilter === filter.key ? "active" : ""}`}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  )
}

export default TaskFilter
