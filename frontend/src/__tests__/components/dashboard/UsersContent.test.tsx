import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import mockUserData from "../../../__mocks__/mockData.json";
import UsersContent from "../../../components/dashboard/Content";

const mockId = "LSQFf587g90";

jest.mock('swiper/react', () => ({
  Swiper : ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="mock-swiper">{children}</div>;
  }
  ,
  SwiperSlide : ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-swiper-slide">{children}</div>
  )
}));

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockRouterPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

// Mocking useWindow
jest.mock("@/helpers/getWindowWidth", () => ({
  __esModule: true,
  default: () => ({
    windowWidth: 3,
    setWindowWidth: jest.fn(),
  }),
}));

// Mock the modal
jest.mock("../../../components/layout/Modal", () => ({
  FilterModal: jest.fn(() => <div data-testid="filter-modal"></div>),
  OptionsModal: jest.fn(() => <div data-testid="options-modal">
    <button onClick={() => mockRouterPush(`/users/${mockId}`)}>
      <h4>View Details</h4>
    </button>
  </div>),
}));

describe("Users Content", () => {
  const userData = Array.isArray(mockUserData) ? mockUserData : [];

  it("renders users content component", () => {
    render(<UsersContent data={{ userData, sectionName: "users" }} />);
    // Ensure it returns an array of elements
    expect(screen.getAllByText("ACTIVE USERS")).toBeInstanceOf(Array);
    expect(screen.getAllByText("USERS WITH LOANS")).toBeInstanceOf(Array);
    expect(screen.getAllByText("USERS WITH SAVINGS")).toBeInstanceOf(Array);
    expect(screen.getAllByTestId("filter-users")).toBeInstanceOf(Array);

    // Ensure at least one element is found
    expect(screen.getAllByText("ACTIVE USERS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("USERS WITH LOANS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("USERS WITH SAVINGS").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("filter-users").length).toBeGreaterThan(0);

    expect(screen.getByTestId('mock-swiper')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-swiper-slide').length).toBeGreaterThan(0);
  });

  it("navigates to user details page when view details on options modal is clicked", () => {
    render(<UsersContent data={{ userData, sectionName: "users" }} />);

    const openOptionsIcons = screen.getAllByTestId("open-options");

    //becuse mock user data only has one user and responsive design of users article
    //results in duplication of parts of the article
    expect(openOptionsIcons.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(openOptionsIcons[0]);

    //expect options modal to appear
    const optionsModal = screen.getByText(/view details/i);
    expect(optionsModal).toBeInTheDocument();

    const viewDetailsItem = optionsModal.closest("button");
    //now click on the vew details item
    fireEvent.click(viewDetailsItem!);

    expect(mockRouterPush).toHaveBeenCalledWith(`/users/${mockId}`);
  });

  it("opens filter modal when filter icon is clicked", () => {
    render(<UsersContent data={{ userData, sectionName: "users" }} />);

    //find and fire click event on filter icons
    const filterUsersIcons = screen.getAllByTestId("filter-users");

    expect(filterUsersIcons.length).toBeGreaterThan(6);

    fireEvent.click(filterUsersIcons[0]);

    //expect filter modal to appear
    expect(screen.getByTestId("filter-modal")).toBeInTheDocument();
  });
});
