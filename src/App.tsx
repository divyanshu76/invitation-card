import React, { Suspense, lazy, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { IntroEnvelope } from './components/IntroEnvelope';
import { ScrollProgress } from './components/ScrollProgress';
import { PetalBackground } from './components/PetalBackground';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';

// Below-the-fold scenes load as separate chunks right after first paint,
// keeping the envelope + hero bundle small. They start downloading immediately,
// so in-page navigation targets exist long before a visitor can reach them.
const GaneshBlessing = lazy(() => import('./components/GaneshBlessing').then((m) => ({ default: m.GaneshBlessing })));
const CoupleStory = lazy(() => import('./components/CoupleStory').then((m) => ({ default: m.CoupleStory })));
const OurMoments = lazy(() => import('./components/OurMoments').then((m) => ({ default: m.OurMoments })));
const DivineBlessings = lazy(() => import('./components/DivineBlessings').then((m) => ({ default: m.DivineBlessings })));
const Celebrations = lazy(() => import('./components/Celebrations').then((m) => ({ default: m.Celebrations })));
const Timeline = lazy(() => import('./components/Timeline').then((m) => ({ default: m.Timeline })));
const VenueMap = lazy(() => import('./components/VenueMap').then((m) => ({ default: m.VenueMap })));
const RSVPSection = lazy(() => import('./components/RSVPSection').then((m) => ({ default: m.RSVPSection })));
const ClosingSection = lazy(() => import('./components/ClosingSection').then((m) => ({ default: m.ClosingSection })));

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <div className="wedding-experience" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 0. Introductory Luxury Dark Burgundy Wedding Envelope (Appears on every initial visit / refresh) */}
      {!isIntroDone && (
        <IntroEnvelope onUnlock={() => setIsUnlocked(true)} onComplete={() => setIsIntroDone(true)} />
      )}

      {/* Subtle Paper Texture Overlay */}
      <div className="paper-texture-overlay" />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Floating Rose & Lotus Petal Animation */}
      <PetalBackground />

      {/* Royal Sitar & Shehnai Ambient Sound (Muted by default, user-controlled) */}
      <AudioPlayer />

      {/* Dynamic Navigation Bar */}
      <Navbar />

      <main>
        {/* 1. Cinematic Hero Section */}
        <Hero revealed={isUnlocked} />

        {/* 2. Live Wedding Countdown — Directly below Hero */}
        <Countdown />

        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
        {/* 3. Auspicious Ganesh Blessing Invocation */}
        <GaneshBlessing />

        {/* 4. The Couple Story (The Beginning of Forever) */}
        <CoupleStory />

        {/* 4.5. Our Moments — Polaroid Hanging Line Carousel */}
        <OurMoments />

        {/* 5. Divine Blessings (Lord Shiva & Goddess Parvati) */}
        <DivineBlessings />

        {/* 6. The Celebrations (Haldi, Mehendi, Wedding, Vidai) */}
        <Celebrations />

        {/* 7. Wedding Timeline */}
        <Timeline />

        {/* 8. Venue Section with Real Mini Map */}
        <VenueMap />

        {/* 9. RSVP Experience & Live Wishes Wall */}
        <RSVPSection />

        </Suspense>
      </main>

      {/* 10. Final Closing Section */}
      <Suspense fallback={null}>
        <ClosingSection />
      </Suspense>
    </div>
    </MotionConfig>
  );
};

export default App;
