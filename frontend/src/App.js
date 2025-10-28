import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import GrayscaleToColor from "./components/GrayscaleToColor";
import Restore from "./pages/Restore";

// 🔹 새로고침 시 홈으로 리디렉션
function RedirectOnReload() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload =
      navEntry?.type === "reload" ||
      (performance.navigation && performance.navigation.type === 1);

    if (isReload && pathname !== "/") {
      setTimeout(() => navigate("/", { replace: true }), 100);
    }
  }, [navigate, pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <RedirectOnReload />
      <Routes>
        {/* 홈, 로그인, 회원가입 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ MainLayout 내부 페이지 */}
        <Route path="/main" element={<MainLayout />}>
          <Route path="colorize" element={<GrayscaleToColor />} />
          <Route path="restore" element={<Restore />} />
        </Route>

        {/* 존재하지 않는 경로는 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
