"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins.
 *
 * Importing plugins in several components registers them several times and
 * makes ScrollTrigger's refresh order unpredictable, so every component
 * imports `gsap` and `ScrollTrigger` from here instead of from the package.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // ScrollTrigger measures against a Lenis-driven scroller; normalising
  // here keeps pinned sections from drifting on iOS address-bar resize.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };

/** Shared easing so every section moves with the same signature. */
export const EASE = "expo.out";
export const EASE_IN_OUT = "power3.inOut";
