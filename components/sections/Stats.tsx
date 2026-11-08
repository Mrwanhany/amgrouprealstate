"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { differentiators, stats } from "@/data/stats";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";

const NEIGHBOURHOOD_STRIP = [
  "New Cairo",
  "Sheikh Zayed",
  "Zamalek",
  "Maadi",
  "Madinaty",
  "New Capital",
  "Heliopolis",
  "6th of October",
  "Mivida",
  "Katameya",
];

const BACKDROP =
  "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=2000&q=80";

/**
 * Stats band + reasons to choose us, over a parallaxing photograph.
 *
 * The counters only run once, the first time the band enters the viewport
 * (see AnimatedCounter) — re-triggering them on every scroll-past turns a
 * nice moment into a nervous tic.
 */
export function Stats() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.to("[data-stats-bg]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={root}
      id="why-us"
      className="film-grain relative overflow-hidden py-[var(--section-y)]"
    >
      {/* Parallax backdrop */}
      <div
        data-stats-bg
        aria-hidden="true"
        className="absolute inset-0 -z-20 will-change-transform"
        style={{ height: "120%", top: "-10%" }}
      >
        <Image
          src={BACKDROP}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.22]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian via-obsidian/88 to-obsidian"
      />

      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="Why AM Group"
          title="Eleven years of"
          titleAccent="saying no, too."
          intro="Anyone can list a property. The value is in knowing which ones not to touch — and we have had eleven years in Greater Cairo to learn the difference."
        />

        {/* ---------- Counters ---------- */}
        <ul className="mt-16 grid gap-px overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <li className="group h-full bg-obsidian/85 p-8 backdrop-blur-sm transition-colors duration-700 hover:bg-graphite lg:p-9">
                <p className="display text-[clamp(2.75rem,5vw,4rem)] leading-none text-bone">
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="tabular-nums"
                  />
                </p>

                <span
                  aria-hidden="true"
                  className="mt-5 block h-px w-10 bg-gold transition-[width] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full"
                />

                <p className="label mt-5">{stat.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {stat.caption}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        {/* ---------- Differentiators ---------- */}
        <ul className="mt-16 grid gap-10 md:grid-cols-3 lg:gap-14">
          {differentiators.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1}>
              <li>
                <p className="label !text-[0.5625rem] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-3 text-[1.625rem] leading-tight text-bone">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-stone">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* ---------- Neighbourhood marquee ---------- */}
      <div className="mt-[var(--section-y)]">
        <Marquee items={NEIGHBOURHOOD_STRIP} duration={48} />
      </div>
    </section>
  );
}
