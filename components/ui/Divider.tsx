"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/format";

/**
 * Animated section divider: a hairline that draws itself across the page
 * as it enters the viewport, with an optional diamond at the centre.
 */
export function Divider({
  className,
  ornament = true,
}: {
  className?: string;
  ornament?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn("relative flex items-center justify-center", className)}
    >
      <motion.span
        className="block h-px w-full origin-center bg-gradient-to-r from-transparent via-[color:var(--hairline-strong)] to-transparent"
        initial={{ scaleX: reducedMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{
          duration: reducedMotion ? 0 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {ornament ? (
        <motion.span
          className="absolute flex h-7 w-7 items-center justify-center bg-obsidian text-gold"
          initial={{ opacity: reducedMotion ? 1 : 0, rotate: reducedMotion ? 0 : -90 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.5 }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M4.5 0L5.6 3.4L9 4.5L5.6 5.6L4.5 9L3.4 5.6L0 4.5L3.4 3.4L4.5 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.span>
      ) : null}
    </div>
  );
}
