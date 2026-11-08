"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { neighbourhoods } from "@/data/neighbourhoods";
import { useSearch } from "@/components/providers/SearchProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";

/**
 * Interactive district map.
 *
 * A stylised plan of Greater Cairo — the Nile, the ring road, and a pin per
 * district. Hovering or focusing a pin cross-fades the photograph and swaps
 * the statistics beside it; selecting one filters the listings grid and
 * scrolls there.
 *
 * The pins are real buttons in a list, so the whole section is operable by
 * keyboard and announced sensibly. The map itself is decorative.
 */
export function Neighbourhoods() {
  const [activeId, setActiveId] = useState(neighbourhoods[0].id);
  const reducedMotion = usePrefersReducedMotion();
  const { setFilters } = useSearch();
  const { scrollTo } = useSmoothScroll();

  const active =
    neighbourhoods.find((item) => item.id === activeId) ?? neighbourhoods[0];

  const showListings = (name: string) => {
    setFilters({ neighbourhood: name });
    scrollTo("#all-listings");
  };

  return (
    <section id="neighbourhoods" className="relative py-[var(--section-y)]">
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="Where we work"
          title="Six districts,"
          titleAccent="known street by street."
          intro="We don't claim to cover the whole country. We cover these properly — which means knowing which compound has a water problem and which road floods in January."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* ---------- Photograph + detail ---------- */}
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-[color:var(--hairline)]">
              <div className="img-skeleton relative aspect-[4/3]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reducedMotion ? 0.15 : 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Image
                      src={active.image}
                      alt={`Property in ${active.name}`}
                      fill
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent"
                />

                {/* District name over the photograph */}
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                      transition={{ duration: reducedMotion ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="label !text-[0.5625rem] text-champagne">
                        {active.arabic}
                      </p>
                      <h3 className="display mt-2 text-[clamp(2rem,4vw,3rem)] text-bone">
                        {active.name}
                      </h3>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Stats strip */}
              <div className="bg-graphite p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0.12 : 0.45 }}
                  >
                    <p className="leading-relaxed text-stone">{active.blurb}</p>

                    <dl className="mt-6 grid grid-cols-3 gap-5">
                      {[
                        ["Average", active.avgPrice],
                        ["With us", `${active.listings} listed`],
                        ["Commute", active.commute],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="label !text-[0.5rem]">{label}</dt>
                          <dd className="mt-1.5 text-[0.9375rem] text-bone">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <button
                      type="button"
                      onClick={() => showListings(active.name)}
                      data-cursor="button"
                      className="group mt-7 inline-flex items-center gap-2.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:text-gold"
                    >
                      See {active.name} listings
                      <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1.5">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path
                            d="M1 8h13M9 3l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* ---------- Map ---------- */}
          <Reveal delay={0.12}>
            <div className="relative h-full min-h-[26rem] overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-graphite">
              {/* Decorative plan of the city */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="nile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3c5a86" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#3c5a86" stopOpacity="0.2" />
                  </linearGradient>
                  <pattern
                    id="grid"
                    width="6.25"
                    height="6.25"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M6.25 0H0V6.25"
                      fill="none"
                      stroke="var(--bone)"
                      strokeOpacity="0.05"
                      strokeWidth="0.2"
                    />
                  </pattern>
                </defs>

                <rect width="100" height="100" fill="url(#grid)" />

                {/* The Nile */}
                <path
                  d="M38 -5 C 41 18, 36 34, 40 52 C 43 68, 39 86, 42 105"
                  stroke="url(#nile)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Ring road */}
                <ellipse
                  cx="52"
                  cy="54"
                  rx="40"
                  ry="34"
                  fill="none"
                  stroke="var(--gold)"
                  strokeOpacity="0.16"
                  strokeWidth="0.45"
                  strokeDasharray="2.5 2"
                />

                {/* Arterials */}
                <path
                  d="M12 44 L92 58 M20 78 L86 30 M50 6 L54 96"
                  stroke="var(--bone)"
                  strokeOpacity="0.07"
                  strokeWidth="0.35"
                  fill="none"
                />
              </svg>

              {/* Pins */}
              <ul className="absolute inset-0">
                {neighbourhoods.map((item) => {
                  const isActive = item.id === active.id;
                  return (
                    <li
                      key={item.id}
                      className="absolute"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <button
                        type="button"
                        onPointerEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        onClick={() => showListings(item.name)}
                        aria-current={isActive}
                        data-cursor="link"
                        className="group relative flex items-center gap-2.5 rounded-full p-1"
                      >
                        {/* Pulse */}
                        {isActive && !reducedMotion ? (
                          <motion.span
                            className="absolute left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-gold"
                            initial={{ scale: 1, opacity: 0.9 }}
                            animate={{ scale: 3.2, opacity: 0 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        ) : null}

                        <span
                          className={cn(
                            "relative block h-3 w-3 shrink-0 rounded-full border transition-all duration-500",
                            isActive
                              ? "scale-125 border-gold bg-gold"
                              : "border-bone/40 bg-obsidian group-hover:border-gold",
                          )}
                        />

                        <span
                          className={cn(
                            "whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.08em] backdrop-blur-sm transition-all duration-500",
                            isActive
                              ? "bg-gold/15 text-bone"
                              : "bg-obsidian/55 text-stone group-hover:text-bone",
                          )}
                        >
                          {item.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="label absolute bottom-5 left-6 !text-[0.5rem]">
                Greater Cairo — schematic
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
