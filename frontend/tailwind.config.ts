import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,scss,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          850: "#0C110D",
          800: "#0D0D0C",
          700: "#101828",
          600: "#3E3E39",
          150: "#D5D5D5",
          400: "#595957",
          300: "#6D6D6D",
          200: "#C8CBD9",
          100: "#D9D8D5",
          // 500: "#474D66",
        },
        modal: {
          hr: '#E6E8F0'
        },
        auth: "#474D66",
        link: "#1F3D99",
        secondary: { 400: "#FFDE02" },
        search: {
          bg: "#F5F4F2",
          text: "#1F384C",
          icon: "#627B87",
          notification: "#B0C3CC",
          baloon: "#EC5252",
        },
        track: "#D1D1E0",
        wallet: {
          summary: {
            bg: "#F9F9F7",
            hr: "#C8D9D1",
          },
          history: {
            header: {
              color: "#1F384C",
              secondary: {
                text: '#8C8C89',
                active: '#FBFCFE'
              }
            },
            item: '#3B3A39',
            view: '#3B3A39'
          },
          pagination: {
            active: '#FFC130'
          }
        },
        status: {
          success: '#429777',
          deduct: '#FFB020'
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      keyframes: {
        fadeInLeft: {
          "0%": { opacity: 0, transform: "translateX(-100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        fadeOutLeft: {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(-100%)" },
        },
        fadeInRight: {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        fadeOutRight: {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(100%)" },
        },
        slideUp: {
          'from': { opacity: 1, transform: 'translateY(0)' },
          'to': { opacity: 0, transform: 'translateY(-5rem)' },
        },
        slideDown: {
          'from': { opacity: 0, transform: 'translateY(-5rem)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInLeft: "fadeInLeft 0.3s ease-out forwards",
        fadeOutLeft: "fadeOutLeft 0.3s ease-in forwards",
        fadeInRight: "fadeInRight 0.3s ease-out forwards",
        fadeOutRight: "fadeOutRight 0.3s ease-in forwards",
        slideUp: 'slideUp 0.3s ease-out forwards',
        slideDown: 'slideDown 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;


