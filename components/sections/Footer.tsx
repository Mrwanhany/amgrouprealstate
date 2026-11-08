"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { neighbourhoods } from "@/data/neighbourhoods";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Footer.
 *
 * The wordmark is set enormous and rises into place as the footer enters the
 * viewport — the last thing on the page is the name, at the largest size it
 * appears anywhere.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const reducedMotion = usePrefersReducedMotion();
  const year = 2026; // Static so the prerender and the client never disagree.

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        "[data-footer-letter]",
        { yPercent: 108 },
        {
          yPercent: 0,
          duration: 1.3,
          ease: EASE,
          stagger: 0.045,
          scrollTrigger: {
            trigger: "[data-footer-word]",
            start: "top 92%",
            once: true,
          },
        },
      );
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <footer
      ref={root}
      className="film-grain relative overflow-hidden border-t border-[color:var(--hairline)] pt-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        {/* ---------- Call to action ---------- */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <p className="label flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                {site.tagline}
              </p>
              <p className="display mt-6 max-w-2xl text-[clamp(1.875rem,4vw,3.25rem)] leading-[1.1] text-bone">
                Ready when you are — a viewing, a valuation, or just a sensible
                second opinion.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              data-cursor="button"
              className="group flex items-center gap-4"
              aria-label="Back to top"
            >
              <span className="label transition-colors duration-300 group-hover:text-bone">
                Back to top
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--hairline-strong)] transition-colors duration-500 group-hover:border-gold">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="-rotate-90 text-bone transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-0.5 group-hover:text-gold"
                >
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
          </Reveal>
        </div>

        {/* ---------- Link columns ---------- */}
        <div className="hairline-t mt-16 grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label mb-5">Navigate</p>
            <ul className="flex flex-col gap-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.href)}
                    data-cursor="link"
                    className="text-[0.9375rem] text-stone transition-colors duration-300 hover:text-bone"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-5">Services</p>
            <ul className="flex flex-col gap-3">
              {services.map((service) => (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo("#services")}
                    data-cursor="link"
                    className="text-[0.9375rem] text-stone transition-colors duration-300 hover:text-bone"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-5">Areas</p>
            <ul className="flex flex-col gap-3">
              {neighbourhoods.map((area) => (
                <li key={area.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo("#neighbourhoods")}
                    data-cursor="link"
                    className="text-[0.9375rem] text-stone transition-colors duration-300 hover:text-bone"
                  >
                    {area.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-5">Office</p>
            <address className="not-italic">
              <p className="text-[0.9375rem] leading-relaxed text-stone">
                {site.contact.address}
                <br />
                {site.contact.city}
              </p>
              <a
                href={site.contact.phoneHref}
                data-cursor="link"
                className="mt-4 block text-[0.9375rem] text-bone transition-colors duration-300 hover:text-gold"
              >
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                data-cursor="link"
                className="mt-1.5 block text-[0.9375rem] text-stone transition-colors duration-300 hover:text-gold"
              >
                {site.contact.email}
              </a>
            </address>

            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="text-[0.8125rem] text-stone transition-colors duration-300 hover:text-gold"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------- Giant wordmark ---------- */}
      <div
        data-footer-word
        className="mt-20 flex justify-center overflow-hidden px-[var(--gutter)]"
        aria-hidden="true"
      >
        <p className="display flex text-[clamp(4.5rem,19vw,17rem)] leading-[0.82] tracking-[-0.045em] text-bone/[0.07]">
          {Array.from(site.name.replace(" ", " ")).map((letter, index) => (
            <span key={index} className="line-mask">
              <span data-footer-letter className="inline-block">
                {letter}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* ---------- Legal ---------- */}
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <div className="hairline-t flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-stone">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="text-[0.75rem] text-stone">
            {site.focus} · {site.marketLong}
          </p>
        </div>
      </div>
    </footer>
  );
}
