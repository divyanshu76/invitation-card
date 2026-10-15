import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export const ClosingSection: React.FC = () => {
  return (
    <footer
      style={{
        position: 'relative',
        padding: '120px 0 80px',
        backgroundColor: 'var(--bg-warm-ivory)',
        textAlign: 'center',
        overflow: 'hidden',
        borderTop: '1px solid rgba(196, 163, 106, 0.25)',
      }}
      aria-label="Wedding Closing and Family Regards"
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '780px', margin: '0 auto' }}
        >
          {/* Top Delicate Floral Motif */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              margin: '0 auto 36px',
              maxWidth: '300px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-gold))' }} />
            <span style={{ color: 'var(--accent-gold)', fontSize: '1rem' }}>❦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)' }} />
          </div>

          {/* Hindi Inscription */}
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.05rem',
              color: 'var(--accent-gold)',
              letterSpacing: '0.12em',
              marginBottom: '16px',
            }}
          >
            ॥ सदा सुमंगलम् भवतु ॥
          </p>

          {/* Couple Closing Typography: VIKASH ♡ JYOTI */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 6.5vw, 4.4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              textTransform: 'uppercase',
            }}
          >
            <span>{weddingData.groomName}</span>
            <span style={{ color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center' }}>
              <Heart size={28} fill="var(--accent-gold)" />
            </span>
            <span>{weddingData.brideName}</span>
          </h2>

          {/* Romantic Quote */}
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
              color: 'var(--text-accent)',
              marginBottom: '10px',
            }}
          >
            "{weddingData.closingQuote}"
          </p>

          {/* Hindi Closing */}
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)',
              color: 'var(--text-primary)',
              marginBottom: '32px',
            }}
          >
            "{weddingData.hindiClosing}"
          </p>

          {/* Family Sign-off Note */}
          <div
            style={{
              padding: '24px 36px',
              background: 'rgba(252, 250, 247, 0.85)',
              border: '1px solid rgba(196, 163, 106, 0.35)',
              borderRadius: 'var(--radius-md)',
              display: 'inline-block',
              margin: '0 auto 36px',
              boxShadow: 'var(--shadow-subtle)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.15rem',
                color: 'var(--text-accent)',
              }}
            >
              {weddingData.closingFamilyNote}
            </p>
          </div>

          {/* Fine divider */}
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'var(--accent-gold)',
              margin: '0 auto 24px',
              opacity: 0.5,
            }}
          />

          {/* Venue & Date */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.74rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Maurya Palace · {weddingData.cityLocation} · {weddingData.formattedWeddingDate}
          </p>

          {/* Footer Credit */}
          <div
            style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(196, 163, 106, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.70rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                opacity: 0.7,
              }}
            >
              Created with ♥ by DeadCode Labs
            </p>
            <a
              href="https://deadcode.space"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                color: 'var(--accent-gold)',
                opacity: 0.65,
                textDecoration: 'none',
                transition: 'opacity 0.25s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.65')}
            >
              ↗ deadcode.space
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
