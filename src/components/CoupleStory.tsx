import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { TiltCard } from './TiltCard';
import { SectionDecor } from './decor/SectionDecor';

export const CoupleStory: React.FC = () => {
  return (
    <section
      id="story"
      style={{
        position: 'relative',
        padding: '110px 0',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(196, 163, 106, 0.25)',
        borderBottom: '1px solid rgba(196, 163, 106, 0.25)',
        overflow: 'hidden',
      }}
      aria-label="The Beginning of Forever"
    >
      <SectionDecor variant="story" />

      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 50px' }}
        >
          <span className="eyebrow" style={{ marginBottom: '10px' }}>
            A SACRED UNION
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {weddingData.story.heading}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.2rem',
              color: 'var(--accent-gold)',
              marginBottom: '16px',
            }}
          >
            "{weddingData.story.hindiHeading}"
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: '0 auto 20px',
              maxWidth: '180px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-gold))' }} />
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem' }}>✤</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }} />
          </div>
        </motion.div>

        {/* Couple Names Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '740px',
            margin: '0 auto 60px',
            padding: '28px 24px',
            background: 'rgba(252, 250, 247, 0.9)',
            border: '1px solid rgba(196, 163, 106, 0.35)',
            boxShadow: 'var(--shadow-editorial)',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
          }}
          className="lux-card lux-edge"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
            className="story-names-row"
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4.5vw, 2.9rem)',
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              {weddingData.groomName}
            </span>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(196, 163, 106, 0.15)',
                color: 'var(--accent-gold)',
                border: '1px solid var(--accent-gold)',
              }}
            >
              <Heart size={16} fill="var(--accent-gold)" />
            </div>

            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4.5vw, 2.9rem)',
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              {weddingData.brideName}
            </span>
          </div>
        </motion.div>

        {/* Refined Editorial Composition: One Large Photo + Center Card + One Smaller Photo */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '32px',
            alignItems: 'center',
          }}
          className="story-editorial-layout"
        >
          {/* Large Main Wedding Photograph (Hands Detail) */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: 16 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              gridColumn: 'span 5',
              position: 'relative',
              transformPerspective: 1200,
            }}
            className="story-col-left"
          >
            <TiltCard max={4} style={{ borderRadius: 'var(--radius-lg)' }}>
            <div
              className="lux-card lux-card--layered"
              style={{
                position: 'relative',
                border: '1px solid rgba(196, 163, 106, 0.4)',
                padding: '14px',
                backgroundColor: '#FCFAF7',
                boxShadow: 'var(--shadow-editorial)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  borderRadius: 'calc(var(--radius-lg) - 6px)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={weddingData.story.images.hands}
                  alt="Sacred hands joined in sacred harmony"
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '3 / 4',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1.0)';
                  }}
                />
              </div>
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.92rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  "Two hands joined in sacred harmony."
                </span>
              </div>
            </div>
            </TiltCard>
          </motion.div>

          {/* Central Editorial Text Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              gridColumn: 'span 4',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '36px 28px',
              backgroundColor: 'rgba(252, 250, 247, 0.92)',
              border: '1px solid rgba(196, 163, 106, 0.4)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-editorial)',
              textAlign: 'center',
            }}
            className="story-col-center lux-card lux-edge"
          >
            <div style={{ margin: '0 auto' }}>
              <Sparkles size={22} color="var(--accent-gold)" />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                color: 'var(--text-primary)',
                lineHeight: 1.25,
                letterSpacing: '0.04em',
              }}
            >
              A Beautiful Beginning
            </h3>

            {/* Official English Copy */}
            <p
              style={{
                fontSize: '0.94rem',
                lineHeight: 1.75,
                color: 'var(--text-body)',
              }}
            >
              "{weddingData.story.supportingText}"
            </p>

            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--accent-gold)', margin: '0 auto' }} />

            {/* Official Hindi Copy */}
            <p
              style={{
                fontFamily: 'var(--font-hindi)',
                fontSize: '0.96rem',
                lineHeight: 1.8,
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              "{weddingData.story.hindiSupportingText}"
            </p>

            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--accent-gold)', margin: '0 auto' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--text-accent)',
                  fontWeight: 600,
                }}
              >
                Celebrations in Mau
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  color: 'var(--accent-gold)',
                  fontStyle: 'italic',
                }}
              >
                18th — 21st November 2026
              </span>
            </div>
          </motion.div>

          {/* Supporting Photograph (Varmala Ceremony Detail) */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: -16 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              gridColumn: 'span 3',
              position: 'relative',
              transformPerspective: 1200,
            }}
            className="story-col-right"
          >
            <TiltCard max={4} style={{ borderRadius: 'var(--radius-lg)' }}>
            <div
              className="lux-card lux-card--layered"
              style={{
                position: 'relative',
                border: '1px solid rgba(196, 163, 106, 0.4)',
                padding: '10px',
                backgroundColor: '#FCFAF7',
                boxShadow: 'var(--shadow-editorial)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  borderRadius: 'calc(var(--radius-lg) - 6px)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={weddingData.story.images.varmala}
                  alt="Sacred varmala garland exchange during wedding"
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '3 / 4',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1.0)';
                  }}
                />
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.86rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  "Exchanging vows of lifelong love."
                </span>
              </div>
            </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .story-col-left, .story-col-center, .story-col-right {
            grid-column: span 12 !important;
          }
          .story-col-left {
            max-width: 420px;
            margin: 0 auto;
          }
          .story-col-right {
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};
