import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();

  // 이메일 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공 🎉");
      navigate("/restore");
    } catch (error) {
      alert("로그인 실패 😢 " + error.message);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google 로그인 성공 🎉");
      navigate("/restore");
    } catch (error) {
      alert("로그인 실패 😢 " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Re:Memory 로그인</h2>
        <p className="subtext">AI로 당신의 추억을 복원하세요</p>

        {/* 이메일 로그인 */}
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="이메일 주소" required />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            required
          />
          <button type="submit">로그인</button>
        </form>

        {/* 구글 로그인 버튼 */}
        <div className="divider">또는</div>
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src="/images/google-icon.png" alt="Google" />
          Google로 로그인
        </button>

        <p className="register">
          계정이 없으신가요?{" "}
          <span onClick={() => navigate("/signup")}>회원가입</span>
        </p>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Login;
