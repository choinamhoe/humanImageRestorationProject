// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; // ✅ CSS 추가

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Image Lab</h2>

      {/* ✅ 흑백 → 컬러 변환 */}
      <NavLink
        to="/main/colorize"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        흑백 → 컬러 변환
      </NavLink>

      {/* ✅ 사진 복원 */}
      <NavLink
        to="/main/restore"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        사진 복원
      </NavLink>
    </div>
  );
};

export default Sidebar;
