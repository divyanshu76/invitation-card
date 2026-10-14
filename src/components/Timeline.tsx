import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sparkles, Heart, Moon } from 'lucide-react';
import { weddingData, getWeekdayName, type Ceremony } from '../data/weddingData';

export const Timeline: React.FC = () => {
  const getIconForCeremony = (id: string) => {
    switch (id) {
      case 'haldi':
        return <Sun size={16} color="var(--haldi-gold)" />;
      case 'mehendi':
        return <Sparkles size={16} color="var(--mehendi-sage)" />;
      case 'wedding':
        return <Heart size={16} color="var(--wedding-wine)" fill="var(--wedding-wine)" />;
      case 'vidai':
        return <Moon size={16} color="var(--vidai-rose)" />;
      default:
        return <Sparkles size={16} color="var(--accent-gold)" />;
    }
  };

  return (
    <section
      id="timeline"
      style={{
        position: 'relative',
        padding: '100px 0',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(196, 163, 106, 0.25)',
        borderBottom: '1px solid rgba(196, 163, 106, 0.25)',
      }}
      aria-label="Wedding Itinerary Timeline"
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
            AT A GLANCE
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            THE WEDDING TIMELINE
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
              fontSize: '1.1rem',
              color: 'var(--accent-gold)',
              marginBottom: '6px',
            }}
          >
            "चार दिनों का पावन उत्सव"
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-accent)',
            }}
          >
            "A seamless progression of sacred moments, celebrations, and togetherness."
          </p>
        </motion.div>

        {/* Vertical Timeline Structure */}
        <div
          style={{
            position: 'relative',
            maxWidth: '780px',
            margin: '0 auto',
            padding: '20px 0',
          }}
        >
          {/* Animated Central Vertical Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: '40px',
              bottom: '40px',
              left: '50%',
              width: '1px',
              backgroundColor: 'rgba(196, 163, 106, 0.45)',
              transformOrigin: 'top',
              zIndex: 1,
            }}
            className="timeline-central-line"
          />

          {/* Milestones mapped directly from centralized ceremonies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative', zIndex: 2 }}>
            {weddingData.ceremonies.map((ceremony: Ceremony, index: number) => {
              const isEven = index % 2 === 0;
              const isHighlight = ceremony.id === 'wedding';
              const weekday = getWeekdayName(ceremony.dateStr);

              return (
                <motion.div
                  key={ceremony.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 60px 1fr',
                    alignItems: 'center',
                  }}
                  className="timeline-row"
                >
                  {/* Left Column */}
                  <div
                    style={{
                      textAlign: isEven ? 'right' : 'left',
                      paddingRight: isEven ? '24px' : '0',
                      paddingLeft: isEven ? '0' : '24px',
                      order: isEven ? 1 : 3,
                    }}
                    className={`timeline-content-col ${isEven ? 'timeline-left-col' : 'timeline-right-col'}`}
                  >
                    <div
                      style={{
                        padding: '20px 24px',
                        backgroundColor: isHighlight ? '#FCFAF7' : 'rgba(252, 250, 247, 0.8)',
                        border: isHighlight
                          ? '1.5px solid var(--accent-gold)'
                          : '1px solid rgba(196, 163, 106, 0.28)',
                        boxShadow: isHighlight
                          ? '0 6px 22px rgba(84, 38, 55, 0.08)'
                          : '0 4px 18px rgba(84, 38, 55, 0.04)',
                        display: 'inline-block',
                        maxWidth: '350px',
                        width: '100%',
                        textAlign: 'left',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: ceremony.accentColor,
                          }}
                        >
                          {ceremony.displayDate.toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {weekday}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.3rem',
                          color: 'var(--text-primary)',
                          marginBottom: '4px',
                        }}
                      >
                        {ceremony.name}
                      </h4>

                      {ceremony.hindiName && (
                        <span
                          style={{
                            fontFamily: 'var(--font-hindi)',
                            fontSize: '0.86rem',
                            color: 'var(--accent-gold)',
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          {ceremony.hindiName}
                        </span>
                      )}

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: ceremony.time ? 'normal' : 'italic' }}>
                        {ceremony.time || ceremony.timeGracefulLabel}
                      </p>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', marginTop: '4px', fontWeight: 500 }}>
                        📍 {ceremony.venueName}
                      </p>
                    </div>
                  </div>

                  {/* Central Node */}
                  <div
                    style={{
                      order: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="timeline-node-col"
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#FCFAF7',
                        border: `1.5px solid ${ceremony.accentColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(84, 38, 55, 0.08)',
                      }}
                    >
                      {getIconForCeremony(ceremony.id)}
                    </div>
                  </div>

                  {/* Empty Counterpart Column for Balance */}
                  <div
                    style={{
                      order: isEven ? 3 : 1,
                    }}
                    className="timeline-empty-col"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .timeline-central-line {
            left: 20px !important;
          }
          .timeline-row {
            grid-template-columns: 40px 1fr !important;
          }
          .timeline-node-col {
            order: 1 !important;
            justify-content: flex-start !important;
          }
          .timeline-content-col {
            order: 2 !important;
            padding-left: 14px !important;
            padding-right: 0 !important;
            text-align: left !important;
          }
          .timeline-empty-col {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
