import React, { useEffect, useRef } from "react";

const Confetti = ({ onEnd }: { onEnd: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const petalCount = 80;
    const petals = Array.from({ length: petalCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 6 + 3,
      color: [
        "#ffb6c1", // light pink
        "#ffc0cb", // pink
        "#f9cce7", // cherry blossom
        "#ffe4e1", // misty rose
      ][Math.floor(Math.random() * 4)],
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: Math.random() * Math.PI,
      rotation: Math.random() * 360,
      speed: Math.random() * 5.0 + 0.5,
      swing: Math.random() * 10 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * (Math.PI / 180));
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });
      update();
    };

    const update = () => {
      petals.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.tiltAngle) * p.swing;
        p.tiltAngle += p.tiltAngleIncremental;
        p.rotation += 0.5;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
      });
    };

    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      draw();
    };
    animate();

    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      onEnd();
    }, 4000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [onEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    ></canvas>
  );
};

export default Confetti;
