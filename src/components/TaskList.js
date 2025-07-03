import TaskItem from "./TaskItem"

const TaskList = ({ tasks, onToggleComplete, onDeleteTask, onEditTask, currentFilter }) => {
  if (tasks.length === 0) {
    const emptyMessages = {
      all: "No tasks yet. Add your first task above!",
      pending: "No pending tasks. Great job!",
      completed: "No completed tasks yet. Keep working!",
    }

    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p>{emptyMessages[currentFilter]}</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  )
}

export default TaskList
