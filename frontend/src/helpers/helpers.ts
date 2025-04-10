import localFont from "next/font/local";
import { SwiperRef } from "swiper/react";

export const dashboardItems = [
  {
    Main: [
      { Overview: "fa-square-poll-vertical" },
      { Customers: "fa-users" },
      { "Spot Orders": "fa-signal" },
      { "Margin Orders": "fa-chart-line" },
      { Transactions: "fa-arrow-right-arrow-left" },
      { Wallet: "fa-arrow-right-arrow-left" },
    ],
  },
  {
    Others: [
      { Notification: "fa-bell" },
      { Settings: "fa-gear" },
      { Logout: "fa-right-from-bracket" },
      { Help: "fa-circle-info" },
    ],
  },
];

export const avenirNextLTPro = localFont({
  src: [
    {
      path: "../../public/fonts/AvenirNext-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/AvenirNextLTPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AvenirNext-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/AvenirNextLTPro-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/AvenirNextLTPro-It.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-avenir-next",
  display: "swap",
});

export const sfCompactText = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Compact-Display-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sf-compact",
  display: "swap",
});

const issuerPatterns = {
  Visa: /^4[0-9]{6,}$/, // Visa cards start with 4
  MasterCard: /^(5[1-5][0-9]{4}|222[1-9][0-9]{3}|22[3-9][0-9]{3}|2[3-6][0-9]{3}|27[0-1][0-9]{2}|2720[0-9]{2})[0-9]{1,}$/i, // MasterCard cards start with 51-55 or 2221-2720
  AmericanExpress: /^3[47][0-9]{5,}$/, // American Express cards start with 34 or 37
  Discover: /^6(?:011|5[0-9]{2})[0-9]{3,}$/, // Discover cards start with 6011 or 65
};

export const detectIssuer = (number) => {
  for (const [key, pattern] of Object.entries(issuerPatterns)) {
    if (pattern.test(number)) {
      return key;
    }
  }
  return "Unknown";
};

export  const goToSlide = (index: number, swiperRef: React.RefObject<SwiperRef | null>, setActiveIndex: React.Dispatch<React.SetStateAction<number>>) => {
  if (swiperRef.current) {
    swiperRef.current.swiper.slideTo(index); // jump to a specific slide
    setActiveIndex(index)
  }
}
