"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/format";

/**
 * The lottie-web engine is pulled in only on the client, and only once a
 * player is actually close to the viewport.
 */
const LottieImpl = dynamic(() => import("./LottieImpl"), {
  ssr: false,
  loading: () => null,
});

interface LottiePlayerProps {
  /** e.g. "/lottie/icon-buying.json" */
  src: string;
  className?: string;
  loop?: boolean | number;
  /**
   * External play control. Leave undefined for "play whenever visible";
   * pass a boolean to drive it yourself (used for play-on-hover icons).
   */
  play?: boolean;
  speed?: number;
  /** How far outside the viewport to start loading. */
  rootMargin?: string;
  /** Static stand-in rendered until the engine is ready. */
  fallback?: React.ReactNode;
}

/**
 * Lazy, viewport-gated Lottie wrapper.
 *
 * Nothing is fetched — neither the engine nor the JSON — until the element
 * is within `rootMargin` of the viewport. Under reduced motion no animation
 * is ever loaded and the `fallback` is shown instead, which is why every
 * caller passes a meaningful static SVG rather than a spinner.
 */
export function LottiePlayer({
  src,
  className,
  loop = true,
  play,
  speed = 1,
  rootMargin = "200px",
  fallback = null,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, reducedMotion]);

  // Reduced motion: never load the engine, show the static stand-in.
  if (reducedMotion) {
    return (
      <div ref={containerRef} className={cn(className)} aria-hidden="true">
        {fallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn(className)} aria-hidden="true">
      {inView ? (
        <LottieImpl
          src={src}
          loop={loop}
          play={play ?? true}
          speed={speed}
          className="h-full w-full"
        />
      ) : (
        fallback
      )}
    </div>
  );
}
