import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MailOpen } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface IntroEnvelopeProps {
  onUnlock: () => void;
}

export const IntroEnvelope: React.FC<IntroEnvelopeProps> = ({ onUnlock }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isTriggeredRef = useRef(false);

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Prevent background scrolling while envelope overlay is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleOpen = () => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    setIsOpening(true);

    if (prefersReducedMotion) {
      setTimeout(() => {
        setIsDismissed(true);
        document.body.style.overflow = '';
        onUnlock();
      }, 350);
      return;
    }

    // Sequence timing:
    // 0ms: Seal releases & fades
    // 180ms: Flap smoothly rotates open 180deg around top hinge
    // 420ms: Card emerges upward from inside the envelope pocket
    // 1500ms: Entire overlay fades away smoothly to reveal celebration website
    setTimeout(() => {
      setIsDismissed(true);
      document.body.style.overflow = '';
      onUnlock();
    }, 1750);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpening ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, delay: isOpening ? 1.15 : 0, ease: [0.22, 1, 0.36, 1] }}
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
          padding: '24px 16px',
          overflow: 'hidden',
          cursor: isOpening ? 'default' : 'pointer',
        }}
        onClick={handleOpen}
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

        {/* Ambient Drifting Rose Petals */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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

        {/* Top Header Text with Balanced Proportions */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
            <div style={{ width: '38px', height: '1px', background: 'linear-gradient(90deg, transparent, #C4A36A)' }} />
            <span style={{ color: '#C4A36A', fontSize: '0.75rem' }}>✤</span>
            <div style={{ width: '38px', height: '1px', background: 'linear-gradient(90deg, #C4A36A, transparent)' }} />
          </div>
        </motion.div>

        {/* Central Realistic Luxury Envelope Container */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Open wedding invitation envelope"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            aspectRatio: '1.48 / 1',
            perspective: '1400px',
            zIndex: 10,
            outline: 'none',
          }}
        >
          {/* Main Envelope Body with 3D Depth & Realistic Shadow */}
          <motion.div
            id="envelope-body"
            animate={
              isOpening
                ? {
                    scale: 1.02,
                    y: -4,
                    boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.85), 0 15px 35px -5px rgba(0, 0, 0, 0.6)',
                  }
                : {
                    scale: 1,
                    y: [0, -4, 0],
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.75), 0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }
            }
            transition={
              isOpening
                ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '14px',
              overflow: 'visible',
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
                      y: -112,
                      opacity: 1,
                      scale: 1.02,
                    }
                  : { y: 0, opacity: 0.85 }
              }
              transition={{ duration: 0.75, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
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
                  color: '#C4A36A',
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
            </div>

            {/* 4. LAYER 4: Precision Top Flap (Hinged at top center edge, z-index: isOpening ? 2 : 6) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.72, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
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

            {/* 5. LAYER 5: Centered Circular Embossed Gold Wax Seal (z-index: isOpening ? 1 : 7) */}
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
                zIndex: isOpening ? 1 : 7,
                pointerEvents: 'none',
              }}
            >
              <motion.div
                animate={
                  isOpening
                    ? { scale: 0.85, opacity: 0, y: -6 }
                    : { scale: [1, 1.025, 1], opacity: 1, y: 0 }
                }
                transition={
                  isOpening
                    ? { duration: 0.22, ease: 'easeOut' }
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                }
                style={{
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
                    V ✤ J
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Call-To-Action Control: Refined, Distinct & Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
          <button
            id="envelope-unlock-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            disabled={isOpening}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 32px',
              backgroundColor: 'rgba(78, 32, 48, 0.92)',
              backgroundImage: 'linear-gradient(135deg, #542436 0%, #3D1726 100%)',
              border: '1px solid rgba(196, 163, 106, 0.55)',
              borderRadius: '12px',
              color: '#F8F3EC',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(92, 38, 56, 0.96)';
              e.currentTarget.style.borderColor = '#C4A36A';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(78, 32, 48, 0.92)';
              e.currentTarget.style.borderColor = 'rgba(196, 163, 106, 0.55)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45)';
            }}
            aria-label="Tap to unlock wedding invitation"
          >
            <MailOpen size={16} color="#C4A36A" />
            <span>TAP TO UNLOCK</span>
            <Sparkles size={14} color="#C4A36A" />
          </button>

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
      </motion.div>
    </AnimatePresence>
  );
};

