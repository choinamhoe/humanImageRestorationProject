import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("로그인 시도 중...");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login to Re:Memory</h1>
      <p className="login-subtext">Restore what matters most.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email address" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}
