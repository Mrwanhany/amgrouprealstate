"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/format";

interface SplitTextProps {
  text: string;
  /** Which element to render. Headlines should pass a real heading tag. */
  as?: ElementType;
  /** Split granularity. Characters read sharper but cost more nodes. */
  by?: "word" | "char";
  className?: string;
  /** Seconds before the first unit moves. */
  delay?: number;
  /** Seconds between units. */
  stagger?: number;
  /** Play on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean;
  /**
   * Render in the champagne-to-gold gradient. This has to be applied to each
   * split unit rather than to the line, because `background-clip: text` is
   * not painted through transformed descendants — and every unit here is
   * transformed. Under reduced motion there are no units, so it goes on the
   * element itself.
   */
  accent?: boolean;
}

/**
 * Masked word/letter reveal.
 *
 * Each line sits inside an `overflow: hidden` mask and its units start
 * translated fully below it, so they appear to rise out of the page rather
 * than fade in on top of it.
 *
 * Accessibility: the split spans are `aria-hidden` and a single visually
 * hidden copy of the real string sits alongside them, so assistive tech
 * reads one clean sentence instead of a stream of disconnected letters.
 */
export function SplitText({
  text,
  as: Tag = "span",
  by = "word",
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
  accent = false,
}: SplitTextProps) {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // NOTE: gsap.context (which useGSAP wraps) only rewrites selector
      // STRINGS passed to gsap animation methods. gsap.utils.toArray("...")
      // queries the whole document, so every SplitText on the page would
      // hide every other one's units. Query the scope element directly.
      const rootElement = scope.current;
      if (!rootElement) return;

      const units = gsap.utils.toArray<HTMLElement>(
        rootElement.querySelectorAll("[data-split-unit]"),
      );
      if (!units.length) return;

      // fromTo, not set + to: a plain `to({ yPercent: 0 })` resolves its
      // start value from GSAP's cache, and that cache does not survive the
      // context revert this hook performs when `immediate` flips. The
      // element's `translate(0, 115%)` then reads back as `y: 131px,
      // yPercent: 0`, so the tween becomes a no-op on Y while opacity still
      // animates — the headline fades in but never rises into its mask.
      // fromTo states both ends explicitly and is immune to that.
      gsap.fromTo(
        units,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: EASE,
          stagger,
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: rootElement,
                  start: "top 88%",
                  once: true,
                },
              }),
        },
      );
    },
    { scope, dependencies: [reducedMotion, text, immediate, delay, stagger] },
  );

  const words = text.split(" ");

  // Reduced motion gets the plain string — no spans, no transforms, so the
  // gradient can safely live on the element itself.
  if (reducedMotion) {
    return (
      <Tag className={cn(className, accent && "gold-gradient")}>{text}</Tag>
    );
  }

  const unitClass = cn("inline-block will-change-transform", accent && "gold-gradient");

  return (
    <Tag ref={scope} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span
            key={`${word}-${wordIndex}`}
            className="line-mask inline-block align-bottom"
          >
            {by === "word" ? (
              <span data-split-unit className={unitClass}>
                {word}
                {wordIndex < words.length - 1 ? " " : ""}
              </span>
            ) : (
              <span className="inline-block">
                {Array.from(word).map((character, charIndex) => (
                  <span
                    key={`${character}-${charIndex}`}
                    data-split-unit
                    className={unitClass}
                  >
                    {character}
                  </span>
                ))}
                {wordIndex < words.length - 1 ? (
                  <span data-split-unit className="inline-block">
                    {" "}
                  </span>
                ) : null}
              </span>
            )}
          </span>
        ))}
      </span>
    </Tag>
  );
}
