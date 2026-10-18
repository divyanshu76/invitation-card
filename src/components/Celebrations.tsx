import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Navigation } from 'lucide-react';
import { weddingData, getWeekdayName, type Ceremony } from '../data/weddingData';
import { SectionDecor } from './decor/SectionDecor';

export const Celebrations: React.FC = () => {
  return (
    <section
      id="celebrations"
      style={{
        position: 'relative',
        padding: '110px 0',
        backgroundColor: 'var(--bg-warm-ivory)',
      }}
      aria-label="Wedding Celebrations and Ceremonies"
    >
      <SectionDecor variant="celebrations" />

      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 70px' }}
        >
          <span className="eyebrow" style={{ marginBottom: '10px' }}>
            AUSPICIOUS OCCASIONS
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            THE CELEBRATIONS
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
              marginBottom: '6px',
            }}
          >
            "मंगल अवसर, पावन रस्में और अपनों का साथ"
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-accent)',
            }}
          >
            "Four cherished milestones celebrating love, tradition, and togetherness."
          </p>
        </motion.div>

        {/* Ceremonies List - Asymmetrical Alternating Editorial Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {weddingData.ceremonies.map((ceremony: Ceremony, index: number) => {
            const isEven = index % 2 === 0;
            const isWeddingHighlight = ceremony.id === 'wedding';
            const weekday = getWeekdayName(ceremony.dateStr);

            return (
              <motion.article
                key={ceremony.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'relative',
                  padding: isWeddingHighlight ? '48px 36px' : '36px 28px',
                  backgroundColor: isWeddingHighlight ? 'rgba(252, 250, 247, 0.95)' : 'rgba(252, 250, 247, 0.8)',
                  border: isWeddingHighlight
                    ? '2px solid rgba(196, 163, 106, 0.55)'
                    : '1px solid rgba(196, 163, 106, 0.3)',
                  boxShadow: isWeddingHighlight ? 'var(--shadow-elevated)' : 'var(--shadow-editorial)',
                  borderRadius: 'var(--radius-lg)',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'visible',
                  transition: 'transform 0.4s var(--ease-editorial), box-shadow 0.4s var(--ease-editorial)',
                }}
                className={`ceremony-card lux-card lux-edge ${isWeddingHighlight ? 'wedding-highlight-card' : ''}`}
              >
                {/* Visual Highlight Badge for the Wedding Night */}
                {isWeddingHighlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--text-primary)',
                      color: '#FFFFFF',
                      padding: '6px 22px',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 15px rgba(84, 38, 55, 0.25)',
                      zIndex: 15,
                      whiteSpace: 'nowrap',
                      maxWidth: 'calc(100% - 32px)',
                    }}
                  >
                    <Sparkles size={12} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                    <span>THE SACRED WEDDING CEREMONY</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '40px',
                    alignItems: 'center',
                  }}
                  className={`ceremony-grid ${isEven ? 'ceremony-normal' : 'ceremony-reverse'}`}
                >
                  {/* Image Column */}
                  <div
                    style={{
                      gridColumn: isEven ? 'span 6' : 'span 6',
                      order: isEven ? 1 : 2,
                    }}
                    className="ceremony-img-col"
                  >
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(196, 163, 106, 0.3)',
                        boxShadow: '0 8px 24px rgba(84, 38, 55, 0.06)',
                      }}
                      className="ceremony-img-wrapper"
                    >
                      <img
                        src={ceremony.image}
                        alt={`${ceremony.name} celebration`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          aspectRatio: '4/3',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.6s var(--ease-editorial)',
                        }}
                        className="ceremony-photo"
                      />
                      {/* Subtle Tint Ribbon */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          backgroundColor: ceremony.accentColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div
                    style={{
                      gridColumn: isEven ? 'span 6' : 'span 6',
                      order: isEven ? 2 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                    className="ceremony-text-col"
                  >
                    {/* Badge & Hindi Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          color: ceremony.accentColor,
                        }}
                      >
                        {ceremony.badgeText}
                      </span>
                      {ceremony.hindiName && (
                        <span
                          style={{
                            fontFamily: 'var(--font-hindi)',
                            fontSize: '0.95rem',
                            color: 'var(--accent-gold)',
                            fontWeight: 500,
                          }}
                        >
                          {ceremony.hindiName}
                        </span>
                      )}
                    </div>

                    {/* Ceremony Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: isWeddingHighlight
                          ? 'clamp(1.9rem, 4vw, 2.7rem)'
                          : 'clamp(1.7rem, 3.5vw, 2.3rem)',
                        color: 'var(--text-primary)',
                        lineHeight: 1.15,
                      }}
                    >
                      {ceremony.name}
                    </h3>

                    {/* English Tagline */}
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontSize: '1.1rem',
                        color: ceremony.accentColor,
                        marginTop: '-4px',
                      }}
                    >
                      "{ceremony.tagline}"
                    </p>

                    {/* Hindi Supporting Text */}
                    {ceremony.hindiTagline && (
                      <p
                        style={{
                          fontFamily: 'var(--font-hindi)',
                          fontSize: '0.92rem',
                          color: 'var(--text-body)',
                          marginTop: '-4px',
                        }}
                      >
                        {ceremony.hindiTagline}
                      </p>
                    )}

                    {/* Details Box */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        padding: '18px',
                        backgroundColor: 'rgba(241, 232, 222, 0.45)',
                        borderLeft: `3px solid ${ceremony.accentColor}`,
                        borderRadius: 'var(--radius-sm)',
                        margin: '6px 0',
                      }}
                      className="ceremony-details-box"
                    >
                      <div className="ceremony-detail-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={15} color={ceremony.accentColor} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {weekday}, {ceremony.displayDate}
                        </span>
                      </div>
                      <div className="ceremony-detail-item ceremony-detail-venue" style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
                        <MapPin size={15} color={ceremony.accentColor} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {ceremony.venueName} · {ceremony.venueAddress}
                        </span>
                      </div>
                    </div>

                    {/* Baraat Departure Announcement Card (20 November Wedding Only) */}
                    {ceremony.baraatAnnouncement && (
                      <div
                        style={{
                          margin: '10px 0 6px',
                          padding: '16px 20px',
                          backgroundColor: '#FAF3F5',
                          border: '1.5px solid rgba(196, 163, 106, 0.45)',
                          borderLeft: '4px solid var(--wedding-wine)',
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: '0 4px 16px rgba(112, 45, 67, 0.08)',
                        }}
                        className="baraat-departure-card"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Sparkles size={15} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              color: 'var(--wedding-wine)',
                            }}
                          >
                            BARAAT DEPARTURE · बारात प्रस्थान
                          </span>
                        </div>

                        {/* Hindi Announcement (Prominent) */}
                        <p
                          style={{
                            fontFamily: 'var(--font-hindi)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            lineHeight: 1.55,
                            marginBottom: '6px',
                          }}
                        >
                          बारात मेरे निजी निवास छितौनी · मालीपुर के पास, बेल्थरा रोड से{' '}
                          <span
                            style={{
                              color: 'var(--wedding-wine)',
                              fontWeight: 700,
                              backgroundColor: 'rgba(196, 163, 106, 0.22)',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              display: 'inline-block',
                            }}
                          >
                            शाम 4 बजे
                          </span>{' '}
                          मऊ के लिए प्रस्थान करेगी।
                        </p>

                        {/* English Translation */}
                        <p
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.86rem',
                            color: 'var(--text-body)',
                            lineHeight: 1.5,
                          }}
                        >
                          The wedding procession (Baraat) will depart for Mau at{' '}
                          <strong
                            style={{
                              color: 'var(--wedding-wine)',
                              fontWeight: 700,
                              backgroundColor: 'rgba(196, 163, 106, 0.22)',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              display: 'inline-block',
                            }}
                          >
                            4:00 PM
                          </strong>{' '}
                          from my residence in Chhitauni, near Malipur, Belthara Road.
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-body)' }}>
                      {ceremony.description}
                    </p>

                    {/* Directions Link Button */}
                    <div style={{ marginTop: '6px' }}>
                      <a
                        href={ceremony.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{
                          padding: '10px 18px',
                          fontSize: '0.72rem',
                          borderColor: 'rgba(196, 163, 106, 0.45)',
                        }}
                      >
                        <Navigation size={13} />
                        Directions to Maurya Palace ↗
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ceremony-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            width: 100% !important;
          }
          .ceremony-img-col, .ceremony-text-col {
            grid-column: auto !important;
            order: initial !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .ceremony-img-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .ceremony-photo {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            aspect-ratio: 16 / 10 !important;
            object-fit: cover !important;
          }
          .ceremony-details-box {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            padding: 14px 12px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .ceremony-detail-item {
            width: 100% !important;
            grid-column: auto !important;
          }
        }
        .ceremony-img-wrapper:hover .ceremony-photo {
          transform: scale(1.03);
        }
      `}</style>
    </section>
  );
};
