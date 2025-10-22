import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import { createTask, deleteTask, getTasks, updateTask } from "../controller/taskController";

const router = Router();

router.get("/", verifyToken, getTasks);
router.post("/", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
