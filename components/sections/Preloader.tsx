"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE, EASE_IN_OUT } from "@/lib/gsap";
import { useIntroAlreadyPlayed, usePrefersReducedMotion } from "@/lib/hooks";
import { useIntro } from "@/components/providers/IntroProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { LottiePlayer } from "@/components/ui/LottiePlayer";
import { site } from "@/data/site";

const SESSION_KEY = "amg:intro-played";

/**
 * Branded intro that wipes up into the hero.
 *
 * Sequence: gold hairline draws across the viewport → the monogram letters
 * rise → a 0–100 counter runs → the whole panel clips upward, revealing the
 * hero already in place underneath.
 *
 * It plays once per browser session (sessionStorage), is skipped entirely
 * under reduced motion, and is `aria-hidden` throughout so a screen reader
 * goes straight to the page content.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { markIntroDone } = useIntro();
  const { setLocked } = useSmoothScroll();

  const alreadyPlayed = useIntroAlreadyPlayed(SESSION_KEY);
  const [finished, setFinished] = useState(false);

  // Derived rather than stored: both inputs are already reactive, so holding
  // this in state would only add a render pass and a chance to go stale.
  const shouldPlay = !alreadyPlayed && !reducedMotion;

  useEffect(() => {
    if (!shouldPlay) {
      // Nothing to show — let the hero start immediately.
      markIntroDone();
      return;
    }

    setLocked(true);
    // The session flag is written on COMPLETION, not here: the store this
    // component reads it from re-reads on every render, so marking it played
    // up front would flip `shouldPlay` to false and tear the overlay down
    // half way through its own animation.
    return () => setLocked(false);
  }, [shouldPlay, markIntroDone, setLocked]);

  useGSAP(
    () => {
      if (!shouldPlay) return;

      const counter = { value: 0 };

      const timeline = gsap.timeline({
        defaults: { ease: EASE },
        onComplete: () => {
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // Private browsing can throw on write — the intro just replays.
          }
          setFinished(true);
          setLocked(false);
          markIntroDone();
        },
      });

      timeline
        // Hairline draws across
        .fromTo(
          "[data-intro-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: EASE_IN_OUT },
        )
        // Monogram letters rise out of their mask
        .fromTo(
          "[data-intro-letter]",
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.07 },
          0.25,
        )
        .fromTo(
          "[data-intro-meta]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.75,
        )
        // 0 -> 100
        .to(
          counter,
          {
            value: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counter.value),
                ).padStart(3, "0");
              }
            },
          },
          0.3,
        )
        // Everything lifts away...
        .to(
          "[data-intro-content]",
          { yPercent: -18, opacity: 0, duration: 0.8 },
          "+=0.15",
        )
        // ...and the panel clips upward to reveal the hero
        .to(
          root.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1.15,
            ease: EASE_IN_OUT,
          },
          "-=0.45",
        );
    },
    { scope: root, dependencies: [shouldPlay] },
  );

  // Returning visitors and reduced-motion visitors never see this at all;
  // it is also absent from the prerendered HTML (see useIntroAlreadyPlayed).
  if (!shouldPlay || finished) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="film-grain fixed inset-0 z-[300] flex flex-col items-center justify-center bg-obsidian"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        data-intro-content
        className="flex flex-col items-center px-6 text-center"
      >
        <LottiePlayer
          src="/lottie/preloader.json"
          className="h-28 w-28"
          loop={2}
          rootMargin="0px"
        />

        <div className="mt-6 flex items-end gap-[0.06em]">
          {Array.from(site.name.replace(" ", " ")).map((letter, index) => (
            <span key={index} className="line-mask">
              <span
                data-intro-letter
                className="display inline-block text-[clamp(2.75rem,9vw,5.5rem)] text-bone"
              >
                {letter}
              </span>
            </span>
          ))}
        </div>

        <div
          data-intro-rule
          className="mt-7 h-px w-[min(70vw,26rem)] origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        <div data-intro-meta className="mt-6 flex items-center gap-4">
          <span className="label">{site.market}</span>
          <span className="h-3 w-px bg-[color:var(--hairline-strong)]" />
          <span className="label tabular-nums text-gold">
            <span ref={counterRef}>000</span>
          </span>
        </div>
      </div>
    </div>
  );
}
