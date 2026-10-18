import React from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';
import { TiltCard } from './TiltCard';
import { SectionDecor } from './decor/SectionDecor';

export const DivineBlessings: React.FC = () => {
  return (
    <section
      id="blessings"
      style={{
        position: 'relative',
        padding: '110px 0',
        backgroundColor: 'var(--bg-warm-ivory)',
        borderTop: '1px solid rgba(196, 163, 106, 0.25)',
        borderBottom: '1px solid rgba(196, 163, 106, 0.25)',
        overflow: 'hidden',
      }}
      aria-label="Divine Blessings of Lord Shiva and Goddess Parvati"
    >
      <SectionDecor variant="blessings" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Section Eyebrow */}
          <span className="eyebrow" style={{ marginBottom: '12px' }}>
            SACRED UNION & GRACE
          </span>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            {weddingData.divineBlessingHeading}
          </h2>

          {/* Subtle Ornamental Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              margin: '0 auto 36px',
              maxWidth: '220px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-gold))' }} />
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }} />
          </div>

          {/* Architectural Arch Frame with Shiva-Parvati Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotateX: 14, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformPerspective: 1200,
              transformOrigin: '50% 100%',
              position: 'relative',
              maxWidth: '560px',
              margin: '0 auto 40px',
              padding: '16px',
              background: '#FCFAF7',
              border: '1px solid rgba(196, 163, 106, 0.45)',
              boxShadow: 'var(--shadow-elevated)',
              borderRadius: 'var(--radius-xl)',
            }}
            className="divine-artwork-card lux-card lux-card--layered lux-edge"
          >
            {/* Subtle Inner Arch Frame */}
            <TiltCard style={{ borderRadius: 'inherit' }}>
<div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'calc(var(--radius-xl) - 8px)',
                border: '1px solid rgba(196, 163, 106, 0.25)',
                backgroundColor: '#FAF5EE',
              }}
            >
              <img
                src="/images/shiva_parvati.jpg"
                alt="Lord Shiva and Goddess Parvati Divine Union"
                loading="lazy"
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.8s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1.0)';
                }}
              />
            </div>
</TiltCard>

            {/* Corner Decorative Accents */}
          </motion.div>

          {/* Core Hindi Blessing Text */}
          <div
            style={{
              padding: '24px 32px',
              background: 'rgba(252, 250, 247, 0.85)',
              borderLeft: '3px solid var(--accent-gold)',
              borderRight: '3px solid var(--accent-gold)',
              borderRadius: 'var(--radius-md)',
              maxWidth: '740px',
              margin: '0 auto 24px',
              boxShadow: 'var(--shadow-subtle)',
            }}
            className="lux-card"
          >
            <p
              style={{
                fontFamily: 'var(--font-hindi)',
                fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
                color: 'var(--text-primary)',
                lineHeight: 1.75,
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              "{weddingData.divineBlessingText}"
            </p>
          </div>

          {/* Sanskrit Sloka */}
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '0.94rem',
              color: 'var(--accent-gold)',
              lineHeight: 1.85,
              maxWidth: '660px',
              margin: '0 auto',
            }}
          >
            ॥ {weddingData.divineBlessingMantra} ॥
          </p>
        </motion.div>
      </div>
    </section>
  );
};
