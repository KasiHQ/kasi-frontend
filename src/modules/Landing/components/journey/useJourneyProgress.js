import { useScroll, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook to manage scroll-driven progress without React state re-renders.
 * Springs and transforms are driven purely through Framer Motion values.
 */
export function useJourneyProgress({ prefersReducedMotion = false } = {}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Check low-power or data-saver constraints
    const isSaveData = Boolean(navigator.connection?.saveData);
    const isLowCore = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    if (isSaveData || isLowCore) {
      setIsLowPower(true);
    }
  }, []);

  // Velvety, smooth spring with controlled damping for an unhurried, luxurious scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    mass: 0.5,
    restDelta: 0.0005,
  });

  const activeProgress = isLowPower || prefersReducedMotion ? scrollYProgress : smoothProgress;

  const scrollToProgress = (progressFraction) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const elementTop = rect.top + scrollTop;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = elementTop + progressFraction * Math.max(0, scrollableDistance);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return {
    containerRef,
    rawProgress: scrollYProgress,
    progress: activeProgress,
    isLowPower,
    scrollToProgress,
  };
}
