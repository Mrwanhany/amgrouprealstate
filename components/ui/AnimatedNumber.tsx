"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { formatNumber } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
}

/**
 * Tweens between successive values.
 *
 * Unlike <AnimatedCounter>, which counts up once on scroll, this re-animates
 * every time `value` changes — it is for figures that respond live to input,
 * like the mortgage results.
 *
 * The DOM text node is written directly from the animation frame so a slider
 * drag doesn't re-render React sixty times a second.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (textRef.current) {
        textRef.current.textContent = formatNumber(value, decimals);
      }
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (textRef.current) {
          textRef.current.textContent = formatNumber(latest, decimals);
        }
      },
    });

    return () => controls.stop();
  }, [value, decimals, motionValue, reducedMotion]);

  return (
    <span ref={textRef} className={className} suppressHydrationWarning>
      {formatNumber(value, decimals)}
    </span>
  );
}
