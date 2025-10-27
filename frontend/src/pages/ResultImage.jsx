// ResultImage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Restore.css"; // (기존 CSS 파일 재사용)

// 부모로부터 4개의 props를 받음
export default function ResultImage({
  originalImage,
  restoredImage,
  originalFilename,
  onRetry,
}) {
  const [sliderPosition, setSliderPosition] = useState(50);

  // 슬라이더 이동 로직 (기존과 동일)
  const handleSliderMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, newPosition)));
  };

  // 다운로드 로직 (수정된 파일명 로직 포함)
  const handleDownload = () => {
    if (!restoredImage || !originalFilename) return;

    const lastDotIndex = originalFilename.lastIndexOf(".");
    const baseName =
      lastDotIndex === -1
        ? originalFilename
        : originalFilename.substring(0, lastDotIndex);

    const newFilename = `복원_${baseName}.jpg`;

    const link = document.createElement("a");
    link.href = restoredImage;
    link.download = newFilename;
    link.click();
  };

  return (
    <motion.div
      className="restore-page" // 동일한 레이아웃 사용
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <header className="restore-header">
        <motion.h1
          className="restore-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          복원이 완료되었습니다
        </motion.h1>
      </header>

      {/* 비교 슬라이더 (기존 Restore.jsx에서 가져옴) */}
      <motion.div
        className="upload-section" // 동일한 클래스 재사용
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
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
      </motion.div>

      {/* 버튼 영역 (기존 Restore.jsx에서 가져옴) */}
      <div className="button-area">
        <motion.button
          className="restore-btn"
          whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
        >
          복원된 이미지 다운로드 ⬇
        </motion.button>

        {/* '다시 시도' 버튼 추가 (새로운 기능) */}
        <motion.button
          className="restore-btn secondary" // (CSS에서 .secondary 스타일 추가 필요)
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry} // App.js의 handleRetry 호출
          style={{ marginLeft: "1rem", background: "#555" }}
        >
          다른 사진 복원하기 ↩
        </motion.button>
      </div>
    </motion.div>
  );
}
