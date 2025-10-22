import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../components/Login";

// Mock the API module
jest.mock("../services/api", () => ({
  authAPI: {
    login: jest.fn(),
  },
}));

describe("Login Component", () => {
  const mockOnLogin = jest.fn();
  const mockOnSwitchToRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(
      <Login
        onLogin={mockOnLogin}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    expect(screen.getByText("Personal Task Tracker")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays validation error for empty username", async () => {
    render(
      <Login
        onLogin={mockOnLogin}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  it("displays validation error for short username", async () => {
    render(
      <Login
        onLogin={mockOnLogin}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(usernameInput, { target: { value: "ab" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it("displays validation error for short password", async () => {
    render(
      <Login
        onLogin={mockOnLogin}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("shows register link", () => {
    render(
      <Login
        onLogin={mockOnLogin}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );

    const registerLink = screen.getByText("Register here");
    expect(registerLink).toBeInTheDocument();

    fireEvent.click(registerLink);
    expect(mockOnSwitchToRegister).toHaveBeenCalled();
  });
});
