import React, { useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface HeroProps {
  /** Entrance choreography waits for the envelope to open, so it is actually seen. */
  revealed?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay: number, y = 15): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: EASE } },
});

const nameContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.55 } },
};

const nameLetter: Variants = {
  hidden: { opacity: 0, y: '0.45em', rotateX: -75 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: EASE } },
};

// Fixed positions so markup is deterministic (no Math.random during render)
const GOLD_DUST = [
  { left: '8%', top: '22%', size: 3, delay: 0, dur: 9 },
  { left: '18%', top: '68%', size: 2, delay: 1.6, dur: 11 },
  { left: '27%', top: '38%', size: 2.5, delay: 3.1, dur: 10 },
  { left: '36%', top: '82%', size: 2, delay: 0.8, dur: 12 },
  { left: '64%', top: '18%', size: 2.5, delay: 2.2, dur: 10 },
  { left: '72%', top: '58%', size: 3, delay: 4, dur: 9 },
  { left: '83%', top: '30%', size: 2, delay: 1.1, dur: 12 },
  { left: '91%', top: '74%', size: 2.5, delay: 2.8, dur: 11 },
  { left: '50%', top: '12%', size: 2, delay: 3.6, dur: 13 },
  { left: '44%', top: '90%', size: 2.5, delay: 5, dur: 10 },
];

const SplitName: React.FC<{ text: string }> = ({ text }) => (
  <motion.span variants={nameContainer} style={{ display: 'block', perspective: '600px' }} aria-hidden="true">
    {Array.from(text).map((ch, i) => (
      <motion.span
        key={i}
        variants={nameLetter}
        style={{ display: 'inline-block', transformOrigin: '50% 100%', willChange: 'transform' }}
      >
        {ch === ' ' ? ' ' : ch}
      </motion.span>
    ))}
  </motion.span>
);

export const Hero: React.FC<HeroProps> = ({ revealed = true }) => {
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  const { scrollY } = useScroll();
  // Restrained parallax
  const bgY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 80]);
  const textY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 40]);
  const textOpacity = useTransform(scrollY, [0, 450], [1, 0.1]);

  // Pointer depth: background drifts against the cursor, content with it (desktop only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 60, damping: 20, mass: 0.6 };
  const bgShiftX = useSpring(useTransform(px, [-1, 1], [14, -14]), spring);
  const bgShiftY = useSpring(useTransform(py, [-1, 1], [10, -10]), spring);
  const fgShiftX = useSpring(useTransform(px, [-1, 1], [-6, 6]), spring);
  const fgShiftY = useSpring(useTransform(py, [-1, 1], [-4, 4]), spring);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isFinePointer || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handleScrollToCountdown = () => {
    const countdownEl = document.getElementById('countdown-section');
    if (countdownEl) {
      countdownEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  const stage = revealed ? 'show' : 'hidden';

  return (
    <motion.section
      id="hero"
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? 'show' : stage}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
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
        <motion.div style={{ position: 'absolute', inset: 0, x: bgShiftX, y: bgShiftY }}>
          <motion.img
            src="/images/hero.jpg"
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
            variants={{
              hidden: { scale: 1.14 },
              show: { scale: 1.0, transition: { duration: reduceMotion ? 0 : 4, ease: [0.25, 1, 0.5, 1] } },
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '110%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              display: 'block',
            }}
          />
        </motion.div>

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

      {/* Atmosphere: warm light leaks + slow gold dust (decorative, never intercepts touch) */}
      <div className="hero-atmosphere" aria-hidden="true">
        <span className="hero-light hero-light--gold" />
        <span className="hero-light hero-light--rose" />
        {!reduceMotion &&
          GOLD_DUST.map((d, i) => (
            <span
              key={i}
              className="hero-dust"
              style={{
                left: d.left,
                top: d.top,
                width: d.size,
                height: d.size,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.dur}s`,
              }}
            />
          ))}
      </div>

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
        <motion.div style={{ x: fgShiftX, y: fgShiftY }}>
          {/* V ✤ J Monogram Medallion */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.85, rotateY: -70 },
              show: { opacity: 1, scale: 1, rotateY: 0, transition: { duration: 1.2, delay: 0.05, ease: EASE } },
            }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', perspective: '700px' }}
          >
            <div className="hero-monogram" aria-hidden="true">
              <span className="hero-monogram-ring" />
              <span className="hero-monogram-text">{weddingData.monogram}</span>
            </div>
          </motion.div>

          {/* Sacred Hindi Blessing */}
          <motion.div variants={fadeUp(0.2, -12)} style={{ marginBottom: '16px' }}>
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
          <motion.div variants={fadeUp(0.4)} style={{ marginBottom: '18px' }}>
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
            <h1
              aria-label={`${weddingData.groomName} and ${weddingData.brideName}`}
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
              <SplitName text={weddingData.groomName} />
              <motion.span
                className="hero-heart"
                aria-hidden="true"
                variants={{
                  hidden: { opacity: 0, scale: 0.4 },
                  show: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 1.0, ease: EASE } },
                }}
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
              </motion.span>
              <motion.span variants={{ hidden: {}, show: { transition: { delayChildren: 0.5 } } }} style={{ display: 'block' }}>
                <SplitName text={weddingData.brideName} />
              </motion.span>
            </h1>
          </div>

          {/* Self-drawing Ornamental Line */}
          <motion.div
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              show: { scaleX: 1, opacity: 1, transition: { duration: 1.2, delay: 1.1, ease: EASE } },
            }}
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
          <motion.div variants={fadeUp(1.25)} style={{ marginBottom: '26px' }}>
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
              className="hero-date-card"
              variants={fadeUp(1.45)}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '12px 32px',
                background: 'rgba(252, 250, 247, 0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
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
            <motion.button
              type="button"
              className="hero-scroll-indicator"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { delay: 1.8, duration: 1 } },
              }}
              onClick={handleScrollToCountdown}
              style={{
                marginTop: '24px',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '6px 10px',
                minHeight: '44px',
              }}
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
              <motion.span
                style={{ display: 'inline-flex' }}
                animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <ChevronDown size={15} color="var(--accent-gold)" />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
