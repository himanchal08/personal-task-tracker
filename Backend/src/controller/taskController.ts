import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth";

// Get all tasks for the logged-in user
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, status } = req.body;

    // Enhanced validation
    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ message: "Title is required and must be a string" });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    if (title.length > 200) {
      return res
        .status(400)
        .json({ message: "Title must be less than 200 characters" });
    }

    if (description && typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }

    if (description && description.length > 1000) {
      return res
        .status(400)
        .json({ message: "Description must be less than 1000 characters" });
    }

    if (status && !["pending", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be either 'pending' or 'completed'" });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "pending",
        userId,
      },
    });
    res.status(201).json({ task, message: "Task created successfully" });
  } catch (err: any) {
    console.error("Create task error:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message || "Unknown error" });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { title, description, status } = req.body;

    // Validate ID
    if (isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Enhanced validation
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return res
          .status(400)
          .json({ message: "Title must be a non-empty string" });
      }
      if (title.length > 200) {
        return res
          .status(400)
          .json({ message: "Title must be less than 200 characters" });
      }
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== "string") {
        return res
          .status(400)
          .json({ message: "Description must be a string" });
      }
      if (description.length > 1000) {
        return res
          .status(400)
          .json({ message: "Description must be less than 1000 characters" });
      }
    }

    if (status !== undefined && !["pending", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be either 'pending' or 'completed'" });
    }

    const existing = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (existing.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json({ task: updated, message: "Task updated successfully" });
  } catch (err: any) {
    console.error("Update task error:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message || "Unknown error" });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    // Validate ID
    if (isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const existing = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (existing.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    console.error("Delete task error:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message || "Unknown error" });
  }
};
