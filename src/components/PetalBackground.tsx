import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: 'rose' | 'lotus';
}

export const PetalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle luxury petal colors: dusty rose, soft blush, champagne shimmer
    const colors = [
      'rgba(221, 175, 182, 0.45)', // Dusty Rose
      'rgba(240, 222, 221, 0.55)', // Soft Blush
      'rgba(196, 163, 106, 0.35)', // Champagne gold
      'rgba(200, 150, 160, 0.38)', // Deep Rose
    ];

    // Restrained count (16 petals) so it feels peaceful, not chaotic or distracting
    const petalCount = 18;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 9, // 9px to 19px
        speedY: Math.random() * 0.45 + 0.3, // slow drift
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.4 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.4 ? 'rose' : 'lotus',
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      if (p.shape === 'rose') {
        // Organic curved rose petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 1.2, p.size * 0.3, 0, p.size * 1.3);
        ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.3, -p.size * 0.6, -p.size * 0.6, 0, 0);
      } else {
        // Slender lotus petal shape
        ctx.moveTo(0, -p.size * 0.8);
        ctx.quadraticCurveTo(p.size * 0.6, 0, 0, p.size * 0.8);
        ctx.quadraticCurveTo(-p.size * 0.6, 0, 0, -p.size * 0.8);
      }
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      tick += 0.01;
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += Math.sin(tick + idx) * 0.4 + p.speedX;
        p.rotation += p.rotationSpeed;

        // Wrap around smoothly
        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) p.x = -25;
        if (p.x < -25) p.x = width + 25;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
};
