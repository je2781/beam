import { render} from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/layout/Sidebar";

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));


describe("Sidebar", () => {
  const mockRouterPush  = jest.fn();
  const mockRouterReplace  = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush, replace: mockRouterReplace });
  });

  it("renders the Sidebar list", () => {
    render(<Sidebar activeSection="customers"/>);

    expect(screen.getByText("Switch Organization")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("CUSTOMERS")).toBeInTheDocument();
    expect(screen.getByText("BUSINESSES")).toBeInTheDocument();
    expect(screen.getByText("SETTINGS")).toBeInTheDocument();;
  });


  it("navigates to route of clicked item", async () => {
    render(<Sidebar activeSection="customers"/>);
       //retrieves list item with h4 text 'Users'
        const usersItem = screen.getByText(/users/i).closest('li');

        fireEvent.click(usersItem!);
    
        expect(mockRouterPush).toHaveBeenCalledWith("/users");
    
        expect(usersItem).toBeInTheDocument(); 

  });

  it("navigates to login route when logout button is clicked", async () => {
    render(<Sidebar activeSection="customers"/>);
       //retrieves list item with h4 text 'Logout'
        const logout = screen.getByText(/logout/i).closest('li');

        fireEvent.click(logout!);
    
        expect(logout).toBeInTheDocument(); 
        expect(mockRouterReplace).toHaveBeenCalledWith("/login");
    

  });
});
