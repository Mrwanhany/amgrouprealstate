"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt: string;
  afterAlt: string;
}

/**
 * Draggable before/after comparison.
 *
 * The "after" image is clipped with `inset()` rather than resized, so both
 * photographs stay perfectly registered at any divider position — resizing
 * a container would shift one image's framing relative to the other.
 *
 * A real range input sits over the whole control, visually hidden but fully
 * operable: arrow keys, Home/End and screen-reader announcements all work
 * without any ARIA guesswork.
 */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeAlt,
  afterAlt,
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="img-skeleton group relative aspect-[16/10] w-full select-none overflow-hidden rounded-xl border border-[color:var(--hairline)]"
      onPointerDown={(event) => {
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging) updateFromPointer(event.clientX);
      }}
      onPointerUp={(event) => {
        setDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => setDragging(false)}
      data-cursor="drag"
      data-cursor-label="Drag"
    >
      {/* Before (full width, underneath) */}
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        sizes="(max-width: 1024px) 92vw, 50vw"
        className="object-cover"
        draggable={false}
      />

      {/* After (clipped from the left) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(max-width: 1024px) 92vw, 50vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-bone/25 bg-obsidian/70 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-bone backdrop-blur-sm">
        {afterLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-bone/25 bg-obsidian/70 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-stone backdrop-blur-sm">
        {beforeLabel}
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-gold"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-obsidian/85 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
            <path
              d="M7 1L2 6l5 5M13 1l5 5-5 5"
              stroke="var(--gold)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Accessible control */}
      <label className="sr-only" htmlFor="before-after-range">
        Reveal the staged photograph
      </label>
      <input
        id="before-after-range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(position)}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${Math.round(position)}% staged`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
