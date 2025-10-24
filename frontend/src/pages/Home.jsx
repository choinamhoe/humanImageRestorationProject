import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

const slides = [
  {
    img: `memory1.jpg`,
    text: "restore your memories",
  },
  {
    img: `memory2.jpg`,
    text: "AI brings them back to life",
  },
  {
    img: `memory3.jpg`,
    text: "Re:Memory — redefine nostalgia",
  },
];

export default function Home() {
  const navigate = useNavigate();
  console.log(slides);
  const settings = {
    dots: false,
    infinite: true,
    fade: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="home-container">
      <Slider {...settings}>
        {slides.map((s, i) => (
          <div
            key={i}
            className="slide"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL + s.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            <p>{s.img}</p>
            <div className="overlay" />
            <motion.h1
              className="slide-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              {s.text}
            </motion.h1>
          </div>
        ))}
      </Slider>

      <button className="cta-btn" onClick={() => navigate("/restore")}>
        복원 시작하기 →
      </button>
    </div>
  );
}
