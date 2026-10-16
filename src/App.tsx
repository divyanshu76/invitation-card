import React, { useState } from 'react';
import { IntroEnvelope } from './components/IntroEnvelope';
import { ScrollProgress } from './components/ScrollProgress';
import { PetalBackground } from './components/PetalBackground';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { ScrollSequenceHero } from './components/ScrollSequenceHero';
import { Countdown } from './components/Countdown';
import { GaneshBlessing } from './components/GaneshBlessing';
import { CoupleStory } from './components/CoupleStory';
import { DivineBlessings } from './components/DivineBlessings';
import { Celebrations } from './components/Celebrations';
import { Timeline } from './components/Timeline';
import { VenueMap } from './components/VenueMap';
import { RSVPSection } from './components/RSVPSection';
import { ClosingSection } from './components/ClosingSection';

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="wedding-experience" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 0. Introductory Luxury Dark Burgundy Wedding Envelope (Appears on every initial visit / refresh) */}
      {!isUnlocked && (
        <IntroEnvelope onUnlock={() => setIsUnlocked(true)} />
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
        {/* 1. Cinematic Scroll-Animation Hero Section */}
        <ScrollSequenceHero isUnlocked={isUnlocked} />

        {/* 2. Live Wedding Countdown — Directly below Hero */}
        <Countdown />

        {/* 3. Auspicious Ganesh Blessing Invocation */}
        <GaneshBlessing />

        {/* 4. The Couple Story (The Beginning of Forever) */}
        <CoupleStory />

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
  );
};

export default App;
