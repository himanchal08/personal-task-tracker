import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Enhanced validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Username and password must be strings" });
    }

    if (username.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    if (username.trim().length > 50) {
      return res
        .status(400)
        .json({ message: "Username must be less than 50 characters" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (password.length > 100) {
      return res
        .status(400)
        .json({ message: "Password must be less than 100 characters" });
    }

    const existing = await prisma.user.findUnique({
      where: { username: username.trim() },
    });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username: username.trim(), password: hashed },
      select: { id: true, username: true },
    });

    res.status(201).json({ user, message: "User registered successfully" });
  } catch (err: any) {
    console.error("Registration error:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message || "Unknown error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Enhanced validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid credentials format" });
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, message: "Login successful" });
  } catch (err: any) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message || "Unknown error" });
  }
};
