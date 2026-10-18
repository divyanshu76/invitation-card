import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, MailOpen } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface IntroEnvelopeProps {
  /** Fired once the invitation has been revealed (ivory light has filled the screen). */
  onUnlock: () => void;
  /** Fired after the overlay has fully faded and can be unmounted. */
  onComplete?: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Cinematic sequence timings (seconds)
const T = {
  sealBreak: 0,
  flapOpen: 0.28,
  cardRise: 0.75,
  pushIn: 1.45,
  bloom: 1.55,
  reveal: 2.15,
  fadeOut: 0.6,
};

// Irregular scalloped rim where molten wax spread before the stamp was pressed
const WAX_RIM = (() => {
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i <= n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 === 0 ? 48 : 44 + ((i * 7) % 3);
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
})();

const WaxSealFace: React.FC = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
  <svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    style={{ position: 'absolute', inset: '-9px', width: 'calc(100% + 18px)', height: 'calc(100% + 18px)', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))' }}
  >
    <defs>
      <radialGradient id="waxRimGrad" cx="38%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#E4C88E" />
        <stop offset="60%" stopColor="#B08A4A" />
        <stop offset="100%" stopColor="#7A5824" />
      </radialGradient>
    </defs>
    <path d={WAX_RIM} fill="url(#waxRimGrad)" />
  </svg>
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 35% 32%, #E8D098 0%, #C4A36A 45%, #947238 85%, #6B4E1E 100%)',
      border: '1.5px solid #F0DFB8',
      boxShadow:
        '0 8px 22px rgba(0, 0, 0, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Double-Ring Recessed Embossed Border */}
    <div
      style={{
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        border: '1.5px double rgba(90, 55, 15, 0.65)',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Embossed V ✤ J Monogram */}
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.98rem',
          color: '#341508',
          fontWeight: 700,
          letterSpacing: '0.04em',
          lineHeight: 1,
          textShadow: '0 1px 1px rgba(255, 245, 215, 0.65), 0 -1px 1px rgba(50, 30, 10, 0.5)',
        }}
      >
        {weddingData.monogram}
      </span>
    </div>
  </div>
  </div>
);

