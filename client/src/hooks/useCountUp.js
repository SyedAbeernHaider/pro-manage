import { useEffect, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/** Animates a number from 0 to `target` once `start` becomes true. */
export default function useCountUp(target, { start = true, duration = 1400 } = {}) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || reduced) return undefined;

    let frame;
    const begin = performance.now();
    const tick = (now) => {
      const t = Math.min((now - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration, reduced]);

  // reduced motion: show the final number immediately, no animation
  return reduced ? target : value;
}
