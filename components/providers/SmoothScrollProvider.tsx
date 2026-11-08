"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

type ScrollDirection = "up" | "down";

interface SmoothScrollValue {
  /** Scroll to an element, a selector or a pixel offset. */
  scrollTo: (target: string | number | HTMLElement) => void;
  /** Which way the visitor last moved. Drives the auto-hiding navbar. */
  direction: ScrollDirection;
  /** Pixels from the top. */
  scrollY: number;
  /** Lock / unlock scrolling — used by the mobile menu and the modal. */
  setLocked: (locked: boolean) => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: () => {},
  direction: "down",
  scrollY: 0,
  setLocked: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Wires Lenis and GSAP together.
 *
 * The two must share a single clock or they fight: Lenis runs its own rAF by
 * default while ScrollTrigger runs off GSAP's ticker, which produces a
 * half-frame lag on every pinned section. So Lenis is created with
 * `autoRaf: false` and stepped from `gsap.ticker` instead, and
 * `ScrollTrigger.update` is driven off Lenis's own scroll event.
 *
 * Under `prefers-reduced-motion` Lenis is never created at all and the
 * browser's native scrolling is left completely alone.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [direction, setDirection] = useState<ScrollDirection>("down");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Reduced motion: native scroll, no Lenis, no ticker hijack.
    if (reducedMotion) {
      const onNativeScroll = () => {
        const y = window.scrollY;
        setScrollY((previous) => {
          if (Math.abs(y - previous) > 2) {
            setDirection(y > previous ? "down" : "up");
          }
          return y;
        });
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      // Slightly over-damped exponential: fast start, long settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // native momentum on touch feels better than synced
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      autoRaf: false, // GSAP's ticker drives it instead — see below
      anchors: false, // we handle anchor links ourselves
      respectReducedMotion: true,
    });

    lenisRef.current = lenis;

    const onScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      setScrollY(instance.scroll);
      if (instance.direction !== 0) {
        setDirection(instance.direction === 1 ? "down" : "up");
      }
    };

    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      // GSAP ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    // Lag smoothing makes GSAP skip time after a long frame, which desyncs
    // the scroll position from the rendered transform.
    gsap.ticker.lagSmoothing(0);

    // Let late-loading images settle before ScrollTrigger measures.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(1000, 16);
      window.removeEventListener("load", refresh);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement) => {
      const lenis = lenisRef.current;

      if (lenis) {
        lenis.scrollTo(target, { offset: -8, duration: 1.4 });
        return;
      }

      // Reduced-motion / Lenis-less fallback.
      if (typeof target === "number") {
        window.scrollTo({ top: target });
        return;
      }
      const element =
        typeof target === "string" ? document.querySelector(target) : target;
      element?.scrollIntoView({ block: "start" });
    },
    [],
  );

  const setLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    // Belt and braces for the reduced-motion path, where Lenis is absent.
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  return (
    <SmoothScrollContext.Provider
      value={{ scrollTo, direction, scrollY, setLocked }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
