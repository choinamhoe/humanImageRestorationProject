import React, { useState } from "react";
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
      // 복원된 이미지 예시 (AI 백엔드 연결 전까지 샘플 이미지 사용)
      setRestoredImage(`${process.env.PUBLIC_URL}/restored-sample.jpg`);
    }
  };

  // 마우스로 중앙 슬라이더 이동
  const handleSliderMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, newPosition)));
  };

  return (
    <div className="restore-page">
      <h1>Re:Memory AI Restoration</h1>
      <p>AI로 잊혀진 추억을 되살리세요.</p>

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
        {!originalImage ? (
          <p>이미지를 업로드하려면 클릭하세요</p>
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
      </div>

      <button className="restore-btn">AI 복원 시작</button>
    </div>
  );
}
