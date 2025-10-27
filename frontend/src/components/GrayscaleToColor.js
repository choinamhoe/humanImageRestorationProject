import React, { useState } from "react";

const GrayscaleToColor = () => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h2 className="text-3xl font-bold mb-4">흑백 → 컬러 변환</h2>

      <label className="cursor-pointer bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600 transition">
        이미지 선택
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {image && (
        <div className="mt-6">
          <img
            src={image}
            alt="preview"
            className="w-80 h-auto rounded-xl shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default GrayscaleToColor;
