import React, { useId } from 'react';

/*
 * Hand-built SVG ornaments for the invitation's visual language.
 * All are decorative (aria-hidden), pointer-transparent and drawn in the
 * existing palette. Geometry is computed once at module load, so renders
 * are cheap and markup is deterministic.
 */

type OrnamentProps = { className?: string; style?: React.CSSProperties };

const GOLD = '#C4A36A';

/* ------------------------------------------------------------------ */
/* Marigold & jasmine toran — the garland strung over Indian doorways  */
/* ------------------------------------------------------------------ */

type Bead = { x: number; y: number; r: number; tone: number };

const TORAN_W = 1000;
const TORAN_SWAGS = 5;

function buildToran(): { beads: Bead[]; drops: { x: number; y: number }[]; leaves: { x: number; r: number }[] } {
  const beads: Bead[] = [];
  const drops: { x: number; y: number }[] = [];
  const leaves: { x: number; r: number }[] = [];
  const span = TORAN_W / TORAN_SWAGS;
  for (let s = 0; s < TORAN_SWAGS; s++) {
    const x0 = s * span;
    const x1 = x0 + span;
    const top = 14;
    const sag = 46;
    const count = 15;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      // Quadratic swag: P0 (x0,top) P1 (mid, top + 2*sag) P2 (x1, top)
      const mx = (x0 + x1) / 2;
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
      const y = (1 - t) * (1 - t) * top + 2 * (1 - t) * t * (top + 2 * sag) + t * t * top;
      const jasmine = i % 4 === 2;
      beads.push({ x, y, r: jasmine ? 6.2 : 9.4 - Math.abs(0.5 - t) * 3, tone: jasmine ? 3 : (i + s) % 3 });
    }
    drops.push({ x: x1, y: top });
    leaves.push({ x: x0 + span * 0.25, r: -18 }, { x: x0 + span * 0.75, r: 18 });
  }
  drops.pop();
  return { beads, drops, leaves };
}

const TORAN = buildToran();

