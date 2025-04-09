import type { Metadata } from "next";
import "./globals.scss";
import {Inter, Poppins} from 'next/font/google';
import { Toaster } from "react-hot-toast";

const inter = Inter({ weight: ["300","400" ,"500", "600", "700", "800"],  display: "swap", subsets: ['latin'] });
const poppins = Poppins({ weight: ["400" ,"500", "600", "700", "800"],  display: "swap", subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Beam",
  description: "Explore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="generator" content="SEOmatic"/>
        <meta name="geo.region" content="Nigeria"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body
        className={`antialiased ${poppins.className} ${inter.className}`}
      > 
          <div id='mobile-modal'></div>
          <div id='transfer-modal' data-testid='transfer-modal'></div>
          <div id='details-modal'></div>
          <div id='add-funds-modal' data-testid='add-funds-modal'></div>
          <div id='backdrop-root'></div>
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}
