"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";

const AUTOPLAY_MS = 7000;
/** Horizontal distance, in px, that commits to the next slide. */
const SWIPE_THRESHOLD = 70;
/** Flick velocity that commits regardless of distance. */
const VELOCITY_THRESHOLD = 420;

/**
 * Testimonial carousel: auto-advancing, draggable, keyboard-operable.
 *
 * Autoplay pauses on hover, on focus anywhere inside the carousel, while
 * dragging, and whenever the tab is hidden — a carousel that keeps moving
 * while someone is reading it, or that burns CPU in a background tab, is
 * worse than no carousel.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const count = testimonials.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Autoplay
  useEffect(() => {
    if (paused || dragging || reducedMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [paused, dragging, reducedMotion, count]);

  // Don't animate in a background tab.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const { offset, velocity } = info;

    if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
      go(index + 1);
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
      go(index - 1);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };

  return (
    <section id="testimonials" className="relative overflow-hidden py-[var(--section-y)]">
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="Clients"
          title="In their"
          titleAccent="own words."
          intro="Unedited, and we asked permission for every one. Drag to move through them."
        />

        <div
          className="relative mt-16"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onKeyDown={onKeyDown}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
        >
          {/* Viewport */}
          <div className="overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-graphite">
            <motion.ul
              className="flex"
              drag={reducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragStart={() => setDragging(true)}
              onDragEnd={onDragEnd}
              animate={{ x: `${-index * 100}%` }}
              transition={{
                type: reducedMotion ? "tween" : "spring",
                duration: reducedMotion ? 0.15 : undefined,
                stiffness: 240,
                damping: 34,
                mass: 0.7,
              }}
              style={{ cursor: reducedMotion ? "auto" : "grab" }}
              whileDrag={{ cursor: "grabbing" }}
              data-cursor="drag"
              data-cursor-label="Drag"
            >
              {testimonials.map((testimonial, slideIndex) => (
                <li
                  key={testimonial.name}
                  className="w-full shrink-0 p-8 sm:p-12 lg:p-16"
                  aria-hidden={slideIndex !== index}
                  aria-roledescription="slide"
                  aria-label={`${slideIndex + 1} of ${count}`}
                >
                  <svg
                    width="44"
                    height="34"
                    viewBox="0 0 44 34"
                    fill="none"
                    aria-hidden="true"
                    className="text-gold/35"
                  >
                    <path
                      d="M0 34V19.6C0 8.8 5.9 1.3 17.6 0l1.5 5.6C13 7.3 9.8 11 9.8 16h8.4v18H0Zm25 0V19.6C25 8.8 30.9 1.3 42.6 0l1.4 5.6C38 7.3 34.8 11 34.8 16h8.4v18H25Z"
                      fill="currentColor"
                    />
                  </svg>

                  <blockquote className="mt-7">
                    <p className="display text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.22] text-bone">
                      {testimonial.quote}
                    </p>

                    <footer className="mt-9 flex items-center gap-4">
                      <div className="img-skeleton relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={testimonial.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                      <div>
                        <cite className="not-italic">
                          <span className="block text-[1.0625rem] text-bone">
                            {testimonial.name}
                          </span>
                          <span className="label mt-1 block !text-[0.5625rem]">
                            {testimonial.role} · {testimonial.location}
                          </span>
                        </cite>
                      </div>
                    </footer>
                  </blockquote>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Controls */}
          <div className="mt-7 flex items-center justify-between gap-6">
            {/* Dots double as a progress track */}
            <ul className="flex items-center gap-2.5">
              {testimonials.map((testimonial, dotIndex) => (
                <li key={testimonial.name}>
                  <button
                    type="button"
                    onClick={() => go(dotIndex)}
                    aria-label={`Show testimonial ${dotIndex + 1}`}
                    aria-current={dotIndex === index}
                    data-cursor="button"
                    className={cn(
                      "block h-1 rounded-full transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                      dotIndex === index
                        ? "w-10 bg-gold"
                        : "w-4 bg-bone/25 hover:bg-bone/50",
                    )}
                  />
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2.5">
              <span className="label mr-2 tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>

              <ArrowButton direction="prev" onClick={() => go(index - 1)} />
              <ArrowButton direction="next" onClick={() => go(index + 1)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
      data-cursor="button"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline-strong)] text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className={direction === "prev" ? "rotate-180" : undefined}
      >
        <path
          d="M1 8h13M9 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
