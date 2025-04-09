import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import mockUserData from "../../../__mocks__/mockData.json";

import UserDetails from "../../../components/dashboard/UserDetails";

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the modal
jest.mock("../../../components/layout/Modal", () => ({
    MobileModal: jest.fn(),
  }));

describe("User details", () => {
  let mockRouterPush: jest.Mock;
  let mockRouterReplace: jest.Mock;
  const mockId = 'LSQFf587g90';

  beforeEach(() => {
    mockRouterPush = jest.fn();
    mockRouterReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush, replace: mockRouterReplace });
  });

  it("renders details component", () => {
    render(<UserDetails userData={mockUserData} id={mockId}/>);

    expect(screen.getByText("BLACKLIST USER")).toBeInTheDocument();
    expect(screen.getByText("ACTIVATE USER")).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Education and Employment")).toBeInTheDocument();
    expect(screen.getByText("Socials")).toBeInTheDocument();
    expect(screen.getByText("Guarantor")).toBeInTheDocument();
  });

  it("goes back to users page when back button is pressed", () => {
    render(<UserDetails userData={mockUserData} id={mockId}/>);

    const backButton = screen.getByTestId("go-back");

    fireEvent.click(backButton);

    expect(mockRouterReplace).toHaveBeenCalledWith("/users");
  });

});
