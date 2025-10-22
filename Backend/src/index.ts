import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ message: "Task Manager API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(` Server running on http://localhost:${PORT}`)
  );
}
