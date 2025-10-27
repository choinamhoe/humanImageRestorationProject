import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Restore.css";

export default function Restore() {
  const [originalImage, setOriginalImage] = useState(null);
  const [restoredImage, setRestoredImage] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [loading, setLoading] = useState(false);
  const [originalFilename, setOriginalFilename] = useState(""); // <-- 1. 파일명 저장을 위한 state 추가

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setOriginalFilename(file.name); // <-- 2. state에 원본 파일명 저장
      uploadToServer(file); // 서버 전송
    }
  };

  // 서버에 multipart로 이미지 전송 + Base64 응답 받기
  const uploadToServer = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/restore", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("서버 오류");

      const data = await response.json();

      if (data.restored_image) {
        const base64String = data.restored_image;
        const imageSrc = base64String.startsWith("data:image")
          ? base64String
          : `data:image/jpeg;base64,${base64String}`;
        setRestoredImage(imageSrc);
      } else {
        throw new Error("복원된 이미지가 없습니다.");
      }
    } catch (err) {
      console.error("복원 요청 실패:", err);
      setRestoredImage(`${process.env.PUBLIC_URL}/memory3.jpg`);
    } finally {
      setLoading(false);
    }
  };

  // 슬라이더 이동
  const handleSliderMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, newPosition)));
  };

  // 복원된 이미지 다운로드
  const handleDownload = () => {
    // <-- 3. 다운로드 로직 수정
    if (!restoredImage || !originalFilename) return;

    // 1. 원본 파일명에서 확장자 제거 (예: 'photo.png' -> 'photo')
    const lastDotIndex = originalFilename.lastIndexOf(".");
    const baseName =
      lastDotIndex === -1
        ? originalFilename
        : originalFilename.substring(0, lastDotIndex);

    // 2. 새 파일명 생성 (예: '복원_photo.jpg')
    const newFilename = `복원_${baseName}.jpg`;

    // 3. 다운로드 링크 생성 및 실행
    const link = document.createElement("a");
    link.href = restoredImage;
    link.download = newFilename; // <-- 수정된 파일명 적용
    link.click();
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
        ) : loading ? (
          <div className="loading-box">
            <p>AI가 이미지를 복원 중입니다...</p>
          </div>
        ) : (
          restoredImage && (
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
          )
        )}
      </motion.div>

      {/* 버튼 영역 */}
      {restoredImage && !loading && (
        <div className="button-area">
          <motion.button
            className="restore-btn"
            whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
          >
            복원된 이미지 다운로드 ⬇
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
