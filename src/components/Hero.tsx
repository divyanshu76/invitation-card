import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  // Restrained parallax
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const textY = useTransform(scrollY, [0, 600], [0, 40]);
  const textOpacity = useTransform(scrollY, [0, 450], [1, 0.1]);

  const handleScrollToCountdown = () => {
    const countdownEl = document.getElementById('countdown-section');
    if (countdownEl) {
      countdownEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '90px',
        paddingBottom: '80px',
      }}
      aria-label="Wedding Hero Invitation"
    >
      {/* Background Image Container with Parallax & Slow Scale */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-5% -5% 0 -5%',
          y: bgY,
          zIndex: 0,
        }}
      >
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 3.5, ease: [0.25, 1, 0.5, 1] }}
          style={{
            width: '100%',
            height: '110%',
            backgroundImage: 'url(/images/hero.jpg)',
            backgroundPosition: 'center 40%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Multi-layer luxury editorial scrim for supreme readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(248, 243, 236, 0.82) 0%, rgba(248, 243, 236, 0.45) 25%, rgba(248, 243, 236, 0.55) 75%, rgba(248, 243, 236, 0.98) 100%),
              radial-gradient(ellipse at 50% 50%, rgba(248, 243, 236, 0.92) 0%, rgba(248, 243, 236, 0.65) 60%, rgba(248, 243, 236, 0.3) 100%)
            `,
          }}
        />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          y: textY,
          opacity: textOpacity,
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {/* Sacred Hindi Blessing */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '16px' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.15rem',
              color: 'var(--accent-gold)',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            {weddingData.weddingBlessing}
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '18px' }}
        >
          <span
            className="eyebrow"
            style={{
              letterSpacing: '0.28em',
              color: 'var(--text-accent)',
              fontSize: '0.78rem',
            }}
          >
            {weddingData.eyebrow}
          </span>
        </motion.div>

        {/* Prominent Couple Names */}
        <div style={{ margin: '10px 0 20px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3rem, 9.5vw, 6.5rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              color: '#3E1724',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textShadow: '0 2px 20px rgba(248, 243, 236, 0.8)',
            }}
          >
            {weddingData.groomName}
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
                color: 'var(--accent-gold)',
                margin: '4px 0',
                textTransform: 'none',
              }}
            >
              ♡
            </span>
            {weddingData.brideName}
          </motion.h1>
        </div>

        {/* Self-drawing Ornamental Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            margin: '20px auto',
            maxWidth: '280px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-gold))' }} />
          <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem' }}>✤</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }} />
        </motion.div>

        {/* Subtitles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '26px' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
              color: 'var(--text-accent)',
              marginBottom: '6px',
              fontWeight: 400,
            }}
          >
            "{weddingData.subtitle}"
          </p>
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              color: 'var(--accent-gold)',
              letterSpacing: '0.04em',
            }}
          >
            {weddingData.hindiSubtitle}
          </p>
        </motion.div>

        {/* Date & City Location */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '6px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px 32px',
              background: 'rgba(252, 250, 247, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(196, 163, 106, 0.35)',
              borderRadius: '2px',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              20 NOVEMBER 2026
            </span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                letterSpacing: '0.14em',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              MAU, UTTAR PRADESH
            </span>
          </motion.div>
        </div>

        {/* Minimal Animated Scroll Indicator (In separate centered row below date) */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <motion.div
            className="hero-scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 1 }}
            onClick={handleScrollToCountdown}
            style={{
              marginTop: '24px',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
            role="button"
            tabIndex={0}
            aria-label="Scroll to discover countdown"
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.66rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              SCROLL TO DISCOVER
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown size={15} color="var(--accent-gold)" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
