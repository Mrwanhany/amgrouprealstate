"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/format";

interface MarqueeProps {
  items: string[];
  /** Seconds for one full pass. Larger = slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  separator?: ReactNode;
}

/**
 * Infinite horizontal text strip.
 *
 * Pure CSS: the track holds two identical copies of the list and translates
 * exactly -50%, so the seam lands on an identical glyph and the loop is
 * invisible. Doing this in CSS rather than JS keeps it off the main thread
 * entirely — it costs nothing in the frame budget even while pinned
 * sections are scrubbing.
 *
 * Pauses on hover, and is disabled outright under reduced motion by the
 * rule in globals.css.
 */
export function Marquee({
  items,
  duration = 42,
  reverse = false,
  className,
  separator,
}: MarqueeProps) {
  const sequence = (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center">
          <span className="display whitespace-nowrap px-8 text-[clamp(1.75rem,4.5vw,3.75rem)] text-bone/80">
            {item}
          </span>
          <span className="text-gold/70" aria-hidden="true">
            {separator ?? <Diamond />}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("marquee relative flex overflow-hidden", className)}
      role="presentation"
    >
      <div
        className="marquee-track flex w-max"
        data-reverse={reverse}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {sequence}
        {sequence}
      </div>

      {/* Feather the ends so items dissolve rather than clip. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-obsidian to-transparent" />
    </div>
  );
}

function Diamond() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path d="M4.5 0L5.6 3.4L9 4.5L5.6 5.6L4.5 9L3.4 5.6L0 4.5L3.4 3.4L4.5 0Z" fill="currentColor" />
    </svg>
  );
}
