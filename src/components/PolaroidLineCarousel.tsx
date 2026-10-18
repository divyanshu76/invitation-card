import * as React from 'react';

export type LandPalette = 'dawn' | 'alpine' | 'dusk' | 'mist';

export type Slide = {
  image?: string;
  title?: string;
  caption?: string;
  alt?: string;
  palette?: LandPalette;
  seed?: number;
  objectPosition?: string;
};

export type PolaroidLineCarouselProps = {
  slides?: Slide[];
  /** Height of the hanging photo stage. Defaults to clamp(380px, 50vh, 480px). */
  stageHeight?: number | string;
  /** Alias for stageHeight for backwards compatibility. */
  height?: number | string;
  cardWidth?: number;
  sag?: number;
  swing?: number;
  autoplay?: number;
  string?: string;
  background?: string;
  ink?: string;
  onChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

export function stringY(x: number, w: number, y0: number, sag: number): number {
  const t = clamp(x / w, 0, 1);
  return y0 + 4 * sag * t * (1 - t);
}

export function springStep(x: number, v: number, target: number, dt: number, k = 70): [number, number] {
  const c = 2 * Math.sqrt(k);
  const nv = v + (k * (target - x) - c * v) * dt;
  return [x + nv * dt, nv];
}

export function swingStep(a: number, w: number, lineVel: number, dt: number, gain: number): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
  return [clamp(a + nw * dt, -0.32, 0.32), nw];
}

export function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

const PALETTES = {
  dawn: { top: '#e7b7a5', bottom: '#f8e8d6', sun: '#fff4df', far: '#d2b2bb', near: '#3a2a3b', mist: '255,240,232' },
  alpine: { top: '#7ea5c8', bottom: '#e3ecf2', sun: '#ffffff', far: '#a9bfd0', near: '#1c3044', mist: '236,244,250' },
  dusk: { top: '#2a2450', bottom: '#ef8d60', sun: '#ffd9a6', far: '#93607c', near: '#18121f', mist: '255,196,160' },
  mist: { top: '#c4d0cb', bottom: '#eef1ec', sun: '#ffffff', far: '#aebcb5', near: '#2c3a33', mist: '246,248,245' },
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexRgb(h: string): [number, number, number] {
  const v = parseInt(h.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mixRgb(a: string, b: string, t: number): string {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')';
}

function paintLandscape(seed: number, palette: LandPalette, w = 1600, h = 1000): string {
  if (typeof document === 'undefined') return '';
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) return '';
  const P = PALETTES[palette] ?? PALETTES.dawn;
  const r = mulberry32(seed * 104729 + 7);
  const sky = g.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, P.top);
  sky.addColorStop(1, P.bottom);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  const sx = w * (0.22 + r() * 0.56);
  const sy = h * (0.26 + r() * 0.16);
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45);
  halo.addColorStop(0, 'rgba(' + hexRgb(P.sun).join(',') + ',.85)');
  halo.addColorStop(0.08, 'rgba(' + hexRgb(P.sun).join(',') + ',.55)');
  halo.addColorStop(1, 'rgba(' + hexRgb(P.sun).join(',') + ',0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, w, h);
  const layers = 5;
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1);
    const base = h * (0.42 + k * 0.4);
    const amp = h * (0.07 + k * 0.1);
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2);
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8];
    const ridge = (x: number) => {
      const u = x / w;
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      );
    };
    const body = g.createLinearGradient(0, base - amp, 0, h);
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)));
    body.addColorStop(1, mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)));
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x));
    g.lineTo(w, h);
    g.closePath();
    g.fill();
  }
  return c.toDataURL('image/jpeg', 0.88);
}

function useSlideImages(slides: Slide[]): string[] {
  const key = slides.map((s) => s.image || (s.palette || 'dawn') + ':' + (s.seed ?? 1)).join('|');
  const [painted, setPainted] = React.useState(() => slides.map(() => ''));
  React.useEffect(() => {
    setPainted(slides.map((s, i) => (s.image ? '' : paintLandscape(s.seed ?? i + 1, s.palette || 'dawn'))));
  }, [key]);
  return slides.map((s, i) => s.image || painted[i] || '');
}

