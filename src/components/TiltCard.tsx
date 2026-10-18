import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  /** Maximum tilt in degrees. Kept small so artwork never looks distorted. */
  max?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Gentle pointer-driven 3D tilt with a soft light glare — the "held paper" feel.
 * Only active for fine pointers (mouse/trackpad) without reduced-motion; on touch
 * devices and for reduced motion it renders as a plain static wrapper.
 */
export const TiltCard: React.FC<TiltCardProps> = ({ children, max = 5, style, className }) => {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 248, 235, 0.28) 0%, transparent 55%)`;
  const glareOpacity = useSpring(0, spring);

  if (!enabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={['depth-card', className].filter(Boolean).join(' ')}
      style={{ ...style, rotateX, rotateY, transformPerspective: 1000, position: 'relative' }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        glareOpacity.set(1);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        glareOpacity.set(0);
      }}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: glare,
          opacity: glareOpacity,
          pointerEvents: 'none',
          mixBlendMode: 'soft-light',
        }}
      />
    </motion.div>
  );
};

export default TiltCard;
