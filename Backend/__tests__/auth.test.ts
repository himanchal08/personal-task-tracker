import request from "supertest";
import app from "../src/index";

describe("Auth Endpoints", () => {
  const testUser = {
    username: `testuser${Date.now()}`,
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("username", testUser.username);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should fail to register with existing username", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should fail to register without username", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should fail to register without password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "testuser" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should fail to register with short username", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "ab", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("at least 3 characters");
    });

    it("should fail to register with short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "newuser123", password: "12345" });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("at least 6 characters");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login existing user successfully", async () => {
      const res = await request(app).post("/api/auth/login").send(testUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(typeof res.body.token).toBe("string");
    });

    it("should fail to login with incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: testUser.username, password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Invalid username or password"
      );
    });

    it("should fail to login with non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "nonexistentuser", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Invalid username or password"
      );
    });

    it("should fail to login without username", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should fail to login without password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testuser" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });
});
