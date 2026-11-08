"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Hairline progress bar pinned to the top of the viewport.
 *
 * Reads real document scroll (Lenis performs genuine scrolling rather than
 * transforming a wrapper, so `useScroll` stays accurate) and is smoothed by
 * a spring so it glides instead of stepping.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = usePrefersReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left"
      style={{
        scaleX: reducedMotion ? scrollYProgress : scaleX,
        background:
          "linear-gradient(90deg, var(--gold) 0%, var(--champagne) 60%, var(--gold) 100%)",
      }}
    />
  );
}
