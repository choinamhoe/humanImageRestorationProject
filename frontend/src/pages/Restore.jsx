import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Restore.css";

export default function Restore() {
  const [originalImage, setOriginalImage] = useState(null);
  const [restoredImage, setRestoredImage] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      // 임시 복원 이미지 (AI 연결 전까지 샘플 사용)
      setRestoredImage(`${process.env.PUBLIC_URL}/restored-sample.jpg`);
    }
  };

  // 슬라이더 이동
  const handleSliderMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, newPosition)));
  };

  return (
    <motion.div
      className="restore-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 헤더 */}
      <header className="restore-header">
        <motion.h1
          className="restore-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Re:Memory AI Restoration
        </motion.h1>
        <motion.p
          className="restore-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          AI로 잊혀진 추억을 되살리세요.
        </motion.p>
      </header>

      {/* 본문 */}
      <motion.div
        className="upload-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {!originalImage ? (
          <div
            className="upload-box"
            onClick={() => document.getElementById("upload").click()}
          >
            <input
              id="upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <p>이미지를 업로드하려면 클릭하세요</p>
          </div>
        ) : (
          <div
            className="comparison-container"
            onMouseMove={handleSliderMove}
            onTouchMove={(e) => handleSliderMove(e.touches[0])}
          >
            <div className="image-wrapper">
              <img src={originalImage} alt="Original" />
              <div
                className="restored-wrapper"
                style={{ width: `${sliderPosition}%` }}
              >
                <img src={restoredImage} alt="Restored" />
              </div>
              <div
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* 버튼 */}
      <motion.button
        className="restore-btn"
        whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
        whileTap={{ scale: 0.95 }}
      >
        AI 복원 시작 →
      </motion.button>
    </motion.div>
  );
}
