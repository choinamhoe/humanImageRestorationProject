import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  // 회원가입 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = { email, password };

    // 기존 유저 목록 불러오기
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // 이미 존재하는 이메일 검사
    const userExists = storedUsers.some((user) => user.email === email);

    if (userExists) {
      alert("이미 존재하는 이메일입니다 ❌");
      return;
    }

    // 새 유저 추가 및 저장
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("회원가입 완료 🎉 자동으로 로그인됩니다.");

    // ✅ 자동 로그인 상태 저장
    localStorage.setItem("userToken", "true");
    localStorage.setItem("userEmail", email);

    navigate("/restore");
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create Your Re:Memory Account</h1>
      <p className="signup-subtext">
        Preserve your moments with AI restoration.
      </p>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      <p className="login-link">
        이미 계정이 있으신가요?{" "}
        <span onClick={() => navigate("/login")}>로그인</span>
      </p>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}
