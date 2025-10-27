import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Restore from "./pages/Restore";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restore" element={<Restore />} />{" "}
        {/* ✅ 복원 페이지 연결 */}
      </Routes>
    </Router>
  );
}

export default App;
