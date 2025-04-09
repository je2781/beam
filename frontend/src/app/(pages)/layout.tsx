"use client";

import { AuthContextProvider } from "@/store/authContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authStatus, setAuthStatus] = useState(true);

  return (
    <AuthContextProvider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContextProvider>
  );
}
