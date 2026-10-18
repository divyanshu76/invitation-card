import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';
import { SectionDecor } from './decor/SectionDecor';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = new Date(weddingData.weddingDateTime).getTime();
    const now = Date.now();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPassed: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const units = [
    { label: 'DAYS', hindiLabel: 'दिन', value: formatNumber(timeLeft.days) },
    { label: 'HOURS', hindiLabel: 'घंटे', value: formatNumber(timeLeft.hours) },
    { label: 'MINUTES', hindiLabel: 'मिनट', value: formatNumber(timeLeft.minutes) },
    { label: 'SECONDS', hindiLabel: 'सेकंड', value: formatNumber(timeLeft.seconds) },
  ];

  return (
    <section
      id="countdown-section"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '70px 0 90px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(196, 163, 106, 0.3)',
        borderBottom: '1px solid rgba(196, 163, 106, 0.3)',
      }}
      aria-label="Wedding Countdown"
    >
      <SectionDecor variant="countdown" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Section Eyebrow */}
          <span className="eyebrow" style={{ marginBottom: '8px' }}>
            A CELEBRATION IN TIME
          </span>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            COUNTING DOWN TO FOREVER
          </h2>

          {/* Hindi Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.05rem',
              color: 'var(--accent-gold)',
              marginBottom: '36px',
              letterSpacing: '0.06em',
            }}
          >
            उस खूबसूरत दिन तक...
          </p>

          {/* Countdown Display or Passed State */}
          {timeLeft.isPassed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '36px 28px',
                background: 'rgba(252, 250, 247, 0.85)',
                border: '1px solid rgba(196, 163, 106, 0.4)',
                borderRadius: '2px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                The Celebration Has Begun
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.2rem',
                  color: 'var(--accent-gold)',
                }}
              >
                "Forever starts now."
              </p>
            </motion.div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                background: 'rgba(252, 250, 247, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(196, 163, 106, 0.35)',
                boxShadow: 'var(--shadow-editorial)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 16px',
              }}
              className="countdown-grid lux-card lux-edge"
            >
              {units.map((unit, index) => (
                <div
                  key={unit.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight:
                      index < units.length - 1 ? '1px solid rgba(196, 163, 106, 0.3)' : 'none',
                    padding: '8px 12px',
                  }}
                  className="countdown-unit-box"
                >
                  {/* Large Serif Numeral */}
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(2.4rem, 6.2vw, 4.4rem)',
                      fontWeight: 400,
                      lineHeight: 1,
                      color: 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em',
                      minWidth: '1.9ch',
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                  >
                    {unit.value}
                  </div>

                  {/* Unit Label */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      marginTop: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.22em',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {unit.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-hindi)',
                        fontSize: '0.75rem',
                        color: 'var(--accent-gold)',
                      }}
                    >
                      {unit.hindiLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timezone Note */}
          <div
            style={{
              marginTop: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Timezone: Indian Standard Time ({weddingData.weddingTimezone})
            </p>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 580px) {
          .countdown-grid {
            padding: 20px 6px !important;
          }
          .countdown-unit-box {
            padding: 4px 6px !important;
          }
        }
      `}</style>
    </section>
  );
};
