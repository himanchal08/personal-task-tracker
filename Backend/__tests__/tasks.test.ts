import request from "supertest";
import app from "../src/index";

let token: string;
let taskId: number;

beforeAll(async () => {
  const testUser = {
    username: `taskuser${Date.now()}`,
    password: "password123",
  };

  // Register test user
  await request(app).post("/api/auth/register").send(testUser);

  // Login and get JWT token
  const res = await request(app).post("/api/auth/login").send(testUser);
  token = res.body.token;
});

describe("Tasks Endpoints", () => {
  describe("POST /api/tasks", () => {
    it("should create a task successfully", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "Test description",
          status: "pending",
        });

      expect(res.status).toBe(201);
      expect(res.body.task).toHaveProperty("id");
      expect(res.body.task).toHaveProperty("title", "Test Task");
      expect(res.body.task).toHaveProperty("description", "Test description");
      expect(res.body.task).toHaveProperty("status", "pending");
      expect(res.body).toHaveProperty("message", "Task created successfully");
      taskId = res.body.task.id;
    });

    it("should fail to create task without title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Test description" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("Title");
    });

    it("should fail to create task without authorization", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Test Task" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should fail to create task with invalid status", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Test Task", status: "invalid" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Status");
    });
  });

  describe("GET /api/tasks", () => {
    it("should fetch all tasks for authenticated user", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should fail to fetch tasks without authorization", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task successfully", async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Task",
          description: "Updated description",
          status: "completed",
        });

      expect(res.status).toBe(200);
      expect(res.body.task).toHaveProperty("title", "Updated Task");
      expect(res.body.task).toHaveProperty(
        "description",
        "Updated description"
      );
      expect(res.body.task).toHaveProperty("status", "completed");
      expect(res.body).toHaveProperty("message", "Task updated successfully");
    });

    it("should fail to update non-existent task", async () => {
      const res = await request(app)
        .put(`/api/tasks/99999`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Task" });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Task not found");
    });

    it("should fail to update task without authorization", async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: "Updated Task" });

      expect(res.status).toBe(401);
    });

    it("should fail to update task with invalid status", async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "invalid-status" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Status");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task successfully", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Task deleted successfully");
    });

    it("should fail to delete already deleted task", async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Task not found");
    });

    it("should fail to delete task without authorization", async () => {
      const res = await request(app).delete(`/api/tasks/${taskId}`);

      expect(res.status).toBe(401);
    });

    it("should fail to delete task with invalid ID", async () => {
      const res = await request(app)
        .delete(`/api/tasks/invalid`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Invalid task ID");
    });
  });
});
