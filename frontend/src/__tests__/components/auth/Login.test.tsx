import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import Login from "../../../components/auth/Login";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mocking toast notifications
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("Login", () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it("renders the login form", () => {
    render(<Login />);

    expect(screen.getByText("Welcome!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("FORGOT PASSWORD?")).toBeInTheDocument();
    expect(screen.getByText("LOG IN")).toBeDisabled();
  });

  it("enables login button when both fields are filled correctly", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("LOG IN");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(loginButton).not.toBeDisabled();
  });

  it("displays a success toast and redirects on login", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("LOG IN");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    fireEvent.click(loginButton);

    expect(toast.success).toHaveBeenCalledWith("Login successful!", {duration: 2000});
    expect(mockRouterPush).toHaveBeenCalledWith("/users");
  });

  it("shows and hides password when clicking SHOW button", async () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Password");
    const showButton = screen.getByText("SHOW");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(showButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(showButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
