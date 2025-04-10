import { act, render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/layout/Sidebar";
import axios from 'axios';


// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios'); // Mocking axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Sidebar", () => {
  const mockRouterPush = jest.fn();
  const mockRouterReplace = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      replace: mockRouterReplace,
    });

    // Reset any mocked Axios or other API mocks
    mockedAxios.post.mockResolvedValue({
      data: { message: 'logout successful' },
    });
  });

  it("renders the Sidebar list", () => {
    render(
      <Sidebar activeSection="customers" onHide={jest.fn()} hide={false} />
    );

    expect(screen.getByText("BEAM")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Spot Orders")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("navigates to route of clicked item", async () => {
    render(
      <Sidebar activeSection="customers" onHide={jest.fn()} hide={false} />
    );
    //retrieves list item with h4 text 'Users'
    const sidebarListItem = screen.getByText(/wallet/i).closest("li");

    fireEvent.click(sidebarListItem!);

    expect(mockRouterPush).toHaveBeenCalledWith("/wallet");

    expect(sidebarListItem).toBeInTheDocument();
  });

  it("navigates to login when the logout button is clicked", async () => {
    render(<Sidebar activeSection="wallet" onHide={jest.fn()} hide={false} />);
    //retrieves list item with h4 text 'Users'
    const logout = screen.getByText(/logout/i).closest("li");

    fireEvent.click(logout!);
    //simulatin asycnronous operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(mockRouterReplace).toHaveBeenCalledWith("/login");

  });
});
