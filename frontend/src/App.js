import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import React from "react";
//import Home from "./pages/Home";
// 페이지 컴포넌트 임포트
import Login from "./pages/Login";
// ✅ 레이아웃 및 하위 페이지 임포트
import MainLayout from "./layouts/MainLayout";
import GrayscaleToColor from "./components/GrayscaleToColor";
import Restore from "./pages/Restore";
import Signup from "./pages/Signup";

// ✅ 새로고침 시 항상 홈("/")으로 리디렉션하는 컴포넌트
function RedirectOnReload() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload =
      navEntry?.type === "reload" ||
      (performance.navigation && performance.navigation.type === 1);

    if (isReload && pathname !== "/") {
      // ✅ 약간의 지연을 줘서 React Router가 준비될 때까지 대기
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
        {/* 로그인 페이지 (Sidebar 없음) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restore" element={<Restore />} />
        {/* 2. 사이드바가 있는 공통 레이아웃 페이지 
           - path="/" : <MainLayout />을 렌더링합니다.
           - 이 <Route> 안에 자식 라우트들을 중첩시킵니다.
        */}
        {/* ✅ MainLayout 내부에서 Sidebar + 콘텐츠 렌더링 */}
        <Route path="/" element={<MainLayout />}>
          {/* ✅ index route (path="/")
          부모 경로('/')와 일치할 때 기본으로 보여줄 자식 컴포넌트입니다.
          요청하신 "최초 화면은 흑백->컬러" 기능이 구현됩니다.
        */}
          <Route path="/" element={<Navigate to="/colorize" replace />} />
          <Route path="/colorize" element={<GrayscaleToColor />} />
          {/* ✅ 자식 경로 (path="/restore")
          <MainLayout /> 안의 <Outlet /> 위치에 <Restore /> 컴포넌트가 나옵니다.
        */}
          <Route path="/restore" element={<Restore />} />
          {/* ✅ 복원 페이지 연결 */}
        </Route>
      </Routes>
    </>
  );
}
