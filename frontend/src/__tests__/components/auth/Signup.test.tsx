import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../../../components/auth/Signup"; // This is still the actual component file
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));
jest.mock("next/link", () => ({ children }) => children);
jest.mock("next/image", () => (props) => <img {...props} alt={props.alt} />);
jest.mock("../../../components/auth/Intro", () => () => (
  <div>Intro Component</div>
)); // Adjust path if necessary

describe("Signup Component", () => {
  const mockRouterPush: jest.Mock = jest.fn();

  beforeEach(() => {
    (mockRouterPush as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it("renders signup form fields correctly", () => {
    render(<Signup />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });

  it("disables register button initially", () => {
    render(<Signup />);
    expect(screen.getByRole("button", { name: /Register/i })).toBeDisabled();
  });

  it("shows and hides password when clicking SHOW icon", async () => {
    render(<Signup />);
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

  it("enables register button when valid input is provided", async () => {
    render(<Signup />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Alice Wonderland" },
      });
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "alice@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "supersecure" },
      });
    });

    expect(
      screen.getByRole("button", { name: /Register/i })
    ).not.toBeDisabled();
  });

  it("submits form and redirects on successful signup", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { full_name: "Alice Wonderland" },
    });

    render(<Signup />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Alice Wonderland" },
      });
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "alice@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "supersecure" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    });

    waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/login");
    });
  });
  

  it("shows error toast if signup fails", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Email already in use"));

    render(<Signup />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Alice Wonderland" },
      });
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "alice@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "supersecure" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    });

    waitFor(() => {

      expect(toast.error).toHaveBeenCalledWith("Email aleady in use");
    });
  });
});
