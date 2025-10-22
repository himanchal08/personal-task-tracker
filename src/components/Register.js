"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../utils/validationSchemas";
import { authAPI } from "../services/api";

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      await authAPI.register(data.username.trim(), data.password);
      // Registration successful
      alert("Registration successful! Please login.");
      onSwitchToLogin();
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account</h1>
        <p>Register to start managing your tasks.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              {...register("username")}
              className="login-input"
              autoFocus
              disabled={loading}
            />
            {errors.username && (
              <div className="error-message">{errors.username.message}</div>
            )}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="login-input"
              disabled={loading}
            />
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="login-input"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <div className="error-message">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-color)",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "1rem",
              }}
              disabled={loading}
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
