// src/layout/MainLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css"; // ✅ CSS 추가

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
