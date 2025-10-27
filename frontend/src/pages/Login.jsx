import { useNavigate } from "react-router-dom";
import "./Login.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    alert("로그인 성공! (임시)");
    navigate("/restore");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Re:Memory 로그인</h2>
        <p className="subtext">당신의 기억을 다시 불러올 준비가 되었나요?</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="이메일 주소" required />
          <input type="password" placeholder="비밀번호" required />
          <button type="submit">로그인</button>
        </form>
        <p className="register">
          계정이 없으신가요? <span>회원가입</span>
        </p>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Login;
