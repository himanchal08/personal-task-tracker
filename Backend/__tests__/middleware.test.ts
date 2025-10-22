import request from "supertest";
import app from "../src/index";
import jwt from "jsonwebtoken";

describe("Authentication Middleware", () => {
  let validToken: string;
  const JWT_SECRET = process.env.JWT_SECRET as string;

  beforeAll(async () => {
    // Create a test user and get a valid token
    const testUser = {
      username: `middlewaretest${Date.now()}`,
      password: "password123",
    };

    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send(testUser);
    validToken = res.body.token;
  });

  describe("Protected Routes", () => {
    it("should allow access with valid token", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).not.toBe(401);
      expect(res.status).not.toBe(403);
    });

    it("should reject request without authorization header", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Authorization header missing"
      );
    });

    it("should reject request with missing token", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer ");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Token missing");
    });

    it("should reject request with invalid token format", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", "InvalidFormat invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Invalid or expired token");
    });

    it("should reject request with expired token", async () => {
      // Create an expired token
      const expiredToken = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: "0s" });

      // Wait a moment to ensure token is expired
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Invalid or expired token");
    });

    it("should reject request with invalid signature", async () => {
      const invalidToken = jwt.sign({ id: 1 }, "wrong-secret", {
        expiresIn: "1h",
      });

      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Invalid or expired token");
    });

    it("should reject request with malformed token", async () => {
      const res = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer not.a.valid.jwt");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Invalid or expired token");
    });
  });

  describe("Authorization", () => {
    it("should prevent user from accessing other user's tasks", async () => {
      // Create first user and task
      const user1 = {
        username: `user1${Date.now()}`,
        password: "password123",
      };
      await request(app).post("/api/auth/register").send(user1);
      const user1Login = await request(app).post("/api/auth/login").send(user1);
      const user1Token = user1Login.body.token;

      const taskRes = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ title: "User 1 Task" });
      const taskId = taskRes.body.task.id;

      // Create second user
      const user2 = {
        username: `user2${Date.now()}`,
        password: "password123",
      };
      await request(app).post("/api/auth/register").send(user2);
      const user2Login = await request(app).post("/api/auth/login").send(user2);
      const user2Token = user2Login.body.token;

      // Try to update user1's task with user2's token
      const updateRes = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ title: "Hacked Task" });

      expect(updateRes.status).toBe(403);
      expect(updateRes.body).toHaveProperty(
        "message",
        "Not authorized to update this task"
      );
    });
  });
});
