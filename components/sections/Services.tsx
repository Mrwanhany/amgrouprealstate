"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { services, type Service } from "@/data/services";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { LottiePlayer } from "@/components/ui/LottiePlayer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * The four service pillars, each with a Lottie icon.
 *
 * On a pointer device the icons hold still until hovered, so the section
 * is calm at rest and responds to attention — four animations looping
 * simultaneously reads as clutter. On touch they simply autoplay once
 * visible, since there is no hover to respond to.
 */
export function Services() {
  return (
    <section
      id="services"
      className="relative py-[var(--section-y)]"
      aria-labelledby="services-title"
    >
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="What we do"
          title="Four things,"
          titleAccent="done properly."
          intro="Buying, selling, renting, managing. No mortgage desk, no insurance arm, no upsell — just the property work, handled by the person you actually met."
          aside={
            <MagneticButton href="#contact" variant="outline">
              Talk to us
            </MagneticButton>
          }
        />
        <h2 id="services-title" className="sr-only">
          Our services
        </h2>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[color:var(--hairline)] md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  // Pointer devices: play on hover (user-initiated, so it may loop freely).
  // Touch has no hover, so it plays once on entering view rather than
  // looping unattended — WCAG 2.2.2 again.
  const play = hasFinePointer ? hovered : true;
  const loop = hasFinePointer ? true : 1;

  return (
    <motion.li
      className="group relative flex flex-col bg-obsidian p-8 transition-colors duration-700 hover:bg-graphite lg:p-9"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: reducedMotion ? 0.2 : 0.85,
        delay: reducedMotion ? 0 : index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Gold rule that wipes in across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between">
        <LottiePlayer
          src={service.lottie}
          className="h-16 w-16 shrink-0"
          play={play}
          loop={loop}
          fallback={<ServiceIconFallback id={service.id} />}
        />
        <span className="label !text-[0.5625rem] text-gold">{service.index}</span>
      </div>

      <h3 className="display mt-7 text-[1.875rem] leading-none text-bone">
        {service.title}
      </h3>

      <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
        {service.summary}
      </p>

      <ul className="mt-6 flex flex-col gap-2.5">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-[0.875rem] text-bone/75">
            <span
              aria-hidden="true"
              className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold"
            />
            {point}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

/**
 * Static stand-in shown under reduced motion and before the Lottie engine
 * arrives. Each is a simplified version of the same mark, so the layout
 * never shifts when the animation takes over.
 */
function ServiceIconFallback({ id }: { id: string }) {
  const common = {
    fill: "none",
    stroke: "var(--champagne)",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      {id === "buying" ? (
        <>
          <path d="M9 24.5L24 12l15 12.5V39H9V24.5Z" {...common} />
          <path d="M20 39v-9h8v9" {...common} />
        </>
      ) : null}
      {id === "selling" ? (
        <>
          <path d="M9 26L24 14l15 12v13H9V26Z" {...common} opacity={0.4} />
          <path d="M24 34V18M18 24l6-6 6 6" {...common} />
        </>
      ) : null}
      {id === "renting" ? (
        <>
          <circle cx="17" cy="24" r="7" {...common} />
          <path d="M24 24h15M33 24v6M39 24v5" {...common} />
        </>
      ) : null}
      {id === "management" ? (
        <>
          <rect x="14" y="11" width="20" height="28" rx="2" {...common} />
          <path d="M20 19h2M26 19h2M20 26h2M26 26h2M20 33h8" {...common} />
        </>
      ) : null}
    </svg>
  );
}
