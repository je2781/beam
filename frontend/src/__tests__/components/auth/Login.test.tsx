import { act, render, waitFor } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import Login from "../../../components/auth/Login";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import toast from "react-hot-toast";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mocking toast notifications
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../../components/auth/Intro", () => () => (
  <div>Intro Component</div>
)); // Adjust path if necessary

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
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
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

  it("shows and hides password when clicking SHOW icon", async () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText(/Password/i);
    const showIcon = screen.getByRole("menuitem", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    act(() => {
      fireEvent.click(showIcon);
    });
    expect(passwordInput).toHaveAttribute("type", "text");

    act(() => {
      fireEvent.click(showIcon);
    });
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits form and redirects on successful login", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { message: "success" },
    });

    render(<Login />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "alice@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "supersecure" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Log in/i }));
    });

    waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/wallet");
    });
  });

  it("shows error toast if login fails", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Credentials invalid"));

    render(<Login />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "alice@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "supersecure" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Log in/i }));
    });

    waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Credentials invalid");
    });
  });
});
