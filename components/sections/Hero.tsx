"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { site } from "@/data/site";
import { neighbourhoodOptions, typeOptions } from "@/data/listings";
import { useIntro } from "@/components/providers/IntroProvider";
import { useSearch } from "@/components/providers/SearchProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { SplitText } from "@/components/ui/SplitText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LottiePlayer } from "@/components/ui/LottiePlayer";

/**
 * Three.js is pulled in only on the client, only after the hero has painted,
 * and never on mobile — see the guard in the component below.
 */
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=80";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { introDone } = useIntro();
  const { scrollTo } = useSmoothScroll();
  const { setFilters } = useSearch();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  // Local copy of the search bar's state; committed to the shared filters
  // only when the visitor actually submits.
  const [quickNeighbourhood, setQuickNeighbourhood] = useState("");
  const [quickType, setQuickType] = useState("");
  const [quickStatus, setQuickStatus] = useState("");

  // Load three.js only once the browser is idle — it must never compete
  // with the hero image for bandwidth during first paint.
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (callback: () => void) => window.setTimeout(callback, 1200);

    const handle = schedule(() => setSceneReady(true));
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(handle as number);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [isMobile, reducedMotion]);

  // Entrance timeline — held until the preloader has wiped away.
  useGSAP(
    () => {
      if (!introDone || reducedMotion) return;

      const timeline = gsap.timeline({ defaults: { ease: EASE } });

      timeline
        .fromTo(
          "[data-hero-media]",
          { scale: 1.16, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.8 },
          0,
        )
        .fromTo(
          "[data-hero-eyebrow]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.35,
        )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 1 },
          0.95,
        )
        .fromTo(
          "[data-hero-search]",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.1 },
          1.1,
        )
        .fromTo(
          "[data-hero-foot]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          1.25,
        )
        .fromTo(
          "[data-hero-scene]",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.6 },
          1.0,
        );

      // Background parallax — the photograph drifts slower than the page,
      // and the copy drifts faster, which opens the depth up as you scroll.
      gsap.to("[data-hero-media]", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-copy]", {
        yPercent: -14,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [introDone, reducedMotion] },
  );

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters({
      neighbourhood: quickNeighbourhood,
      type: quickType,
      status: quickStatus as "" | "sale" | "rent",
    });
    scrollTo("#listings");
  };

  return (
    <section
      ref={root}
      id="hero"
      className="film-grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32 lg:pb-14"
    >
      {/* ---------- Background photograph ---------- */}
      <div
        data-hero-media
        className="absolute inset-0 -z-20 will-change-transform"
        style={{ height: "118%", top: "-9%" }}
      >
        <Image
          src={HERO_IMAGE}
          alt="A contemporary villa at dusk in New Cairo, lit from within"
          fill
          sizes="100vw"
          className="object-cover"
          // This is the LCP element: load it eagerly and at high priority
          // rather than with the deprecated `priority` prop.
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Legibility scrim — vertical and horizontal, so the headline holds
          contrast over any part of the photograph. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/72 to-obsidian/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/90 via-obsidian/40 to-transparent"
      />

      {/* Drifting colour field */}
      <div
        aria-hidden="true"
        className="aurora pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      {/* ---------- 3D accent ---------- */}
      {sceneReady ? (
        <div
          data-hero-scene
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] top-[6%] -z-[5] hidden h-[48vh] w-[30vw] opacity-0 lg:block xl:right-[5%]"
        >
          <HeroScene />
        </div>
      ) : null}

      {/* Floating hairline square */}
      <div
        aria-hidden="true"
        className="float-slow pointer-events-none absolute right-[14%] top-[22%] hidden h-24 w-24 rotate-12 border border-gold/25 lg:block"
      />
      <div
        aria-hidden="true"
        className="float-slow pointer-events-none absolute left-[6%] top-[30%] hidden h-2 w-2 rounded-full bg-gold/70 lg:block"
        style={{ animationDelay: "-2.5s" }}
      />

      {/* ---------- Copy ---------- */}
      <div className="relative mx-auto w-full max-w-[115rem] px-[var(--gutter)]">
        <div data-hero-copy className="max-w-5xl">
          <p
            data-hero-eyebrow
            className="label flex items-center gap-3 opacity-0"
          >
            <span className="h-px w-10 bg-gold" />
            {site.name} — {site.market}
          </p>

          <h1 className="display mt-6 text-[clamp(3rem,7.8vw,8.5rem)] text-bone">
            <SplitText text="Where Cairo" by="char" immediate={introDone} delay={0.45} stagger={0.028} />
            <span className="block">
              <SplitText
                text="comes home."
                by="char"
                immediate={introDone}
                delay={0.62}
                stagger={0.028}
                accent
              />
            </span>
          </h1>

          <p
            data-hero-sub
            className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-stone opacity-0 lg:text-lg"
          >
            {site.shortPitch}
          </p>

          {/* ---------- Quick search ---------- */}
          <form
            data-hero-search
            onSubmit={submitSearch}
            className="mt-10 max-w-3xl opacity-0"
            aria-label="Quick property search"
          >
            <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-[color:var(--hairline-strong)] bg-obsidian/55 backdrop-blur-xl sm:flex-row sm:items-stretch sm:rounded-full">
              <SearchSelect
                label="Area"
                value={quickNeighbourhood}
                onChange={setQuickNeighbourhood}
                options={neighbourhoodOptions}
                anyLabel="Any area"
              />
              <span className="hidden w-px shrink-0 bg-[color:var(--hairline)] sm:block" />
              <SearchSelect
                label="Type"
                value={quickType}
                onChange={setQuickType}
                options={typeOptions}
                anyLabel="Any type"
              />
              <span className="hidden w-px shrink-0 bg-[color:var(--hairline)] sm:block" />
              <SearchSelect
                label="Looking to"
                value={quickStatus}
                onChange={setQuickStatus}
                options={["sale", "rent"]}
                optionLabels={{ sale: "Buy", rent: "Rent" }}
                anyLabel="Buy or rent"
              />

              <div className="p-2 sm:py-2 sm:pl-0 sm:pr-2">
                <MagneticButton type="submit" className="w-full !px-8 sm:w-auto">
                  Search
                  <ArrowRight />
                </MagneticButton>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ---------- Foot: scroll cue + proof points ---------- */}
      <div
        data-hero-foot
        className="relative mx-auto mt-14 flex w-full max-w-[115rem] items-end justify-between gap-6 px-[var(--gutter)] opacity-0"
      >
        <button
          type="button"
          onClick={() => scrollTo("#listings")}
          data-cursor="link"
          className="group flex items-center gap-3 text-left"
          aria-label="Scroll to featured listings"
        >
          {/* Two passes (~3.7s), then it rests. WCAG 2.2.2 requires a pause
              control for anything that auto-plays beyond five seconds, and a
              short finite run is a better answer here than adding one. */}
          <LottiePlayer
            src="/lottie/scroll-indicator.json"
            className="h-12 w-9 shrink-0"
            loop={2}
            rootMargin="0px"
            fallback={<ScrollFallback />}
          />
          <span className="label transition-colors duration-300 group-hover:text-bone">
            Scroll
          </span>
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {[
            ["1,240+", "Properties closed"],
            ["11 yrs", "In Greater Cairo"],
            ["98%", "Would recommend"],
          ].map(([value, label]) => (
            <li key={label} className="text-right">
              <p className="display text-2xl text-bone">{value}</p>
              <p className="label mt-1 !text-[0.625rem]">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

interface SearchSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  anyLabel: string;
}

/** Native <select> — keyboard and screen-reader behaviour for free. */
function SearchSelect({
  label,
  value,
  onChange,
  options,
  optionLabels,
  anyLabel,
}: SearchSelectProps) {
  const id = `hero-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-3">
      <label htmlFor={id} className="label !text-[0.5625rem]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-cursor="link"
        className="mt-1 w-full cursor-pointer appearance-none bg-transparent text-[0.9375rem] text-bone outline-none"
      >
        <option value="" className="bg-graphite">
          {anyLabel}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-graphite">
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1 8h13M9 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Static stand-in while the Lottie engine loads, or under reduced motion. */
function ScrollFallback() {
  return (
    <svg viewBox="0 0 36 48" fill="none" className="h-full w-full" aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="33"
        height="45"
        rx="16.5"
        stroke="var(--bone)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="15" r="3.5" fill="var(--champagne)" />
    </svg>
  );
}
