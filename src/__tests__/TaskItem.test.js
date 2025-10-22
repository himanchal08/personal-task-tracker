import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "../components/TaskItem";

describe("TaskItem Component", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    completed: false,
    priority: "high",
    dueDate: new Date("2025-12-31").toISOString(),
    tags: ["work", "urgent"],
    createdAt: new Date("2025-01-01").toISOString(),
  };

  const mockOnToggleComplete = jest.fn();
  const mockOnDeleteTask = jest.fn();
  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task information correctly", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDeleteTask={mockOnDeleteTask}
        onEditTask={mockOnEditTask}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("displays completed status correctly", () => {
    const completedTask = { ...mockTask, completed: true };

    const { container } = render(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onDeleteTask={mockOnDeleteTask}
        onEditTask={mockOnEditTask}
      />
    );

    const taskItem = container.querySelector(".task-item");
    expect(taskItem).toHaveClass("completed");
  });

  it("calls onToggleComplete when checkbox is clicked", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDeleteTask={mockOnDeleteTask}
        onEditTask={mockOnEditTask}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it("calls onEditTask when edit button is clicked", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDeleteTask={mockOnDeleteTask}
        onEditTask={mockOnEditTask}
      />
    );

    const editButton = screen.getByTitle("Edit task");
    fireEvent.click(editButton);

    expect(mockOnEditTask).toHaveBeenCalledWith(mockTask);
  });

  it("shows delete confirmation and calls onDeleteTask", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDeleteTask={mockOnDeleteTask}
        onEditTask={mockOnEditTask}
      />
    );

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    // Check if confirmation appears
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);

    expect(mockOnDeleteTask).toHaveBeenCalledWith(mockTask.id);
  });
});
