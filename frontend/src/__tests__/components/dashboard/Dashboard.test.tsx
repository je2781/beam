import { render } from "@testing-library/react";
import { screen} from "@testing-library/dom";
import { usePathname } from "next/navigation";
import mockData from '../../../__mocks__/mockData.json';
import Dashboard from "../../../components/dashboard/Dashboard";

// Mock the pathName
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock the header
jest.mock("../../../components/layout/header/Header", () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>;
  };
});

// Mock the sidebar
jest.mock("../../../components/layout/Sidebar", () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar Component</div>;
  };
});
// Mock the users content
jest.mock("../../../components/dashboard/Content", () => {
  return function MockContentComponent() {
    return <div data-testid="wallet-page">Content Component</div>;
  };
});



describe("Dashbaord", () => {

  it("renders the wallet page when path is 'wallet'", () => {
    (usePathname as jest.Mock).mockReturnValue("/wallet");

    render(<Dashboard transactions={mockData} balance={200} bank={{
      card_expiry_date: '2/5/2028',
      card_no: '78490220300',
      cvv: '123',
      acct_no: '74829011'
    }}/>);

    //checking if users page component is rendered on dashboard
    expect(screen.getByTestId("wallet-page")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

});
