import { act, render } from "@testing-library/react";
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

    expect(screen.getByText("Sign in to Beam")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeDisabled();
  });

  it("enables login button when both fields are filled correctly", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("margarettissbroker@");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Log in");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(loginButton).not.toBeDisabled();
  });


  it("shows and hides password when clicking SHOW button", async () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Password");
    const showButton = screen.getByRole('menuitem', { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(showButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(showButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
