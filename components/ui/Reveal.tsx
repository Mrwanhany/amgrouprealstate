"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface RevealProps {
  children: ReactNode;
  /** Seconds before this element starts. Use for manual stagger. */
  delay?: number;
  /** Travel distance in pixels. */
  y?: number;
  className?: string;
  /** How far into the viewport before it fires. Negative = later. */
  margin?: string;
}

/**
 * The workhorse scroll reveal: fade plus a short rise, fired once.
 *
 * Under reduced motion the transform is dropped and only a very short
 * opacity fade remains, so nothing moves but content still arrives
 * gracefully rather than snapping.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  margin = "-12% 0px -12% 0px",
}: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{
        duration: reducedMotion ? 0.2 : 0.9,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
