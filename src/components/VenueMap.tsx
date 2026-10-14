import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export const VenueMap: React.FC = () => {
  return (
    <section
      id="venue"
      style={{
        position: 'relative',
        padding: '110px 0',
        backgroundColor: 'var(--bg-warm-ivory)',
      }}
      aria-label="Wedding Venue and Location Map"
    >
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}
        >
          <span className="eyebrow" style={{ marginBottom: '10px' }}>
            THE CELEBRATION VENUE
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            MEET US WHERE THE MAGIC HAPPENS
          </h2>
          <div
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--accent-gold)',
              margin: '0 auto 16px',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.15rem',
              color: 'var(--accent-gold)',
              marginBottom: '4px',
            }}
          >
            "मौर्य पैलेस, मऊ — आपके आगमन की प्रतीक्षा में"
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-accent)',
            }}
          >
            "A warm and welcoming destination to celebrate our sacred union."
          </p>
        </motion.div>

        {/* Two-Column Composition on Desktop, Stacked on Mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '40px',
            alignItems: 'center',
          }}
          className="venue-composition"
        >
          {/* Left Column: Venue Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              gridColumn: 'span 6',
              padding: '40px 34px',
              backgroundColor: 'rgba(252, 250, 247, 0.92)',
              border: '1px solid rgba(196, 163, 106, 0.35)',
              boxShadow: 'var(--shadow-editorial)',
              borderRadius: 'var(--radius-lg)',
            }}
            className="venue-info-box"
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Official Venue
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)',
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                marginBottom: '8px',
              }}
            >
              {weddingData.venue.name}
            </h3>

            {/* Facilities / Description Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                backgroundColor: 'rgba(241, 232, 222, 0.75)',
                border: '1px solid rgba(196, 163, 106, 0.25)',
                borderRadius: '9999px',
                marginBottom: '24px',
              }}
            >
              <Sparkles size={12} color="var(--accent-gold)" />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.74rem',
                  color: 'var(--text-accent)',
                  fontWeight: 500,
                }}
              >
                {weddingData.venue.description}
              </span>
            </div>

            {/* Address Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
              {/* Hindi & English Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '3px' }}>
                  <MapPin size={18} color="var(--accent-gold)" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    पता (Address)
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-hindi)',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                      marginBottom: '3px',
                      fontWeight: 500,
                    }}
                  >
                    {weddingData.venue.addressHindi}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                    {weddingData.venue.addressEnglish}
                  </p>
                </div>
              </div>

              {/* Functional Click-to-call Contact Numbers */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '3px' }}>
                  <Phone size={18} color="var(--accent-gold)" />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Venue Contact Details
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {weddingData.venue.contacts.map((contact) => (
                      <div key={contact.phone} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {contact.name} ({contact.role}):
                        </span>
                        <a
                          href={`tel:${contact.phone}`}
                          style={{
                            fontSize: '0.86rem',
                            color: 'var(--text-accent)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            padding: '4px 10px',
                            backgroundColor: 'rgba(196, 163, 106, 0.12)',
                            borderRadius: 'var(--radius-xs)',
                            transition: 'all 0.2s ease',
                          }}
                          className="phone-link"
                          title={`Call ${contact.name}`}
                        >
                          📞 {contact.formattedPhone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Directions Button */}
            <div>
              <a
                href={weddingData.venue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%',
                }}
              >
                <Navigation size={15} />
                GET DIRECTIONS ↗
              </a>
            </div>
          </motion.div>

          {/* Right Column: Real Compact Embedded Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              gridColumn: 'span 6',
              height: '100%',
              minHeight: '440px',
            }}
            className="venue-map-col"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '440px',
                border: '1px solid rgba(196, 163, 106, 0.45)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-editorial)',
                backgroundColor: '#FCFAF7',
              }}
            >
              {/* Real interactive Google Maps iframe */}
              <iframe
                title="Venue Location Map - Maurya Palace Mau"
                src={weddingData.venue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: '440px',
                  display: 'block',
                  filter: 'sepia(6%) contrast(98%)',
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              {/* Top Floating Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(252, 250, 247, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '2px',
                  border: '1px solid rgba(196, 163, 106, 0.3)',
                  boxShadow: '0 4px 12px rgba(84, 38, 55, 0.08)',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                  }}
                >
                  📍 Interactive Map · Mau, UP
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .venue-info-box, .venue-map-col {
            grid-column: span 12 !important;
          }
          .venue-map-col {
            min-height: 360px !important;
          }
        }
        .phone-link:hover {
          background-color: var(--text-primary) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </section>
  );
};
