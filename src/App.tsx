import React, { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { IntroEnvelope } from './components/IntroEnvelope';
import { ScrollProgress } from './components/ScrollProgress';
import { PetalBackground } from './components/PetalBackground';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { GaneshBlessing } from './components/GaneshBlessing';
import { CoupleStory } from './components/CoupleStory';
import { OurMoments } from './components/OurMoments';
import { DivineBlessings } from './components/DivineBlessings';
import { Celebrations } from './components/Celebrations';
import { Timeline } from './components/Timeline';
import { VenueMap } from './components/VenueMap';
import { RSVPSection } from './components/RSVPSection';
import { ClosingSection } from './components/ClosingSection';

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
      </main>

      {/* 10. Final Closing Section */}
      <ClosingSection />
    </div>
    </MotionConfig>
  );
};

export default App;