const PL_CSS = [
  '.pl-root{position:relative;width:100%;background:var(--pl-bg);color:var(--pl-ink);user-select:none;-webkit-user-select:none;outline:none;box-sizing:border-box}',
  '.pl-stage{position:relative;width:100%;overflow:hidden;touch-action:pan-y;cursor:grab}',
  '.pl-stage[data-drag="1"]{cursor:grabbing}',
  '.pl-root:focus-visible{box-shadow:inset 0 0 0 2px var(--pl-ink)}',
  '.pl-string{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}',
  '.pl-card{position:absolute;left:0;top:0;width:var(--pl-cw);transform-origin:50% 0;will-change:transform;cursor:inherit}',
  '.pl-print{position:relative;margin-top:8px;background:#fbfaf7;background-image:linear-gradient(180deg,#fdfcf9 0%,#f7f3ec 100%);padding:10px 10px 12px;box-shadow:0 1px 2px rgba(84,38,55,.08),0 4px 14px rgba(0,0,0,.10),0 22px 38px -16px rgba(84,38,55,.30);transition:transform .45s cubic-bezier(.2,.7,.2,1),filter .45s ease,box-shadow .45s ease;border-radius:2px}',
  '.pl-card[data-on="1"] .pl-print{box-shadow:0 1px 2px rgba(84,38,55,.08),0 8px 20px rgba(0,0,0,.12),0 30px 50px -18px rgba(84,38,55,.38)}',
  '.pl-card[data-on="0"] .pl-print{transform:scale(.88);filter:saturate(.78) brightness(.94)}',
  '.pl-shot{position:relative;aspect-ratio:3/4;overflow:hidden;background:#f5efe6;border-radius:1px;box-shadow:inset 0 0 0 1px rgba(84,38,55,.06)}',
  '.pl-shot::after{content:"";position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 38%),radial-gradient(ellipse at 50% 120%,rgba(84,38,55,.14),transparent 60%);pointer-events:none}',
  '.pl-shot img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:center 10%;display:block;pointer-events:none}',
  '.pl-note{height:38px;display:flex;align-items:center;justify-content:center;padding:4px 8px 0;font:italic 500 clamp(12.5px,1.2vw,15px)/1.2 var(--font-serif,ui-serif,Georgia,serif);color:#3b3833;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '.pl-peg{position:absolute;left:50%;top:-1px;width:12px;height:26px;margin-left:-6px;border-radius:2.5px 2.5px 3px 3px;background:linear-gradient(90deg,#a88647 0%,#e4d5bc 38%,#fff6e3 50%,#c4a36a 70%,#8f6f36 100%);box-shadow:0 2px 4px rgba(60,35,10,.35),0 6px 10px -4px rgba(60,35,10,.25),inset 0 1px 0 rgba(255,255,255,.5);z-index:2}',
  '.pl-peg::before{content:"";position:absolute;left:-2px;right:-2px;top:9px;height:5px;border-radius:2px;background:linear-gradient(90deg,#8f6f36,#e4d5bc 45%,#a88647);box-shadow:0 1px 2px rgba(60,35,10,.35)}',
  '.pl-peg::after{content:"";position:absolute;left:5px;top:16px;width:2px;height:7px;background:rgba(80,60,30,.4);border-radius:1px}',
  '.pl-info-bar{position:relative;width:100%;max-width:1200px;margin:18px auto 0;padding:0 clamp(20px,5vw,64px);display:flex;align-items:flex-end;justify-content:space-between;gap:clamp(16px,3vw,32px);box-sizing:border-box}',
  '.pl-cap{flex:1;min-width:0;max-width:620px}',
  '.pl-cap>*{display:block;animation:pl-in .55s cubic-bezier(.2,.8,.2,1) both}',
  '.pl-title{font:600 clamp(19px,2.3vw,27px)/1.2 var(--font-serif,ui-serif,Georgia,serif);color:var(--pl-ink);letter-spacing:0.02em}',
  '.pl-sub{margin-top:5px;font:400 clamp(13px,1.2vw,14.5px)/1.45 var(--font-sans,system-ui,sans-serif);color:var(--pl-muted)}',
  '.pl-nav-controls{display:flex;align-items:center;gap:clamp(12px,2vw,20px);flex-shrink:0}',
  '.pl-count{font:600 13px/1 var(--font-sans,system-ui,sans-serif);letter-spacing:.12em;color:var(--pl-muted);user-select:none;display:inline-flex;align-items:center}',
  '.pl-count b{color:var(--pl-ink);font-weight:700;font-size:15px}',
  '.pl-count-sep{opacity:.45;margin:0 5px}',
  '.pl-nav-buttons{display:flex;align-items:center;gap:10px}',
  '.pl-btn{appearance:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--pl-line);background:rgba(248,243,236,0.92);backdrop-filter:blur(8px);color:var(--pl-ink);display:grid;place-items:center;cursor:pointer;transition:all .25s ease;box-shadow:0 2px 8px rgba(84,38,55,0.08)}',
  '@media (hover:hover){.pl-btn:hover{background:var(--pl-ink);color:#F8F3EC;transform:scale(1.06);box-shadow:0 4px 14px rgba(84,38,55,0.2)}}',
  '.pl-btn:active{transform:scale(0.96)}',
  '.pl-btn:focus-visible{outline:2px solid var(--accent-gold,#C4A36A);outline-offset:3px}',
  '.pl-count b{font-family:var(--font-serif,Georgia,serif);font-size:18px}',
  '.pl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
  '@keyframes pl-in{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}',
  '@media (max-width:640px){',
  '  .pl-info-bar{flex-direction:column;align-items:center;text-align:center;gap:14px;margin-top:14px;padding:0 16px}',
  '  .pl-cap{max-width:100%;text-align:center}',
  '  .pl-title{font-size:1.32rem;line-height:1.25;white-space:normal}',
  '  .pl-sub{font-size:0.88rem;line-height:1.45;margin-top:5px;white-space:normal}',
  '  .pl-nav-controls{width:100%;justify-content:center;gap:18px}',
  '  .pl-btn{width:46px;height:46px}',
  '}',
  '@media (prefers-reduced-motion:reduce){.pl-cap>*{animation:none}.pl-print{transition:none}}',
].join('\n');

export default function PolaroidLineCarousel({
  slides = [],
  stageHeight,
  height,
  cardWidth = 250,
  sag = 32,
  swing = 0.85,
  autoplay = 4500,
  string: stringColor = '#C4A36A',
  background = 'var(--bg-warm-ivory, #F8F3EC)',
  ink = 'var(--text-primary, #542637)',
  onChange,
  className,
  style,
  ariaLabel = 'Image carousel',
}: PolaroidLineCarouselProps) {
  const effectiveStageHeight = stageHeight || height || 'clamp(380px, 50vh, 480px)';
  const n = slides.length;
  const srcs = useSlideImages(slides);
  const [active, setActive] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [size, setSize] = React.useState({ w: 1200, h: 480, cw: cardWidth });

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const shadowPathRef = React.useRef<SVGPathElement | null>(null);
  const cards = React.useRef<(HTMLDivElement | null)[]>([]);
  const sim = React.useRef({
    off: 0,
    vel: 0,
    target: 0,
    a: [] as number[],
    w: [] as number[],
  });
  const drag = React.useRef<null | {
    x: number;
    off: number;
    lx: number;
    lt: number;
    v: number;
    moved: boolean;
  }>(null);
  const lastTouch = React.useRef(0);
  const activeRef = React.useRef(0);
  const opts = React.useRef({ sag, swing });
  React.useEffect(() => {
    opts.current = { sag, swing };
  }, [sag, swing]);
  // Pause autoplay while the visitor is hovering or has keyboard focus inside the carousel
  const paused = React.useRef(false);

  // Calculate repeat count for a continuous seamless loop
  const repeatCount = n > 0 ? Math.max(3, Math.ceil(24 / n)) : 0;
  const items = React.useMemo(() => {
    if (n === 0) return [];
    const list: { slide: Slide; origIndex: number; id: number }[] = [];
    let id = 0;
    for (let r = 0; r < repeatCount; r++) {
      for (let i = 0; i < n; i++) {
        list.push({ slide: slides[i], origIndex: i, id: id++ });
      }
    }
    return list;
  }, [slides, n, repeatCount]);

  const spacing = size.cw * 1.08;
  const totalItems = items.length;
  const totalSpan = totalItems * spacing;

  // Infinite step function for Prev / Next
  const step = React.useCallback(
    (dir: number) => {
      lastTouch.current = performance.now();
      const currentStep = Math.round(sim.current.target / spacing);
      sim.current.target = (currentStep + dir) * spacing;
    },
    [spacing]
  );

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => {
      const r = stage.getBoundingClientRect();
      const isMobile = r.width < 640;
      // Largest card whose full Polaroid frame (photo + printed title strip + shadow)
      // still fits below the string inside the stage — prevents bottom-frame clipping
      // on short viewports. Mirrors the y0/sag/print metrics used in the frame loop.
      const y0 = Math.max(62, Math.round(r.height * 0.17));
      const sagEff = Math.min(sag, Math.round(r.height * 0.08));
      const maxByHeight = ((r.height - (y0 + sagEff - 6) - 68 - 6) * 3) / 4;
      const byWidth = isMobile
        ? Math.max(160, Math.min(215, r.width * 0.54))
        : Math.max(180, Math.min(cardWidth, r.width * 0.35, r.height * 0.55));
      const cw = Math.round(Math.max(140, Math.min(byWidth, maxByHeight)));
      setSize({ w: r.width, h: r.height, cw });
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [cardWidth, sag]);

  React.useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);

  // Main animation frame loop
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || totalItems === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let raf = 0;
    let prev = performance.now();
    const S = sim.current;

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const { w, h, cw } = size;

      // Baseline anchor point for the string inside stage
      const y0 = Math.max(62, Math.round(h * 0.17));
      const effectiveSag = Math.min(opts.current.sag, Math.round(h * 0.08));
      const d = drag.current;
      let lineVel: number;

      if (d && d.moved) {
        lineVel = d.v * 1000;
      } else {
        const before = S.off;
        [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt);
        lineVel = -(S.off - before) / Math.max(dt, 1e-3);
      }

      // Re-center offset without altering relative difference
      if (Math.abs(S.off) > totalSpan * 5) {
        const shifts = Math.floor(S.off / totalSpan);
        S.off -= shifts * totalSpan;
        S.target -= shifts * totalSpan;
        if (d) {
          d.off -= shifts * totalSpan;
        }
      }

      const o = opts.current;
      const g = reduce ? 0 : o.swing;

      for (let j = 0; j < totalItems; j++) {
        const el = cards.current[j];
        if (!el) continue;

        // Circular position mapped to [-totalSpan/2, totalSpan/2)
        let dx = ((j * spacing - S.off) % totalSpan + totalSpan) % totalSpan;
        if (dx > totalSpan / 2) {
          dx -= totalSpan;
        }
        const x = w / 2 + dx;

        // Cull cards that are off-screen
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';

        let a = S.a[j] || 0;
        let av = S.w[j] || 0;
        [a, av] = swingStep(a, av, lineVel, dt, g);
        if (g) a += Math.sin(now / 1300 + j * 1.7) * 0.0008 * g;
        S.a[j] = a;
        S.w[j] = av;

        const y = stringY(x, w, y0, effectiveSag) - 6;
        el.style.transform =
          'translate(' + (x - cw / 2).toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + a.toFixed(4) + 'rad)';

        const dist = Math.abs(dx);
        el.style.zIndex = String(Math.max(1, Math.round(100 - dist / 8)));
        el.setAttribute('data-on', dist < spacing * 0.5 ? '1' : '0');
      }

      const stringD = 'M0 ' + y0 + ' Q' + w / 2 + ' ' + (y0 + 2 * effectiveSag) + ' ' + w + ' ' + y0;
      pathRef.current?.setAttribute('d', stringD);
      shadowPathRef.current?.setAttribute('d', stringD);

      // Track active original slide index
      const activeStep = Math.round(S.off / spacing);
      const currentActive = ((activeStep % n) + n) % n;
      if (currentActive !== activeRef.current) {
        activeRef.current = currentActive;
        setActive(currentActive);
      }

      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });

    io.observe(stage);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, spacing, totalItems, totalSpan, n]);

  // Infinite Autoplay timer
  React.useEffect(() => {
    if (!autoplay || n < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => {
      if (document.hidden || paused.current || drag.current || performance.now() - lastTouch.current < autoplay) return;
      const currentStep = Math.round(sim.current.target / spacing);
      sim.current.target = (currentStep + 1) * spacing;
    }, autoplay);
    return () => window.clearInterval(t);
  }, [autoplay, n, spacing]);

  const onDown = (e: React.PointerEvent) => {
    lastTouch.current = performance.now();
    drag.current = {
      x: e.clientX,
      off: sim.current.off,
      lx: e.clientX,
      lt: e.timeStamp,
      v: 0,
      moved: false,
    };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lt);
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v;
    d.lx = e.clientX;
    d.lt = e.timeStamp;
    sim.current.off = d.off - dx;
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!d) return;
    if (d.moved) {
      setDragging(false);
      try {
        stageRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
      sim.current.vel = -d.v * 1000;
      const projectedOff = sim.current.off - d.v * 180;
      const targetStep = Math.round(projectedOff / spacing);
      sim.current.target = targetStep * spacing;
      return;
    }

    // Direct click on a card to bring it into center
    const cardEl = (e.target as HTMLElement).closest('.pl-card') as HTMLElement | null;
    if (cardEl && stageRef.current) {
      const stageRect = stageRef.current.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2 - stageRect.left;
      const offsetFromCenter = cardCenterX - size.w / 2;
      const stepsAway = Math.round(offsetFromCenter / spacing);
      if (stepsAway !== 0) {
        const currentStep = Math.round(sim.current.target / spacing);
        sim.current.target = (currentStep + stepsAway) * spacing;
      }
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else return;
    e.preventDefault();
  };

  if (n === 0) return null;

  const s = slides[active] || {};

  return (
    <div
      ref={rootRef}
      className={['pl-root', className].filter(Boolean).join(' ')}
      style={{
        ['--pl-bg' as string]: background,
        ['--pl-ink' as string]: ink,
        ['--pl-muted' as string]: 'color-mix(in srgb, var(--pl-ink) 55%, transparent)',
        ['--pl-line' as string]: 'color-mix(in srgb, var(--pl-ink) 18%, transparent)',
        ...style,
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
      onFocus={() => {
        paused.current = true;
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) paused.current = false;
      }}
    >
      <style>{PL_CSS}</style>

      {/* 1. Hanging Photo Carousel Stage */}
      <div
        ref={stageRef}
        className="pl-stage"
        data-drag={dragging ? '1' : '0'}
        style={{
          height: effectiveStageHeight,
          ['--pl-cw' as string]: size.cw + 'px',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <svg className="pl-string" aria-hidden="true">
          <path ref={shadowPathRef} fill="none" stroke="rgba(84,38,55,0.12)" strokeWidth="2.5" transform="translate(0 3)" />
          <path ref={pathRef} fill="none" stroke={stringColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {items.map((item, j) => {
          const origSrc = srcs[item.origIndex];
          const isCenter = item.origIndex === active;
          const pos = item.slide.objectPosition || 'center 10%';
          return (
            <div
              key={item.id}
              className="pl-card"
              data-id={item.id}
              data-orig={item.origIndex}
              data-on={isCenter ? '1' : '0'}
              ref={(el) => void (cards.current[j] = el)}
              aria-hidden={isCenter ? undefined : true}
            >
              <div className="pl-print">
                <div className="pl-shot">
                  {origSrc ? (
                    <img
                      src={origSrc}
                      alt={item.slide.alt || item.slide.title || ''}
                      style={{ objectPosition: pos }}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <div className="pl-note">{item.slide.title || ''}</div>
              </div>
              <div className="pl-peg" />
            </div>
          );
        })}
      </div>

      {/* 2. Decoupled Caption & Controls Information Area (Below Carousel Stage) */}
      <div className="pl-info-bar">
        <div className="pl-cap" key={active} aria-hidden="true">
          {s.title ? <h3 className="pl-title">{s.title}</h3> : null}
          {s.caption ? <p className="pl-sub">{s.caption}</p> : null}
        </div>

        <div className="pl-nav-controls">
          <span className="pl-count" aria-hidden="true">
            <b>{pad2(active + 1)}</b>
            <span className="pl-count-sep">/</span>
            <span>{pad2(n)}</span>
          </span>
          <div className="pl-nav-buttons">
            <button type="button" className="pl-btn" aria-label="Previous photo" onClick={() => step(-1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="pl-btn" aria-label="Next photo" onClick={() => step(1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="pl-sr" aria-live="polite">
        {'Photo ' + (active + 1) + ' of ' + n + (s.title ? ': ' + s.title : '')}
      </div>
    </div>
  );
}
