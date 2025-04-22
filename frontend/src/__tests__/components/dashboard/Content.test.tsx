import { act, render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import mockTransData from "../../../__mocks__/mockData.json";
import Content from "../../../components/dashboard/Content";
import React from "react";

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => {
    // Mock the Swiper component
    return <div data-testid="mock-swiper">{children}</div>;
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-swiper-slide">
      {children} <button>Continue</button>
    </div>
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
  const trans = Array.isArray(mockTransData) ? mockTransData : [];
  const transData = {
    currentPage: 1,
    hasPreviousPage: false,
    hasNextPage: trans.length > 10,
    lastPage: Math.ceil(trans.length / 10),
    nextPage: 2,
    previousPage: 0,
    isActivePage: 1,
  };

  it("renders content component", () => {
    render(
      <Content
        data={{ ...transData, transactions: trans }}
        sectionName={"wallet"}
        walletBalance={200}
        bank={{
          card_expiry_date: "2/5/2028",
          card_no: "78490220300",
          cvv: "123",
          acct_no: "74829011",
        }}
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
      <Content
        data={{ ...transData, transactions: trans }}
        sectionName={"wallet"}
        walletBalance={200}
        bank={{
          card_expiry_date: "2/5/2028",
          card_no: "78490220300",
          cvv: "123",
          acct_no: "74829011",
        }}
      />
    );

    const openAddFundsButton = screen.getByTestId("toggle-add-funds");

    act(() => {
      fireEvent.click(openAddFundsButton);
    });

    //expect add funds modal to appear
    const mockSlider = screen.getByTestId("mock-swiper");
    const fundsModal = screen.getByTestId("add-funds-modal");
    expect(mockSlider).toBeInTheDocument();
    expect(fundsModal).toBeInTheDocument();

    // expect(goToSlide).toHaveBeenCalled();
  });
});
