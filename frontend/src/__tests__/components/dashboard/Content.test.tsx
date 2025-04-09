import { act, render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { useRouter } from "next/navigation";
import mockTransData from "../../../__mocks__/mockData.json";
import Content from "../../../components/dashboard/Content";

// jest.mock('swiper/react', () => ({
//   Swiper : ({ children }: { children: React.ReactNode }) => {
//     return <div data-testid="mock-swiper">{children}</div>;
//   }
//   ,
//   SwiperSlide : ({ children }: { children: React.ReactNode }) => (
//     <div data-testid="mock-swiper-slide">{children}</div>
//   )
// }));

// Mocking useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mocking useRouter
jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
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
  AddFundsModal: jest.fn(() => <div data-testid="add-funds-modal"></div>),
  TransferModal: jest.fn(() => <div data-testid="transfer-modal"></div>),
}));

describe("Wallet", () => {
  const transData = Array.isArray(mockTransData) ? mockTransData : [];

  it("renders content component", () => {
    render(
      <Content data={{ transactions: transData, sectionName: "wallet" }} ></Content>
    );
    // Ensure it returns an array of elements
    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.getByText("Actual Balance")).toBeInTheDocument();
    expect(screen.getByText("Pending Amount")).toBeInTheDocument();
    expect(screen.getByText("Transaction History")).toBeInTheDocument();

    // expect(screen.getAllByTestId("mock-swiper")).toBeInstanceOf(Array);
    // expect(screen.getAllByTestId("mock-swiper").length).toBeGreaterThan(
    //   0
    // );
    // expect(screen.getAllByTestId("mock-swiper-slide").length).toBeGreaterThan(
    //   0
    // );
  });

  it("opens add funds modal when 'Add Funds' button is clickes", () => {
    render(
      <Content data={{ transactions: transData, sectionName: "wallet" }} />
    );

    const openAddFundsButton = screen.getByTestId("toggle-add-funds");

    act(() => {
      fireEvent.click(openAddFundsButton);
    });

    //expect add funds modal to appear
    expect(screen.getByText("Payment Option")).toBeInTheDocument();
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
    expect(screen.getByText("Add Payment Method")).toBeInTheDocument();

    const progressButton = screen.getByText("Continue");
    expect(progressButton).toBeInTheDocument();
  });

  it("slided to new modal for payment", async () => {
    jest.useFakeTimers(); // For timing animations, if needed

    render(
      <Content data={{ transactions: transData, sectionName: "wallet" }} />
    );

      // Assert initial slide
      expect(screen.getByTestId("slide-index")).toHaveTextContent(
        "Current slide: 0"
      );
  
      // Simulate swipe manually (since Swiper uses transforms, we simulate change)
      // Access Swiper instance and force slide change
      const swiperEl = document.querySelector(".swiper") as any;
      const swiperInstance = swiperEl?.swiper;
  
      act(() => {
        swiperInstance.slideTo(1); // Go to slide 2
      });
  
      // Let swiper finish animation
      act(() => {
        jest.runAllTimers();
      });

  
      expect(await screen.findByTestId("slide-index")).toHaveTextContent(
        "Current slide: 1"
      );
  });
});
