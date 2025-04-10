import { act, render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import mockTransData from "../../../__mocks__/mockData.json";
import Content from "../../../components/dashboard/Content";
import React from "react";


jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => {
    // Mock the Swiper component
    return <div data-testid="mock-swiper">
      {children}
      <button>Continue</button>
    </div>
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-swiper-slide">{children}</div>
  ),
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

// Mock the modals
jest.mock("../../../components/layout/Modal", () => ({
  AddFundsModal: jest.fn(() => <div data-testid="add-funds-modal"></div>),
  TransferModal: jest.fn(() => <div data-testid="transfer-modal"></div>),
}));

describe("Wallet", () => {
  const transData = Array.isArray(mockTransData) ? mockTransData : [];

  it("renders content component", () => {
    render(
      <Content
        data={{ transactions: transData, sectionName: "wallet" }}
      ></Content>
    );
    // Ensure it returns an array of elements
    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.getByText("Actual Balance")).toBeInTheDocument();
    expect(screen.getByText("Pending Amount")).toBeInTheDocument();
    expect(screen.getByText("Transaction History")).toBeInTheDocument();
  });

  it("opens add funds modal when 'Add Funds' button is clicked", () => {
    render(
      <Content data={{ transactions: transData, sectionName: "wallet" }} />
    );

    const openAddFundsButton = screen.getByTestId("toggle-add-funds");

    act(() => {
      fireEvent.click(openAddFundsButton);
    });

    //expect add funds modal to appear
    const mockSlider = screen.getByTestId("mock-swiper");
    expect(mockSlider).toBeInTheDocument();

    // expect(goToSlide).toHaveBeenCalled();
  });
});
