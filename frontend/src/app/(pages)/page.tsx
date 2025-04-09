"use client";

import Login from "@/components/auth/Login";
import Dashboard from "@/components/dashboard/Dashboard";
import React from "react";

export default function Home() {
  let authStatus = false;

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");
    authStatus = !!JSON.parse(token!);
  }

  if (authStatus) {
    return <Dashboard />;
  } else {
    return <Login />;
  }
}
