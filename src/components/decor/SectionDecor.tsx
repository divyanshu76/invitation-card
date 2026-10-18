import './decor.css';
import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArchFinial, ArchFrame, Diya, FloralCorner, Mandala, MarigoldToran } from './Ornaments';

export type DecorVariant =
  | 'hero'
  | 'countdown'
  | 'ganesh'
  | 'story'
  | 'moments'
  | 'blessings'
  | 'celebrations'
  | 'timeline'
  | 'venue'
  | 'rsvp'
  | 'closing';

/**
 * Per-section background composition: paper texture + one pattern family +
 * a few placed ornaments. Each section gets its own identity from the same kit.
 *
 * Continuous decorative animation (bells, flames, mandala rotation) only runs
 * while the section is near the viewport — `data-live` gates it in CSS.
 */
export const SectionDecor: React.FC<{ variant: DecorVariant }> = ({ variant }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const live = useInView(ref, { margin: '120px 0px' });

  return (
    <div ref={ref} className={`decor-layer decor-${variant}`} data-live={live ? 'true' : 'false'} aria-hidden="true">
      {variant === 'hero' && (
        <>
          <MarigoldToran className="decor-toran decor-toran--hero" />
          <div className="decor-hero-arch">
            <ArchFinial className="decor-finial" />
            <ArchFrame />
          </div>
          <FloralCorner className="decor-corner decor-corner--bl" flip="y" />
          <FloralCorner className="decor-corner decor-corner--br" flip="xy" />
        </>
      )}

      {variant === 'countdown' && (
        <>
          <Diya className="decor-diya decor-diya--left" size={60} />
          <Diya className="decor-diya decor-diya--right" size={60} />
        </>
      )}

      {variant === 'ganesh' && (
        <>
          <MarigoldToran className="decor-toran" />
          <Mandala className="decor-mandala decor-mandala--center" />
        </>
      )}

      {variant === 'story' && (
        <>
          <FloralCorner className="decor-corner decor-corner--tl" />
          <FloralCorner className="decor-corner decor-corner--br" flip="xy" />
          <Mandala className="decor-mandala decor-mandala--edge-right" />
        </>
      )}

      {variant === 'moments' && (
        <>
          <Mandala className="decor-mandala decor-mandala--edge-left" />
          <FloralCorner className="decor-corner decor-corner--tr" flip="x" />
        </>
      )}

      {variant === 'blessings' && (
        <>
          <div className="decor-temple-arch">
            <ArchFinial className="decor-finial" />
            <ArchFrame />
          </div>
          <Diya className="decor-diya decor-diya--left decor-diya--low" size={58} />
          <Diya className="decor-diya decor-diya--right decor-diya--low" size={58} />
        </>
      )}

      {variant === 'celebrations' && (
        <>
          <MarigoldToran className="decor-toran" bells={false} />
          <FloralCorner className="decor-corner decor-corner--bl" flip="y" />
          <Mandala className="decor-mandala decor-mandala--edge-right decor-mandala--mid" />
        </>
      )}

      {variant === 'timeline' && (
        <>
          <Mandala className="decor-mandala decor-mandala--edge-left decor-mandala--mid" />
          <FloralCorner className="decor-corner decor-corner--tr" flip="x" />
        </>
      )}

      {variant === 'venue' && (
        <>
          <FloralCorner className="decor-corner decor-corner--tl" />
          <Mandala className="decor-mandala decor-mandala--edge-right" />
        </>
      )}

      {variant === 'rsvp' && (
        <>
          <MarigoldToran className="decor-toran" />
          <FloralCorner className="decor-corner decor-corner--bl" flip="y" />
          <FloralCorner className="decor-corner decor-corner--br" flip="xy" />
        </>
      )}

      {variant === 'closing' && (
        <>
          <MarigoldToran className="decor-toran" />
          <div className="decor-closing-arch">
            <ArchFinial className="decor-finial" />
            <ArchFrame />
          </div>
          <Diya className="decor-diya decor-diya--left decor-diya--low" size={62} />
          <Diya className="decor-diya decor-diya--right decor-diya--low" size={62} />
          <FloralCorner className="decor-corner decor-corner--bl" flip="y" />
          <FloralCorner className="decor-corner decor-corner--br" flip="xy" />
        </>
      )}
    </div>
  );
};

export default SectionDecor;
