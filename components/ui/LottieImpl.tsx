"use client";

import { LottieLight, type LottieHandle } from "lottie-react";
import { useEffect, useRef } from "react";

export interface LottieImplProps {
  /** Path under /public/lottie — fetched at runtime, never bundled. */
  src: string;
  loop?: boolean | number;
  /** When false the animation holds at frame 0 until told to play. */
  play?: boolean;
  speed?: number;
  className?: string;
}

/**
 * The actual lottie-web binding, isolated in its own module so that
 * `LottiePlayer` can `next/dynamic` it with `ssr: false` and keep the
 * ~60KB engine out of the initial bundle.
 *
 * Uses `LottieLight` — the build without the expression engine — which is
 * all these animations need and is meaningfully smaller than the full one.
 */
export default function LottieImpl({
  src,
  loop = true,
  play = true,
  speed = 1,
  className,
}: LottieImplProps) {
  const handle = useRef<LottieHandle>(null);

  useEffect(() => {
    if (!handle.current) return;
    if (play) handle.current.play();
    else handle.current.pause();
  }, [play]);

  return (
    <LottieLight
      src={src}
      loop={loop}
      speed={speed}
      autoplay={play}
      lottieRef={handle}
      className={className}
      aria-hidden="true"
    />
  );
}
