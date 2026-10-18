import React from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';
import { TiltCard } from './TiltCard';
import { SectionDecor } from './decor/SectionDecor';

export const GaneshBlessing: React.FC = () => {
  return (
    <section
      id="ganesh-blessing"
      style={{
        position: 'relative',
        padding: '90px 0 100px',
        backgroundColor: 'var(--bg-warm-ivory)',
        overflow: 'hidden',
      }}
      aria-label="Lord Ganesha Auspicious Blessing"
    >
      <SectionDecor variant="ganesh" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Sacred Eyebrow */}
          <span className="eyebrow" style={{ marginBottom: '10px' }}>
            PRATHAM PUJYA • AUSPICIOUS BEGINNING
          </span>

          {/* Hindi Invocation */}
          <h2
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: 'clamp(1.8rem, 4vw, 2.7rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.08em',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            {weddingData.ganeshBlessing.heading}
          </h2>

          {/* Subheading */}
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: 'var(--accent-gold)',
              marginBottom: '32px',
              letterSpacing: '0.04em',
            }}
          >
            "{weddingData.ganeshBlessing.subheading}"
          </p>

          {/* Dedicated Lord Ganesha Artwork Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotateX: 14, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformPerspective: 1200,
              transformOrigin: '50% 100%',
              position: 'relative',
              maxWidth: '380px',
              margin: '0 auto 36px',
              padding: '16px',
              background: '#FCFAF7',
              border: '1px solid rgba(196, 163, 106, 0.45)',
              borderRadius: '30px 30px 22px 22px',
              boxShadow: 'var(--shadow-editorial)',
            }}
            className="ganesh-artwork-card lux-card lux-card--layered lux-edge"
          >
            {/* Inner Arch Frame with subtle paper texture match */}
            <TiltCard style={{ borderRadius: 'inherit' }}>
<div
              style={{
                position: 'relative',
                borderRadius: '24px 24px 16px 16px',
                overflow: 'hidden',
                backgroundColor: '#FAF5EE',
                border: '1px solid rgba(196, 163, 106, 0.25)',
              }}
            >
              <img
                src={weddingData.ganeshBlessing.image}
                alt="Lord Ganesha Auspicious Watercolor Portrait"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '9 / 16',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
</TiltCard>

            {/* Subtle Corner Accents */}
          </motion.div>

          {/* Sanskrit Sloka */}
          <div
            style={{
              padding: '20px 24px',
              background: 'rgba(252, 250, 247, 0.8)',
              border: '1px solid rgba(196, 163, 106, 0.3)',
              borderRadius: 'var(--radius-md)',
              maxWidth: '680px',
              margin: '0 auto 20px',
              boxShadow: 'var(--shadow-subtle)',
            }}
            className="lux-card"
          >
            <p
              style={{
                fontFamily: 'var(--font-hindi)',
                fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}
            >
              {weddingData.ganeshBlessing.shloka}
            </p>
          </div>

          {/* Hindi Meaning */}
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '0.98rem',
              color: 'var(--text-body)',
              lineHeight: 1.8,
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            "{weddingData.ganeshBlessing.hindiText}"
          </p>
        </motion.div>
      </div>
    </section>
  );
};
