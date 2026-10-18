import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera } from 'lucide-react';
import PolaroidLineCarousel, { type Slide } from './PolaroidLineCarousel';
import { SectionDecor } from './decor/SectionDecor';

// Display copies are 760px WebP derivatives of the originals in /images/Image Carousel/
// (~1 MB total instead of ~11 MB); the originals are kept unchanged.
const MOMENT_SLIDES: Slide[] = [
  {
    image: '/images/Image Carousel/optimized/photo-1.webp',
    title: 'Cherished Smiles',
    caption: 'A gentle smile that started a beautiful lifetime journey.',
    alt: 'Vikash and Jyoti smiling together',
    objectPosition: 'center 12%',
  },
  {
    image: '/images/Image Carousel/optimized/photo-2.webp',
    title: 'Hand in Hand',
    caption: 'Stepping forward with love, trust, and shared dreams.',
    alt: 'Vikash and Jyoti holding hands',
    objectPosition: 'center 15%',
  },
  {
    image: '/images/Image Carousel/optimized/photo-3.webp',
    title: 'Timeless Grace',
    caption: 'Moments frozen in time, filled with warmth and quiet joy.',
    alt: 'Vikash and Jyoti candid portrait',
    objectPosition: 'center 10%',
  },
  {
    image: '/images/Image Carousel/optimized/photo-4.webp',
    title: 'Golden Radiance',
    caption: 'Two souls reflecting each other’s light and laughter.',
    alt: 'Vikash and Jyoti golden hour portrait',
    objectPosition: 'center 8%',
  },
  {
    image: '/images/Image Carousel/optimized/photo-5.webp',
    title: 'Endless Togetherness',
    caption: 'Blessed by elders, cheered by loved ones, destined forever.',
    alt: 'Vikash and Jyoti joyous celebration',
    objectPosition: 'center 8%',
  },
  {
    image: '/images/Image Carousel/optimized/photo-6.webp',
    title: 'The Beginning of Always',
    caption: 'Writing the first page of our most enchanting story.',
    alt: 'Vikash and Jyoti romantic portrait',
    objectPosition: 'center 10%',
  },
];

export const OurMoments: React.FC = () => {
  return (
    <section
      id="moments"
      style={{
        position: 'relative',
        padding: '100px 0 60px',
        scrollMarginTop: '80px',
        backgroundColor: 'var(--bg-warm-ivory)',
        borderTop: '1px solid rgba(196, 163, 106, 0.25)',
        borderBottom: '1px solid rgba(196, 163, 106, 0.25)',
        overflow: 'hidden',
      }}
      aria-label="Our Cherished Moments - Photo Carousel"
    >
      <SectionDecor variant="moments" />

      <div className="container" style={{ marginBottom: '20px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(196, 163, 106, 0.12)',
              border: '1px solid rgba(196, 163, 106, 0.3)',
              marginBottom: '12px',
            }}
          >
            <Camera size={14} style={{ color: 'var(--accent-gold)' }} />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
              }}
            >
              Captured Memories
            </span>
            <Sparkles size={13} style={{ color: 'var(--accent-gold)' }} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Our Moments
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-hindi)',
              fontSize: '1.25rem',
              color: 'var(--accent-gold)',
              marginBottom: '12px',
            }}
          >
            ॥ प्रेम, विश्वास और खुशियों के अनमोल पल ॥
          </p>

          {/* Ornamental Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: '0 auto 14px',
              maxWidth: '220px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--accent-gold))',
              }}
            />
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>✤</span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, var(--accent-gold), transparent)',
              }}
            />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            Instant snapshots pegged on a line of memories. Drag across the string, click any photo, or use the arrows to relive our sweetest times together.
          </p>
        </motion.div>
      </div>

      {/* Polaroid Hanging Line Carousel */}
      <div style={{ position: 'relative', width: '100%' }}>
        <PolaroidLineCarousel
          slides={MOMENT_SLIDES}
          stageHeight="clamp(400px, 52vh, 500px)"
          cardWidth={250}
          sag={32}
          swing={0.85}
          autoplay={4500}
          string="#C4A36A"
          background="transparent"
          ink="var(--text-primary)"
          ariaLabel="Vikash and Jyoti wedding photo gallery"
        />
      </div>
    </section>
  );
};

export default OurMoments;
