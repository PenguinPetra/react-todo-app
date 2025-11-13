import React, { useEffect } from "react";
import "./starAnimation.css"; // ✅ ファイル名変更済み版

const Stars: React.FC = () => {
  useEffect(() => {
    const container = document.querySelector(".shooting-stars-container");
    if (!container) return;

    const createStar = () => {
      const star = document.createElement("div");
      star.classList.add("shooting-star");

      // ランダムな位置（上半分中心）
      star.style.top = Math.random() * 40 + "%";
      star.style.left = Math.random() * 80 + "%";

      container.appendChild(star);

      star.style.animation = "shoot 1.5s linear forwards";

      setTimeout(() => {
        star.remove();
      }, 1500);
    };

    // 🌠 10秒ごとに4つ流星（0.5秒間隔）
    const startInterval = setInterval(() => {
      for (let i = 0; i < 10; i++) {
        setTimeout(createStar, i * 500);
      }
    }, 10000);

    return () => clearInterval(startInterval);
  }, []);

  return (
    <div className="shooting-stars-container fixed inset-0 pointer-events-none z-[-5]" />
  );
};

export default Stars;
