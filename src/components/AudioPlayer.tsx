import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, AlertCircle } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create single audio element
    const audio = new Audio();
    audio.src = weddingData.audio.sourceUrl;
    audio.loop = true;
    audio.volume = 0.38;
    audio.preload = 'metadata';

    audio.onplay = () => {
      setIsPlaying(true);
      setLoadError(false);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    let fallbackAttempted = false;
    audio.onerror = () => {
      // If primary path fails, try URL-safe fallback path
      if (!fallbackAttempted && weddingData.audio.fallbackUrl) {
        fallbackAttempted = true;
        audio.src = weddingData.audio.fallbackUrl;
        return;
      }
      setIsPlaying(false);
      setLoadError(true);
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setLoadError(false);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio play restricted or file unreadable:', err);
            setIsPlaying(false);
            setLoadError(true);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 5000);
          });
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(252, 250, 247, 0.94)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(196, 163, 106, 0.4)',
        borderRadius: '9999px',
        padding: '6px 14px 6px 8px',
        boxShadow: '0 10px 28px rgba(84, 38, 55, 0.12)',
        transition: 'all 0.3s ease',
      }}
      role="region"
      aria-label="Wedding Ambient Music Player"
    >
      {/* Play / Pause Toggle Button */}
      <button
        onClick={togglePlay}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? 'var(--text-primary)' : 'rgba(196, 163, 106, 0.18)',
          color: isPlaying ? '#FFFFFF' : 'var(--text-primary)',
          border: '1px solid rgba(196, 163, 106, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        title={isPlaying ? 'Pause wedding music' : 'Play peaceful wedding music'}
        aria-label={isPlaying ? 'Pause wedding music' : 'Play peaceful wedding music'}
      >
        <Music size={16} />
      </button>

      {/* Track Label */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          cursor: 'pointer',
        }}
        onClick={togglePlay}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}
        >
          {isPlaying ? 'Krishna Flute' : 'Devotional Music'}
        </span>
        <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
          {isPlaying ? (isMuted ? 'Muted' : 'Devotional Bansuri') : 'Click to play'}
        </span>
      </div>

      {/* Active Wave Bars & Mute Toggle */}
      {isPlaying && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
          {/* Animated sound bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
            <span
              style={{
                width: '2px',
                height: isMuted ? '4px' : '10px',
                backgroundColor: 'var(--accent-gold)',
                borderRadius: '1px',
                animation: isMuted ? 'none' : 'soundwave 1s ease-in-out infinite alternate',
              }}
            />
            <span
              style={{
                width: '2px',
                height: isMuted ? '4px' : '14px',
                backgroundColor: 'var(--accent-gold)',
                borderRadius: '1px',
                animation: isMuted ? 'none' : 'soundwave 1.4s ease-in-out 0.2s infinite alternate',
              }}
            />
            <span
              style={{
                width: '2px',
                height: isMuted ? '4px' : '8px',
                backgroundColor: 'var(--accent-gold)',
                borderRadius: '1px',
                animation: isMuted ? 'none' : 'soundwave 0.8s ease-in-out 0.4s infinite alternate',
              }}
            />
          </div>

          <button
            onClick={toggleMute}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-body)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '50%',
              transition: 'color 0.2s ease',
            }}
            aria-label={isMuted ? 'Unmute wedding music' : 'Mute wedding music'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      )}

      {/* Helpful Toast if Audio File Missing */}
      {loadError && showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '0',
            width: '260px',
            backgroundColor: 'var(--text-primary)',
            color: '#F8F3EC',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.72rem',
            lineHeight: 1.5,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <AlertCircle size={15} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Devotional flute track available in <code>public/audio/Krishna Flute.mp3</code>.</span>
        </div>
      )}

      <style>{`
        @keyframes soundwave {
          0% { height: 4px; }
          100% { height: 14px; }
        }
      `}</style>
    </div>
  );
};
