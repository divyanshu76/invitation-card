import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import './ScrollSequenceHero.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 150;
const FRAME_DIGITS = 3;

// Format frame index 0..149 to URL path e.g. /frames/frame-001.jpg
const getFrameUrl = (index: number): string => {
  const pad = String(index + 1).padStart(FRAME_DIGITS, '0');
  return `/frames/frame-${pad}.jpg`;
};

interface ScrollSequenceHeroProps {
  isUnlocked?: boolean;
}

export const ScrollSequenceHero: React.FC<ScrollSequenceHeroProps> = ({ isUnlocked = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);

  // Animation & Frame tracking refs
  const targetProgressRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Progressive image caching
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const preloadingRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const isMountedRef = useRef(false);

  // Fallback to find nearest loaded frame to prevent any blank/black frame
  const getClosestLoadedFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetIndex));
    if (loadedRef.current[clamped] && imagesRef.current[clamped]) {
      return imagesRef.current[clamped];
    }

    // Search outwards in both directions
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const forward = clamped + offset;
      if (forward < TOTAL_FRAMES && loadedRef.current[forward] && imagesRef.current[forward]) {
        return imagesRef.current[forward];
      }
      const backward = clamped - offset;
      if (backward >= 0 && loadedRef.current[backward] && imagesRef.current[backward]) {
        return imagesRef.current[backward];
      }
    }

    return null;
  }, []);

  // Responsive image drawing math:
  // - Full-screen cover scale on both desktop and mobile:
  //   scale = Math.max(cw / iw, ch / ih) guarantees 100% viewport coverage
  //   with zero letterboxing, zero blank bands, and zero blurred duplicate backgrounds.
  // - Desktop & Landscape: Natural optical centering ((cw - dw)/2, (ch - dh)/2).
  // - Mobile Portrait: Horizontal focal point tuned to mobileFocalX = 0.475.
  //   Verified by inspecting actual 1280×720 source frames:
  //     Frame 001 (standing):  groom face ~42%, bride face ~54% → center ~48%
  //     Frame 075 (kneeling):  groom face ~35%, bride face ~57% → center ~46%
  //     Frame 150 (kneeling):  groom face ~40%, bride face ~57% → center ~48.5%
  //     Average across sequence: ~47.5% → mobileFocalX = 0.475
  //   At 390×844: scale=1.172, dw=1500px, visible src range 441–774px (both faces inside ✓)
  //   Previous value of 0.385 pointed at source X=493px which put the bride's face at 691px
  //   outside the 390px visible window — that was the root cause of her being cropped.
  const drawImageResponsive = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) => {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    // Reset canvas transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // High-quality bicubic canvas resampling to preserve full photographic sharpness
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear background with seamless luxury burgundy
    ctx.fillStyle = '#1F0A13';
    ctx.fillRect(0, 0, cw, ch);

    // Full-screen cover scale: fills canvas completely edge-to-edge and top-to-bottom
    const scale = Math.max(cw / iw, ch / ih);
    const dw = Math.round(iw * scale);
    const dh = Math.round(ih * scale);

    let dx: number;
    let dy: number;

    const isPortrait = ch > cw;
    if (isPortrait) {
      // Verified mobile focal point: combined center of Vikash & Jyoti across all frames
      // Frame 001 (standing): ~48% | Frame 075 (kneeling): ~46% | Frame 150: ~48.5%
      // 0.475 keeps both faces inside the visible window at every scroll position.
      const mobileFocalX = 0.475;
      const targetDx = Math.round(cw * 0.5 - dw * mobileFocalX);
      // Clamp dx so it never exposes empty canvas on left or right
      dx = Math.max(cw - dw, Math.min(0, targetDx));
      dy = Math.round((ch - dh) / 2);
    } else {
      // Landscape (desktop / mobile landscape): natural optical center
      dx = Math.round((cw - dw) / 2);
      dy = Math.round((ch - dh) / 2);
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Draw specific frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = getClosestLoadedFrame(frameIndex);
    if (img) {
      drawImageResponsive(ctx, img, canvas.width, canvas.height);
      lastDrawnFrameRef.current = frameIndex;
      lastDrawnImageRef.current = img;
    } else {
      ctx.fillStyle = '#1F0A13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [drawImageResponsive, getClosestLoadedFrame]);

  // Adjust canvas pixel buffer for crisp high-DPR screens without memory bloat
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Allow DPR up to 3 for native sharpness on high-density Retina/OLED mobile displays
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const targetW = Math.round((rect.width || window.innerWidth) * dpr);
    const targetH = Math.round((rect.height || window.innerHeight) * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      // Force immediate redraw on resize
      drawFrame(Math.round(currentFrameRef.current));
    }
  }, [drawFrame]);

  // Single frame preloader helper with off-thread asynchronous decoding
  const preloadSingleFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (imagesRef.current[index]) {
      return Promise.resolve(imagesRef.current[index]);
    }
    if (preloadingRef.current[index]) {
      return Promise.resolve(null);
    }
    preloadingRef.current[index] = true;

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = getFrameUrl(index);

      const finalize = () => {
        if (!isMountedRef.current) return resolve(null);
        imagesRef.current[index] = img;
        loadedRef.current[index] = true;
        preloadingRef.current[index] = false;

        // If this frame is the currently visible frame, or if current frame was using a fallback, redraw!
        const activeFrame = Math.round(currentFrameRef.current);
        if (index === activeFrame || index === 0 || lastDrawnImageRef.current !== img) {
          if (Math.abs(index - activeFrame) <= 1) {
            drawFrame(activeFrame);
          }
        }
        resolve(img);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(finalize).catch(finalize);
        } else {
          finalize();
        }
      };

      img.onerror = () => {
        // Fallback retry with PNG if JPG fails for any reason
        const pngImg = new Image();
        pngImg.decoding = 'async';
        const pad = String(index + 1).padStart(FRAME_DIGITS, '0');
        pngImg.src = `/frames/frame-${pad}.png`;

        pngImg.onload = () => {
          if (!isMountedRef.current) return resolve(null);
          imagesRef.current[index] = pngImg;
          loadedRef.current[index] = true;
          preloadingRef.current[index] = false;
          const activeFrame = Math.round(currentFrameRef.current);
          if (index === activeFrame || index === 0) {
            drawFrame(activeFrame);
          }
          resolve(pngImg);
        };
        pngImg.onerror = () => {
          preloadingRef.current[index] = false;
          resolve(null);
        };
      };
    });
  }, [drawFrame]);

  // Priority window preloader around active scroll index
  const preloadPriorityWindow = useCallback((centerIdx: number, radius = 10) => {
    const batch: number[] = [];
    for (let offset = 0; offset <= radius; offset++) {
      const forward = centerIdx + offset;
      if (forward < TOTAL_FRAMES && !loadedRef.current[forward] && !preloadingRef.current[forward]) {
        batch.push(forward);
      }
      if (offset > 0) {
        const backward = centerIdx - offset;
        if (backward >= 0 && !loadedRef.current[backward] && !preloadingRef.current[backward]) {
          batch.push(backward);
        }
      }
    }
    batch.slice(0, 8).forEach((idx) => preloadSingleFrame(idx));
  }, [preloadSingleFrame]);

  // Progressive preloading strategy
  useEffect(() => {
    isMountedRef.current = true;

    // 1. Load initial frame immediately
    preloadSingleFrame(0).then(() => {
      // 2. Load next 15 frames for immediate smooth scrolling
      const earlyBatch = Array.from({ length: 14 }, (_, i) => i + 1);
      Promise.all(earlyBatch.map((i) => preloadSingleFrame(i))).then(() => {
        // 3. Progressively load the remaining frames in small non-blocking chunks
        let nextChunkStart = 15;
        const CHUNK_SIZE = 8;

        const loadNextChunk = () => {
          if (!isMountedRef.current || nextChunkStart >= TOTAL_FRAMES) return;
          const chunk = [];
          for (let i = nextChunkStart; i < Math.min(TOTAL_FRAMES, nextChunkStart + CHUNK_SIZE); i++) {
            chunk.push(preloadSingleFrame(i));
          }
          nextChunkStart += CHUNK_SIZE;

          Promise.all(chunk).then(() => {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(loadNextChunk);
            } else {
              setTimeout(loadNextChunk, 40);
            }
          });
        };

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNextChunk);
        } else {
          setTimeout(loadNextChunk, 50);
        }
      });
    });

    return () => {
      isMountedRef.current = false;
    };
  }, [preloadSingleFrame]);

  // Setup GSAP ScrollTrigger and RAF Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial canvas sizing
    updateCanvasDimensions();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // GSAP Context to safeguard React Strict Mode mounting & clean unmounting
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        pin: stickyRef.current,
        pinSpacing: false,
        start: 'top top',
        end: 'bottom bottom',
        scrub: prefersReducedMotion ? false : 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetProgressRef.current = self.progress;
          const currentIdx = Math.round(self.progress * (TOTAL_FRAMES - 1));
          preloadPriorityWindow(currentIdx, 10);
        },
      });
    }, container);

    // Render loop using requestAnimationFrame with smooth interpolation (lerp)
    const tick = () => {
      const progress = targetProgressRef.current;
      const targetFrame = progress * (TOTAL_FRAMES - 1);

      if (prefersReducedMotion) {
        currentFrameRef.current = targetFrame;
      } else {
        const diff = targetFrame - currentFrameRef.current;
        if (Math.abs(diff) < 0.01) {
          currentFrameRef.current = targetFrame;
        } else {
          // Tuned 0.18 smoothing factor for silky responsive scrub
          currentFrameRef.current += diff * 0.18;
        }
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      const exactImg = imagesRef.current[frameToDraw];
      // Redraw if frame index changed OR if the exact image just loaded and replaced the fallback
      if (frameToDraw !== lastDrawnFrameRef.current || (exactImg && lastDrawnImageRef.current !== exactImg)) {
        drawFrame(frameToDraw);
      }

      // Update Phase 1: Intro Overlay visibility based on progress
      // Visible at progress 0, smoothly fades and drifts up by progress 0.18
      if (introOverlayRef.current) {
        if (progress <= 0.2) {
          const introOpacity = Math.max(0, 1 - progress / 0.16);
          const introTranslateY = -(progress / 0.16) * 30;
          introOverlayRef.current.style.opacity = String(introOpacity);
          introOverlayRef.current.style.transform = `translateY(${introTranslateY}px)`;
          introOverlayRef.current.style.pointerEvents = introOpacity > 0.1 ? 'auto' : 'none';
        } else {
          introOverlayRef.current.style.opacity = '0';
          introOverlayRef.current.style.pointerEvents = 'none';
        }
      }

      // Update Phase 2: Poetic Outro Overlay visibility
      // Emerges at progress 0.82, peak at 0.90..0.96, fades out before 1.0 to meet countdown
      if (outroOverlayRef.current) {
        if (progress >= 0.82 && progress <= 0.99) {
          let outroOpacity = 0;
          if (progress < 0.9) {
            outroOpacity = (progress - 0.82) / 0.08;
          } else if (progress <= 0.96) {
            outroOpacity = 1;
          } else {
            outroOpacity = Math.max(0, 1 - (progress - 0.96) / 0.03);
          }
          outroOverlayRef.current.style.opacity = String(outroOpacity);
          outroOverlayRef.current.style.transform = `translate(-50%, -50%) scale(${0.96 + outroOpacity * 0.04})`;
          outroOverlayRef.current.style.pointerEvents = outroOpacity > 0.1 ? 'auto' : 'none';
        } else {
          outroOverlayRef.current.style.opacity = '0';
          outroOverlayRef.current.style.pointerEvents = 'none';
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    // Resize handling with debounce
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        updateCanvasDimensions();
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
      ctx.revert();
    };
  }, [drawFrame, updateCanvasDimensions]);

  // Trigger ScrollTrigger refresh whenever envelope unlock state changes
  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => {
        updateCanvasDimensions();
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, updateCanvasDimensions]);

  const handleScrollToNextSection = () => {
    const countdownEl = document.getElementById('countdown-section');
    if (countdownEl) {
      countdownEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="scroll-sequence-container"
      aria-label="Cinematic Wedding Invitation Hero"
    >
      <div ref={stickyRef} className="scroll-sequence-sticky">
        {/* Full-bleed HTML5 Canvas */}
        <canvas ref={canvasRef} className="scroll-sequence-canvas" />

        {/* Cinematic Lighting Vignettes */}
        <div className="scroll-sequence-vignette-top" />
        <div className="scroll-sequence-vignette-bottom" />
        <div className="scroll-sequence-atmosphere" />

        {/* Content Overlays */}
        <div className="scroll-sequence-overlay">
          {/* Phase 1: Intro Wedding Typography (Progress 0.0 -> 0.18) */}
          <div ref={introOverlayRef} className="scroll-sequence-intro">
            <div className="scroll-sequence-intro-header">
              {/* Sacred Hindi Blessing */}
              <div className="scroll-sequence-blessing">
                {weddingData.weddingBlessing}
              </div>

              {/* Eyebrow */}
              <div className="scroll-sequence-eyebrow">
                {weddingData.eyebrow}
              </div>

              {/* Couple Names */}
              <h1
                className="scroll-sequence-title"
                aria-label={`${weddingData.groomName} and ${weddingData.brideName}`}
              >
                <span className="scroll-sequence-name">{weddingData.groomName}</span>
                <span className="scroll-sequence-heart" aria-hidden="true">♡</span>
                <span className="scroll-sequence-name">{weddingData.brideName}</span>
              </h1>

              {/* Ornamental Gold Divider */}
              <div className="scroll-sequence-divider">
                <div className="scroll-sequence-divider-line" />
                <span className="scroll-sequence-divider-icon">✤</span>
                <div className="scroll-sequence-divider-line right" />
              </div>

              {/* Date & Location Badge */}
              <div className="scroll-sequence-badge">
                <span className="scroll-sequence-date">20 NOVEMBER 2026</span>
                <span className="scroll-sequence-venue">MAU, UTTAR PRADESH</span>
              </div>
            </div>

            {/* Minimal Interactive Scroll Indicator */}
            <div
              className="scroll-sequence-hint"
              onClick={handleScrollToNextSection}
              role="button"
              tabIndex={0}
              aria-label="Scroll to experience invitation"
            >
              <span className="scroll-sequence-hint-text">SCROLL TO DISCOVER</span>
              <div className="scroll-sequence-pulse-icon">
                <ChevronDown size={18} color="var(--accent-gold)" />
              </div>
            </div>
          </div>

          {/* Phase 2: Poetic Outro Overlay (Progress 0.85 -> 0.98) */}
          <div ref={outroOverlayRef} className="scroll-sequence-outro" style={{ opacity: 0 }}>
            <p className="scroll-sequence-outro-quote">
              "{weddingData.subtitle}"
            </p>
            <p className="scroll-sequence-outro-hindi">
              {weddingData.hindiSubtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
