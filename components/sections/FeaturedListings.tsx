"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { featuredListings, listings, type Listing } from "@/data/listings";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { PropertyGrid } from "@/components/listings/PropertyGrid";
import { SearchFilters } from "@/components/listings/SearchFilters";
import { QuickViewModal } from "@/components/listings/QuickViewModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Divider } from "@/components/ui/Divider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { formatNumber } from "@/lib/format";

/**
 * Featured listings.
 *
 * On desktop the gallery pins and scrolls sideways: vertical wheel input is
 * translated into horizontal movement of the rail, with each card's image
 * counter-parallaxing slightly so the row has depth rather than sliding as
 * one flat strip.
 *
 * Below the fold the same data powers an interactive, filterable grid.
 */
export function FeaturedListings() {
  const [quickView, setQuickView] = useState<Listing | null>(null);

  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const horizontalEnabled = !isMobile && !reducedMotion;

  useGSAP(
    () => {
      if (!horizontalEnabled) return;

      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      // Measured in a function so `invalidateOnRefresh` recalculates it on
      // resize instead of baking in the first viewport width.
      const getDistance = () =>
        Math.max(track.scrollWidth - window.innerWidth + 96, 0);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Counter-parallax on each image, driven by the same scroll.
      // Scoped to this section — gsap.utils.toArray is not context-aware.
      const cards = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-rail-card]"),
      );
      cards.forEach((card) => {
        const image = card.querySelector("img");
        if (!image) return;

        gsap.fromTo(
          image,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });

      // Progress bar under the rail.
      gsap.to("[data-rail-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: true,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((instance) => {
          if (instance.trigger === pin) instance.kill();
        });
      };
    },
    { scope: pinRef, dependencies: [horizontalEnabled] },
  );

  return (
    <section id="listings" className="relative pt-[var(--section-y)]">
      {/* ---------- Heading ---------- */}
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="Featured properties"
          title="A short list,"
          titleAccent="carefully kept."
          intro={
            <>
              We list a fraction of what we see. These are the {formatNumber(featuredListings.length)}{" "}
              currently open for viewing across New Cairo, Zayed, Zamalek and
              the New Capital.
            </>
          }
          aside={
            <MagneticButton variant="outline" href="#all-listings">
              Browse all {formatNumber(listings.length)}
            </MagneticButton>
          }
        />
      </div>

      {/* ---------- Pinned horizontal rail ---------- */}
      <div
        ref={pinRef}
        className={
          horizontalEnabled
            ? "relative mt-16 flex h-[100svh] flex-col justify-center overflow-hidden"
            : "relative mt-14"
        }
      >
        <ul
          ref={trackRef}
          className={
            horizontalEnabled
              ? "flex w-max gap-6 px-[var(--gutter)] will-change-transform"
              : "flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:thin]"
          }
        >
          {featuredListings.map((listing, index) => (
            <li
              key={listing.id}
              data-rail-card
              className={
                horizontalEnabled
                  ? "w-[min(78vw,30rem)] shrink-0"
                  : "w-[min(82vw,24rem)] shrink-0 snap-start"
              }
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="label !text-[0.5625rem] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-[color:var(--hairline)]" />
              </div>

              <PropertyCard
                listing={listing}
                onQuickView={setQuickView}
                variant="rail"
                sizes="(max-width: 1024px) 82vw, 30rem"
              />
            </li>
          ))}

          {/* Tail card — the rail ends on an invitation, not a hard stop. */}
          <li
            className={
              horizontalEnabled
                ? "flex w-[min(60vw,22rem)] shrink-0 items-center"
                : "flex w-[min(70vw,18rem)] shrink-0 snap-start items-center"
            }
          >
            <div className="w-full rounded-lg border border-dashed border-[color:var(--hairline-strong)] p-8">
              <p className="display text-3xl leading-tight text-bone">
                Not seeing it?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                Roughly half our stock never reaches a portal. Tell us the brief
                and we will send what matches, usually within 48 hours.
              </p>
              <div className="mt-6">
                <MagneticButton href="#contact" variant="outline">
                  Send a brief
                </MagneticButton>
              </div>
            </div>
          </li>
        </ul>

        {/* Rail progress */}
        {horizontalEnabled ? (
          <div className="mx-[var(--gutter)] mt-10 h-px bg-[color:var(--hairline)]">
            <div
              data-rail-progress
              className="h-px origin-left scale-x-0 bg-gold"
            />
          </div>
        ) : null}
      </div>

      {/* ---------- Filterable grid ---------- */}
      <div
        id="all-listings"
        className="mx-auto mt-[var(--section-y)] max-w-[115rem] scroll-mt-28 px-[var(--gutter)]"
      >
        <Divider className="mb-[var(--section-y)]" />

        <SectionHeading
          eyebrow="The full book"
          title="Find your"
          titleAccent="address."
          intro="Filter by area, type, budget and size. The grid re-orders itself as you go."
        />

        <Reveal className="mt-12">
          <SearchFilters />
        </Reveal>

        <div className="mt-10">
          <PropertyGrid onQuickView={setQuickView} />
        </div>
      </div>

      <QuickViewModal listing={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
