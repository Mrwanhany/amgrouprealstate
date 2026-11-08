"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds the count takes. */
  duration?: number;
  className?: string;
}

/**
 * Counts from zero to `value` the first time it scrolls into view.
 *
 * Driven by a motion value rather than React state so the number updates on
 * the animation frame without re-rendering the component tree sixty times a
 * second — only the text node is touched.
 *
 * Under reduced motion the final value is printed immediately.
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2.2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reducedMotion = usePrefersReducedMotion();
  const motionValue = useMotionValue(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Reduced motion needs no state change at all: the render below already
    // prints the final value when `reducedMotion` is true.
    if (!inView || done || reducedMotion) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (textRef.current) {
          textRef.current.textContent = formatNumber(latest, decimals);
        }
      },
      onComplete: () => setDone(true),
    });

    return () => controls.stop();
  }, [inView, done, reducedMotion, motionValue, value, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span ref={textRef} suppressHydrationWarning>
        {done || reducedMotion ? formatNumber(value, decimals) : formatNumber(0, decimals)}
      </span>
      {suffix}
    </span>
  );
}