export const MarigoldToran: React.FC<OrnamentProps & { bells?: boolean }> = ({ className, style, bells = true }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={['orn-toran', className].filter(Boolean).join(' ')}
      style={style}
      viewBox={`0 0 ${TORAN_W} 150`}
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`mg0${id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="55%" stopColor="#F0A23A" />
          <stop offset="100%" stopColor="#C2701C" />
        </radialGradient>
        <radialGradient id={`mg1${id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE8A3" />
          <stop offset="55%" stopColor="#F5C24E" />
          <stop offset="100%" stopColor="#C8922A" />
        </radialGradient>
        <radialGradient id={`mg2${id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F9B266" />
          <stop offset="55%" stopColor="#DE7F2C" />
          <stop offset="100%" stopColor="#A85A17" />
        </radialGradient>
        <radialGradient id={`mg3${id}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F6F0E4" />
          <stop offset="100%" stopColor="#D9CDB8" />
        </radialGradient>
        <linearGradient id={`bell${id}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#8F6F36" />
          <stop offset="45%" stopColor="#F1E4CF" />
          <stop offset="70%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#7A5C28" />
        </linearGradient>
      </defs>

      {/* Supporting cord */}
      <line x1="0" y1="12" x2={TORAN_W} y2="12" stroke="rgba(143,111,54,0.55)" strokeWidth="2" />

      {/* Mango leaves along the cord */}
      {TORAN.leaves.map((l, i) => (
        <path
          key={`l${i}`}
          d="M0 0 C 9 10, 9 30, 0 44 C -9 30, -9 10, 0 0 Z"
          transform={`translate(${l.x} 12) rotate(${l.r})`}
          fill="#6E8A57"
          stroke="#4E6B3E"
          strokeWidth="1"
          opacity="0.85"
        />
      ))}

      {/* Flower swags */}
      {TORAN.beads.map((b, i) => (
        <circle key={`b${i}`} cx={b.x} cy={b.y} r={b.r} fill={`url(#mg${b.tone}${id})`} />
      ))}

      {/* Hanging drops with brass bells */}
      {TORAN.drops.map((d, i) => (
        <g key={`d${i}`} className={bells ? 'orn-bell' : undefined} style={{ transformOrigin: `${d.x}px ${d.y}px`, animationDelay: `${i * 0.7}s` }}>
          <line x1={d.x} y1={d.y} x2={d.x} y2={d.y + 58} stroke="rgba(143,111,54,0.6)" strokeWidth="1.5" />
          <circle cx={d.x} cy={d.y + 22} r="7" fill={`url(#mg0${id})`} />
          <circle cx={d.x} cy={d.y + 38} r="5" fill={`url(#mg3${id})`} />
          {bells ? (
            <g transform={`translate(${d.x} ${d.y + 58})`}>
              <path d="M -11 22 C -11 6, -7 0, 0 0 C 7 0, 11 6, 11 22 L 14 26 L -14 26 Z" fill={`url(#bell${id})`} />
              <circle cx="0" cy="29" r="3.2" fill="#8F6F36" />
            </g>
          ) : (
            <circle cx={d.x} cy={d.y + 58} r="6" fill={`url(#mg1${id})`} />
          )}
        </g>
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Brass diya with a softly flickering flame                           */
/* ------------------------------------------------------------------ */

export const Diya: React.FC<OrnamentProps & { size?: number }> = ({ className, style, size = 56 }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={['orn-diya', className].filter(Boolean).join(' ')}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`brass${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1E4CF" />
          <stop offset="35%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#7A5C28" />
        </linearGradient>
        <radialGradient id={`flame${id}`} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#FFFBEA" />
          <stop offset="45%" stopColor="#FFD36B" />
          <stop offset="100%" stopColor="#F08A24" />
        </radialGradient>
        <radialGradient id={`halo${id}`}>
          <stop offset="0%" stopColor="rgba(255,214,130,0.55)" />
          <stop offset="100%" stopColor="rgba(255,214,130,0)" />
        </radialGradient>
      </defs>
      <circle className="orn-diya-halo" cx="40" cy="30" r="26" fill={`url(#halo${id})`} />
      <g className="orn-diya-flame" style={{ transformOrigin: '40px 44px' }}>
        <path d="M40 18 C 46 28, 47 36, 40 44 C 33 36, 34 28, 40 18 Z" fill={`url(#flame${id})`} />
        <path d="M40 30 C 42 35, 42 39, 40 43 C 38 39, 38 35, 40 30 Z" fill="#FFFDF4" opacity="0.9" />
      </g>
      {/* Bowl */}
      <path d="M12 46 C 16 62, 64 62, 68 46 C 60 50, 20 50, 12 46 Z" fill={`url(#brass${id})`} />
      <path d="M8 44 C 22 50, 58 50, 74 42 L 70 46 C 56 52, 24 52, 12 47 Z" fill="#8F6F36" opacity="0.65" />
      <ellipse cx="40" cy="47" rx="27" ry="3.5" fill="#5C3F16" opacity="0.35" />
      {/* Foot */}
      <path d="M32 59 L 48 59 L 52 66 L 28 66 Z" fill={`url(#brass${id})`} />
      <ellipse cx="40" cy="67" rx="15" ry="2.6" fill="#7A5C28" />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Cusped Mughal arch outline (stretches to any box)                   */
/* ------------------------------------------------------------------ */

export const ArchFrame: React.FC<OrnamentProps & { double?: boolean }> = ({ className, style, double = true }) => (
  <svg
    className={['orn-arch', className].filter(Boolean).join(' ')}
    style={style}
    viewBox="0 0 400 600"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M10 600 L10 210 C10 150 40 120 70 112 C 92 70 132 66 150 52 C 170 38 186 26 200 6 C 214 26 230 38 250 52 C 268 66 308 70 330 112 C 360 120 390 150 390 210 L390 600"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.4"
      vectorEffect="non-scaling-stroke"
    />
    {double && (
      <path
        d="M24 600 L24 214 C24 162 50 136 80 128 C 100 88 138 82 156 68 C 174 56 188 44 200 26 C 212 44 226 56 244 68 C 262 82 300 88 320 128 C 350 136 376 162 376 214 L376 600"
        fill="none"
        stroke={GOLD}
        strokeWidth="0.8"
        strokeOpacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
    )}
  </svg>
);

/* Small finial that crowns an arch */
export const ArchFinial: React.FC<OrnamentProps> = ({ className, style }) => (
  <svg className={className} style={style} width="34" height="40" viewBox="0 0 34 40" aria-hidden="true" focusable="false">
    <path d="M17 2 C 21 8, 24 12, 17 18 C 10 12, 13 8, 17 2 Z" fill={GOLD} />
    <circle cx="17" cy="24" r="4" fill="none" stroke={GOLD} strokeWidth="1.2" />
    <path d="M4 36 C 10 30, 24 30, 30 36" fill="none" stroke={GOLD} strokeWidth="1.2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Mandala line art                                                    */
/* ------------------------------------------------------------------ */

const ring = (n: number) => Array.from({ length: n }, (_, i) => (360 / n) * i);
const PETALS_OUTER = ring(16);
const PETALS_MID = ring(12);
const DOTS = ring(32);

export const Mandala: React.FC<OrnamentProps> = ({ className, style }) => (
  <svg
    className={['orn-mandala', className].filter(Boolean).join(' ')}
    style={style}
    viewBox="-100 -100 200 200"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none" stroke={GOLD} strokeWidth="0.6">
      <circle r="96" strokeOpacity="0.6" />
      <circle r="92" strokeOpacity="0.35" />
      {DOTS.map((a) => (
        <circle key={`d${a}`} r="1.3" cx="0" cy="-86" transform={`rotate(${a})`} fill={GOLD} stroke="none" opacity="0.7" />
      ))}
      {PETALS_OUTER.map((a) => (
        <path key={`o${a}`} d="M0 -80 C 10 -66, 10 -52, 0 -42 C -10 -52, -10 -66, 0 -80 Z" transform={`rotate(${a})`} />
      ))}
      <circle r="42" />
      {PETALS_MID.map((a) => (
        <path key={`m${a}`} d="M0 -40 C 7 -32, 7 -24, 0 -18 C -7 -24, -7 -32, 0 -40 Z" transform={`rotate(${a + 15})`} />
      ))}
      <circle r="18" />
      {PETALS_MID.map((a) => (
        <path key={`i${a}`} d="M0 -16 L 3 -8 L 0 -4 L -3 -8 Z" transform={`rotate(${a})`} fill={GOLD} fillOpacity="0.25" />
      ))}
      <circle r="3" fill={GOLD} />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Floral corner spray — roses, buds and leaves on a curling stem      */
/* ------------------------------------------------------------------ */

export const FloralCorner: React.FC<OrnamentProps & { flip?: 'x' | 'y' | 'xy' }> = ({ className, style, flip }) => {
  const id = useId().replace(/:/g, '');
  const sx = flip === 'x' || flip === 'xy' ? -1 : 1;
  const sy = flip === 'y' || flip === 'xy' ? -1 : 1;
  return (
    <svg
      className={['orn-corner', className].filter(Boolean).join(' ')}
      style={{ ...style, transform: `${style?.transform ?? ''} scale(${sx}, ${sy})`.trim() }}
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`rose${id}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F7E3E4" />
          <stop offset="60%" stopColor="#DDAFB6" />
          <stop offset="100%" stopColor="#B27382" />
        </radialGradient>
        <radialGradient id={`blush${id}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F0DEDD" />
          <stop offset="100%" stopColor="#D8B9B6" />
        </radialGradient>
      </defs>
      {/* Gold filigree stem */}
      <path d="M4 4 C 40 10, 70 30, 84 64 C 94 88, 118 110, 156 116" fill="none" stroke={GOLD} strokeWidth="1.3" />
      <path d="M4 4 C 10 40, 30 70, 64 84 C 88 94, 110 118, 116 156" fill="none" stroke={GOLD} strokeWidth="1.3" />
      <path d="M30 14 C 34 24, 42 28, 50 26" fill="none" stroke={GOLD} strokeWidth="0.9" />
      <path d="M14 30 C 24 34, 28 42, 26 50" fill="none" stroke={GOLD} strokeWidth="0.9" />
      {/* Leaves */}
      {[
        [62, 40, 35],
        [40, 62, 55],
        [104, 92, 20],
        [92, 104, 70],
        [128, 112, 5],
        [112, 128, 85],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="11" ry="4.5" transform={`rotate(${r} ${x} ${y})`} fill="#8EA27A" opacity="0.75" />
      ))}
      {/* Main rose */}
      <g transform="translate(30 30)">
        <circle r="17" fill={`url(#rose${id})`} />
        <path d="M-9 -2 C -6 -12, 8 -12, 9 -1 C 9 8, -4 11, -6 3 C -7 -3, 2 -6, 4 0" fill="none" stroke="#9C5E6D" strokeWidth="1.1" opacity="0.7" />
      </g>
      {/* Secondary blooms */}
      <g transform="translate(70 62)">
        <circle r="10" fill={`url(#blush${id})`} />
        <circle r="3" fill={GOLD} />
      </g>
      <g transform="translate(62 70)">
        <circle r="7" fill={`url(#rose${id})`} opacity="0.9" />
      </g>
      {/* Buds and jasmine */}
      {[
        [108, 100, 4],
        [100, 108, 4],
        [140, 118, 3],
        [118, 140, 3],
        [52, 18, 3.5],
        [18, 52, 3.5],
      ].map(([x, y, r], i) => (
        <circle key={`j${i}`} cx={x} cy={y} r={r} fill={`url(#blush${id})`} stroke="rgba(196,163,106,0.6)" strokeWidth="0.6" />
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Ornamental gold divider with lotus centre                           */
/* ------------------------------------------------------------------ */

export const LotusDivider: React.FC<OrnamentProps> = ({ className, style }) => (
  <svg
    className={['orn-divider', className].filter(Boolean).join(' ')}
    style={style}
    viewBox="0 0 240 24"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="4" y1="12" x2="94" y2="12" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.7" />
    <line x1="146" y1="12" x2="236" y2="12" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.7" />
    <circle cx="98" cy="12" r="1.6" fill={GOLD} />
    <circle cx="142" cy="12" r="1.6" fill={GOLD} />
    <g fill="none" stroke={GOLD} strokeWidth="1">
      <path d="M120 3 C 126 9, 126 15, 120 20 C 114 15, 114 9, 120 3 Z" fill="rgba(196,163,106,0.18)" />
      <path d="M120 20 C 112 18, 106 13, 104 8 C 111 9, 117 13, 120 20 Z" />
      <path d="M120 20 C 128 18, 134 13, 136 8 C 129 9, 123 13, 120 20 Z" />
    </g>
  </svg>
);
