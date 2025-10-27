import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restore" element={<Restore />} />
      </Routes>
    </>
  );
}
