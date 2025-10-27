import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 헤더 */}
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
          onClick={() => navigate("/login")}
        >
          Login
        </motion.button>
      </header>

      {/* 본문 중앙 텍스트 */}
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

        {/* 버튼 */}
        <motion.button
          className="start-btn"
          onClick={() => navigate("/restore")}
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
    </div>
  );
}
