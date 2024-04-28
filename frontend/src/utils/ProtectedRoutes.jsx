import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Check "index.css" for layout styling.

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? (
    <div className="app-bg">
      <Header />
      <div className="spacer"></div>
      <main className="main-container">
        <Sidebar />
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