export const IntroEnvelope: React.FC<IntroEnvelopeProps> = ({ onUnlock, onComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isTriggeredRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  // Read once — motion preference does not need to be reactive for a one-shot intro
  const [prefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  // Pointer-driven 3D tilt of the envelope (desktop only, restrained range)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(useTransform(pointerY, [-1, 1], [7, -7]), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useTransform(pointerX, [-1, 1], [-9, 9]), { stiffness: 120, damping: 18 });
  const glareX = useTransform(pointerX, [-1, 1], ['20%', '80%']);
  const glareY = useTransform(pointerY, [-1, 1], ['15%', '75%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255, 236, 200, 0.14) 0%, transparent 55%)`
  );

  // Prevent background scrolling while envelope overlay is active; clear timers on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timers = timersRef.current;

    return () => {
      document.body.style.overflow = originalOverflow;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Warm the hero photograph while the visitor reads the envelope
  useEffect(() => {
    const img = new Image();
    img.decoding = 'async';
    img.src = '/images/hero.jpg';
  }, []);

  const schedule = (fn: () => void, seconds: number) => {
    timersRef.current.push(window.setTimeout(fn, seconds * 1000));
  };

  const handleOpen = () => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    setIsOpening(true);
    pointerX.set(0);
    pointerY.set(0);

    const revealAt = prefersReducedMotion ? 0.3 : T.reveal;
    const fadeFor = prefersReducedMotion ? 0.3 : T.fadeOut;

    // Timer-driven (not animation-callback-driven) so the visitor can never be trapped,
    // even if an animation is interrupted or never fires its completion event.
    schedule(() => {
      setIsRevealed(true);
      document.body.style.overflow = '';
      onUnlock();
    }, revealAt);
    schedule(() => {
      setIsDismissed(true);
      onComplete?.();
    }, revealAt + fadeFor + 0.05);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isFinePointer || prefersReducedMotion || isOpening) return;
    const { innerWidth, innerHeight } = window;
    pointerX.set((e.clientX / innerWidth) * 2 - 1);
    pointerY.set((e.clientY / innerHeight) * 2 - 1);
  };

  if (isDismissed) return null;

  const motionOff = prefersReducedMotion;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isRevealed ? 0 : 1 }}
      transition={{ duration: motionOff ? 0.3 : T.fadeOut, ease: EASE }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#351421',
        backgroundImage: `
          radial-gradient(circle at 50% 46%, #4A1E2F 0%, #2D0F1B 65%, #1F0A13 100%),
          radial-gradient(circle at 15% 20%, rgba(196, 163, 106, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(221, 175, 182, 0.06) 0%, transparent 45%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))',
        overflow: 'hidden',
        cursor: isOpening ? 'default' : 'pointer',
        pointerEvents: isRevealed ? 'none' : 'auto',
      }}
      onClick={handleOpen}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Envelope"
    >
      {/* Subtle Paper Texture Overlay on Screen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.045,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft spotlight that follows the envelope — gives a stage-lit, filmic feel */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0.9 : 0.55 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 'min(130vw, 900px)',
          height: 'min(130vw, 900px)',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(196, 163, 106, 0.16) 0%, rgba(196, 163, 106, 0.04) 40%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Drifting Rose Petals */}
      {!motionOff && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -30,
                x: `${12 + i * 15}%`,
                opacity: 0,
                rotate: 0,
                scale: 0.7 + (i % 3) * 0.15,
              }}
              animate={{
                y: '106vh',
                x: `${10 + i * 15 + (i % 2 === 0 ? 12 : -12)}%`,
                opacity: [0, 0.45, 0.4, 0],
                rotate: 360,
              }}
              transition={{
                duration: 12 + (i % 3) * 3,
                repeat: Infinity,
                delay: i * 1.5,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                width: '16px',
                height: '24px',
                borderRadius: '50% 50% 50% 10%',
                background: 'linear-gradient(135deg, rgba(221, 175, 182, 0.6), rgba(196, 163, 106, 0.35))',
                filter: 'blur(0.4px)',
              }}
            />
          ))}
        </div>
      )}

      {/* Top Header Text with Balanced Proportions */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={isOpening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: isOpening ? 0.6 : 0.8, delay: isOpening ? 0.9 : 0.1, ease: EASE }}
        style={{
          textAlign: 'center',
          marginBottom: '26px',
          zIndex: 2,
          padding: '0 12px',
        }}
      >
        {/* Sacred Sanskrit Invocation */}
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-hindi)',
            fontSize: 'clamp(1rem, 2.8vw, 1.3rem)',
            color: '#C4A36A',
            letterSpacing: '0.14em',
            fontWeight: 500,
            marginBottom: '8px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)',
          }}
        >
          {weddingData.weddingBlessing}
        </span>

        {/* Couple Names Heading */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 5vw, 2.9rem)',
            color: '#F8F3EC',
            letterSpacing: '0.12em',
            fontWeight: 400,
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.15,
            textShadow: '0 4px 18px rgba(0, 0, 0, 0.55)',
          }}
        >
          {weddingData.groomName} WEDS {weddingData.brideName}
        </h1>

        {/* Elegant Gold Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '10px',
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            style={{ width: '38px', height: '1px', background: 'linear-gradient(90deg, transparent, #C4A36A)', transformOrigin: 'right' }}
          />
          <span style={{ color: '#C4A36A', fontSize: '0.75rem' }}>✤</span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            style={{ width: '38px', height: '1px', background: 'linear-gradient(90deg, #C4A36A, transparent)', transformOrigin: 'left' }}
          />
        </div>
      </motion.div>

      {/* Central Realistic Luxury Envelope Container */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Open wedding invitation envelope"
        className="envelope-stage"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          aspectRatio: '1.48 / 1',
          perspective: '1400px',
          zIndex: 10,
        }}
      >
        {/* Soft contact shadow on the "table" beneath the envelope */}
        <motion.div
          aria-hidden="true"
          animate={
            isOpening
              ? { opacity: 0.35, scaleX: 1.1 }
              : motionOff
                ? { opacity: 0.6, scaleX: 1 }
                : { opacity: [0.6, 0.45, 0.6], scaleX: [1, 0.94, 1] }
          }
          transition={isOpening || motionOff ? { duration: 0.6 } : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: '-26px',
            height: '30px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(8, 2, 5, 0.75) 0%, transparent 70%)',
            filter: 'blur(6px)',
            pointerEvents: 'none',
          }}
        />

        {/* 3D tilt + push-in wrapper */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
          }}
          animate={isOpening && !motionOff ? { scale: [1, 1, 1.12], y: [0, 0, 36] } : { scale: 1, y: 0 }}
          transition={{ duration: T.pushIn + 0.7, times: [0, T.pushIn / (T.pushIn + 0.7), 1], ease: EASE }}
        >
          {/* Main Envelope Body with 3D Depth & Realistic Shadow */}
          <motion.div
            id="envelope-body"
            animate={
              isOpening
                ? {
                    y: -4,
                    boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.85), 0 15px 35px -5px rgba(0, 0, 0, 0.6)',
                  }
                : motionOff
                  ? { y: 0, boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.75), 0 10px 25px -5px rgba(0, 0, 0, 0.5)' }
                  : {
                      y: [0, -4, 0],
                      boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.75), 0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }
            }
            transition={
              isOpening || motionOff
                ? { duration: 0.5, ease: EASE }
                : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '14px',
              overflow: 'visible',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 1. LAYER 1: Rear Envelope Backplate & Inner Luxury Lining (z-index: 1) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#3E1626',
                backgroundImage: 'linear-gradient(145deg, #4B1E30 0%, #341220 55%, #42182A 100%)',
                border: '1.5px solid rgba(196, 163, 106, 0.45)',
                borderRadius: '14px',
                zIndex: 1,
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Gold Foil Perimeter Accent Line */}
              <div
                style={{
                  position: 'absolute',
                  inset: '8px',
                  border: '1px solid rgba(196, 163, 106, 0.22)',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
              />

              {/* Shaded Interior Pocket Back Lining */}
              <div
                style={{
                  position: 'absolute',
                  inset: '16px',
                  background: 'linear-gradient(180deg, #2E0E1B 0%, #3B1524 100%)',
                  borderRadius: '6px',
                  border: '1px solid rgba(196, 163, 106, 0.15)',
                  opacity: 0.9,
                }}
              />
            </div>

            {/* 2. LAYER 2: Emerging Invitation Card Inside Pocket (z-index: 3) */}
            {/* When closed, sits inside pocket. When open, slides upward out of the pocket */}
            <motion.div
              initial={{ y: 0, opacity: 0.85 }}
              animate={
                isOpening
                  ? {
                      y: '-46%',
                      opacity: 1,
                      scale: 1.02,
                    }
                  : { y: 0, opacity: 0.85 }
              }
              transition={{ duration: 0.85, delay: motionOff ? 0 : T.cardRise, ease: EASE }}
              style={{
                position: 'absolute',
                top: '14px',
                left: '20px',
                right: '20px',
                height: '86%',
                backgroundColor: '#FCFAF7',
                backgroundImage:
                  'radial-gradient(ellipse at 50% 25%, #FFFFFF 0%, #F6EFE6 100%)',
                border: '1.5px solid rgba(196, 163, 106, 0.6)',
                borderRadius: '10px',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 20px',
                textAlign: 'center',
                zIndex: 3,
                overflow: 'hidden',
              }}
            >
              {/* Inner Decorative Card Border */}
              <div
                style={{
                  position: 'absolute',
                  inset: '6px',
                  border: '1px solid rgba(196, 163, 106, 0.35)',
                  borderRadius: '6px',
                  pointerEvents: 'none',
                }}
              />

              {/* Gold-foil sheen sweeping across the card as it rises */}
              {!motionOff && (
                <motion.div
                  aria-hidden="true"
                  initial={{ x: '-120%' }}
                  animate={isOpening ? { x: '120%' } : { x: '-120%' }}
                  transition={{ duration: 1.1, delay: T.cardRise + 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(105deg, transparent 30%, rgba(228, 213, 188, 0.55) 48%, rgba(255, 255, 255, 0.7) 50%, transparent 66%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <span
                style={{
                  fontFamily: 'var(--font-hindi)',
                  fontSize: '0.92rem',
                  color: '#702D43',
                  marginBottom: '4px',
                  fontWeight: 500,
                }}
              >
                ॥ शुभ विवाह ॥
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.25rem, 3.2vw, 1.65rem)',
                  color: '#542637',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {weddingData.monogram}
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#A88647',
                  fontWeight: 600,
                  marginTop: '6px',
                }}
              >
                Cordially Invite You
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.88rem',
                  color: '#796A67',
                  marginTop: '3px',
                  fontStyle: 'italic',
                }}
              >
                20 November 2026 • Mau
              </span>
            </motion.div>

            {/* 3. LAYER 3: Realistic Solid Burgundy Front Pocket & Side Folds (z-index: 5) */}
            {/* This layer sits IN FRONT of the card, completely covering the card base & sides */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 5,
                pointerEvents: 'none',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <svg
                viewBox="0 0 440 295"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <defs>
                  {/* Left Side Fold Gradient */}
                  <linearGradient id="foldLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#481F30" />
                    <stop offset="100%" stopColor="#3B1524" />
                  </linearGradient>

                  {/* Right Side Fold Gradient */}
                  <linearGradient id="foldRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#441C2C" />
                    <stop offset="100%" stopColor="#351220" />
                  </linearGradient>

                  {/* Bottom Front Pocket Gradient */}
                  <linearGradient id="pocketBottomGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#4F2134" />
                    <stop offset="100%" stopColor="#3C1626" />
                  </linearGradient>

                  {/* Upward Cast Shadow on Pocket */}
                  <filter id="pocketShadow" x="-10%" y="-20%" width="120%" height="140%">
                    <feDropShadow dx="0" dy="-4" stdDeviation="4" floodColor="#15050C" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* Left Side Fold Paper: from (0,0) down to (0,295) and inward past center to (240, 148) */}
                <polygon
                  points="0,0 240,148 0,295"
                  fill="url(#foldLeftGrad)"
                  stroke="rgba(196, 163, 106, 0.28)"
                  strokeWidth="0.8"
                />

                {/* Right Side Fold Paper: from (440,0) down to (440,295) and inward past center to (200, 148) */}
                <polygon
                  points="440,0 200,148 440,295"
                  fill="url(#foldRightGrad)"
                  stroke="rgba(196, 163, 106, 0.28)"
                  strokeWidth="0.8"
                />

                {/* Bottom Triangular Pocket Flap reaching up to (220, 125) with Deep Upward Shadow */}
                <polygon
                  points="0,295 220,125 440,295"
                  fill="url(#pocketBottomGrad)"
                  stroke="rgba(196, 163, 106, 0.42)"
                  strokeWidth="1"
                  filter="url(#pocketShadow)"
                />

                {/* Fine Inset Gold Stitching Line along Bottom Pocket Slopes */}
                <polyline
                  points="14,295 220,136 426,295"
                  fill="none"
                  stroke="rgba(196, 163, 106, 0.22)"
                  strokeWidth="0.75"
                />
              </svg>

              {/* Embossed paisley pressed into the paper, and a gold-foil filigree border */}
              {/* Clipped to the pocket's V so nothing crosses the card when it rises */}
              <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'var(--pattern-paisley)',
                    backgroundSize: '96px 96px',
                    opacity: 0.2,
                    mixBlendMode: 'soft-light',
                  }}
                />
                <div className="envelope-filigree" />
              </div>

              {/* Pointer-tracked light glare across the paper (desktop) */}
              {isFinePointer && !motionOff && (
                <motion.div
                  aria-hidden="true"
                  style={{ position: 'absolute', inset: 0, background: glare, mixBlendMode: 'screen' }}
                />
              )}
            </div>

            {/* 4. LAYER 4: Precision Top Flap (Hinged at top center edge, z-index: isOpening ? 2 : 6) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.8, delay: motionOff ? 0 : T.flapOpen, ease: [0.45, 0, 0.2, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '56%',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                zIndex: isOpening ? 2 : 6,
                pointerEvents: 'none',
              }}
            >
              {/* Front Face of Top Flap (When Closed) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  filter: 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.55))',
                }}
              >
                <svg
                  viewBox="0 0 440 165"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <defs>
                    <linearGradient id="flapFrontGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#552538" />
                      <stop offset="50%" stopColor="#461C2C" />
                      <stop offset="100%" stopColor="#3C1525" />
                    </linearGradient>
                  </defs>

                  {/* Flap Polygon: Perfectly meets corners (0,0) and (440,0) down to center tip (220,165) */}
                  <polygon
                    points="0,0 440,0 220,165"
                    fill="url(#flapFrontGrad)"
                    stroke="rgba(196, 163, 106, 0.45)"
                    strokeWidth="1.2"
                  />

                  {/* Elegant Inset Double Gold Foil V-Line */}
                  <polyline
                    points="12,0 220,154 428,0"
                    fill="none"
                    stroke="rgba(196, 163, 106, 0.35)"
                    strokeWidth="0.8"
                  />
                  <polyline
                    points="22,0 220,144 418,0"
                    fill="none"
                    stroke="rgba(196, 163, 106, 0.18)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              {/* Back Face of Top Flap (Revealed upon opening upward into space above envelope) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <svg
                  viewBox="0 0 440 165"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <defs>
                    <linearGradient id="flapBackGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#32101E" />
                      <stop offset="100%" stopColor="#431929" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,0 440,0 220,165"
                    fill="url(#flapBackGrad)"
                    stroke="rgba(196, 163, 106, 0.3)"
                    strokeWidth="1"
                  />
                  <polyline
                    points="14,0 220,152 426,0"
                    fill="none"
                    stroke="rgba(196, 163, 106, 0.2)"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </motion.div>

            {/* 5. LAYER 5: Centered Circular Embossed Gold Wax Seal */}
            {/* Stable non-animated positioning wrapper to guarantee pixel-perfect horizontal centering relative to envelope body */}
            <div
              id="envelope-wax-seal"
              style={{
                position: 'absolute',
                top: '56%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                zIndex: 7,
                pointerEvents: 'none',
              }}
            >
              {!isOpening ? (
                <motion.div
                  animate={motionOff ? { scale: 1 } : { scale: [1, 1.025, 1] }}
                  transition={motionOff ? { duration: 0 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <WaxSealFace />
                </motion.div>
              ) : (
                // Seal presses in, then cracks into two halves that drift apart and fall away
                (['left', 'right'] as const).map((side) => {
                  const dir = side === 'left' ? -1 : 1;
                  return (
                    <motion.div
                      key={side}
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                      animate={
                        motionOff
                          ? { opacity: 0 }
                          : {
                              scale: [1, 0.92, 0.92],
                              x: [0, 0, dir * 26],
                              y: [0, 0, 34],
                              rotate: [0, 0, dir * 24],
                              opacity: [1, 1, 0],
                            }
                      }
                      transition={{ duration: motionOff ? 0.2 : 0.75, times: [0, 0.22, 1], ease: [0.4, 0, 0.6, 1] }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        clipPath: side === 'left' ? 'polygon(-30% -30%, 54% -30%, 46% 130%, -30% 130%)' : 'polygon(54% -30%, 130% -30%, 130% 130%, 46% 130%)',
                      }}
                    >
                      <WaxSealFace />
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Call-To-Action Control: Refined, Distinct & Elegant */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isOpening ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
        transition={{ duration: isOpening ? 0.4 : 0.8, delay: isOpening ? 0 : 0.25, ease: EASE }}
        style={{
          textAlign: 'center',
          marginTop: '36px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* TAP TO UNLOCK Button with Moderate Border Radius & Warm Burgundy Tone */}
        <motion.button
          id="envelope-unlock-btn"
          type="button"
          className="envelope-unlock-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          disabled={isOpening}
          whileTap={motionOff ? undefined : { scale: 0.97 }}
          aria-label="Tap to unlock wedding invitation"
        >
          <MailOpen size={16} color="#C4A36A" aria-hidden="true" />
          <span>TAP TO UNLOCK</span>
          <Sparkles size={14} color="#C4A36A" aria-hidden="true" />
        </motion.button>

        {/* Supporting Text */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.98rem',
            color: '#DDAFB6',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          "A beautiful celebration awaits"
        </p>
      </motion.div>

      {/* Ivory light bloom — the dark stage dissolves into the invitation's paper colour,
          so the hand-off to the ivory hero has no flash or hard cut. */}
      {isOpening && !motionOff && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 2.4 }}
          transition={{ duration: T.reveal - T.bloom + 0.1, delay: T.bloom, ease: [0.5, 0, 0.3, 1] }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            width: '100vmax',
            height: '100vmax',
            marginLeft: '-50vmax',
            marginTop: '-50vmax',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FCFAF7 0%, #F8F3EC 45%, rgba(248, 243, 236, 0.95) 60%, rgba(248, 243, 236, 0) 72%)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      )}
    </motion.div>
  );
};
