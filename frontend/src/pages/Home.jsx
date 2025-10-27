import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.css";

export default function Home() {
  // 🔹 배경 이미지 배열
  const images = [
    `${process.env.PUBLIC_URL}/memory1.jpg`,
    `${process.env.PUBLIC_URL}/memory2.jpg`,
    `${process.env.PUBLIC_URL}/memory3.jpg`,
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // 🔹 자동 이미지 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Begin Restoration 버튼
  const handleStartClick = () => {
    const isLoggedIn = localStorage.getItem("userToken");
    setFadeOut(true);

    setTimeout(() => {
      if (isLoggedIn) {
        // 🔹 로그인되어 있으면 사진 복원 페이지로 이동
        window.location.href = "/main/restore"; // ✅ 수정됨
      } else {
        // 🔹 로그인 안 되어 있으면 로그인 페이지로 이동
        window.location.href = "/login";
      }
    }, 600);
  };

  // ✅ Login 버튼
  const handleLoginClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 300);
  };

  return (
    <motion.div
      className={`home-container ${fadeOut ? "fade-out" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ✅ 배경 이미지 */}
      <div
        className="background-slideshow"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      ></div>
      <div className="overlay"></div>

      {/* ✅ 헤더 */}
      <header className="top-header">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Re:Memory
        </motion.div>

        <motion.button
          className="menu-btn"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLoginClick}
        >
          Login
        </motion.button>
      </header>

      {/* ✅ 메인 콘텐츠 */}
      <main className="center-content">
        <motion.h1
          className="main-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Re:Memory — restoring what time has faded.
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Because your memories deserve clarity.
        </motion.p>

        {/* ✅ Begin Restoration 버튼 */}
        <motion.button
          className="start-btn"
          onClick={handleStartClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "#fff",
            color: "#000",
            boxShadow: "0 0 20px rgba(255,255,255,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Restoration →
        </motion.button>
      </main>
    </motion.div>
  );
}
