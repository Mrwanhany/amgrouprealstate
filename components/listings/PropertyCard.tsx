"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { Listing } from "@/data/listings";
import { cn, formatArea, formatPriceShort } from "@/lib/format";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

interface PropertyCardProps {
  listing: Listing;
  onQuickView: (listing: Listing) => void;
  /** "rail" cards are wider and used inside the horizontal gallery. */
  variant?: "grid" | "rail";
  /** Passed to next/image for correct srcset selection. */
  sizes?: string;
}

/**
 * Listing card with a 3D tilt.
 *
 * The tilt is applied to an inner element while the outer element owns the
 * perspective, which is what makes the rotation look like a solid object
 * turning rather than a flat image skewing. The image and the badge are
 * pushed forward on the Z axis so they separate from the card face.
 *
 * Tilt is disabled on touch devices and under reduced motion; everything
 * else about the card is unchanged in those cases.
 */
export function PropertyCard({
  listing,
  onQuickView,
  variant = "grid",
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw",
}: PropertyCardProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const tiltEnabled = hasFinePointer && !reducedMotion;

  const quickRef = useRef<{
    rotateX: gsap.QuickToFunc;
    rotateY: gsap.QuickToFunc;
  } | null>(null);

  const ensureTweens = () => {
    if (quickRef.current || !innerRef.current) return;
    const config = { duration: 0.6, ease: "power3.out" };
    quickRef.current = {
      rotateX: gsap.quickTo(innerRef.current, "rotateX", config),
      rotateY: gsap.quickTo(innerRef.current, "rotateY", config),
    };
  };

  const handleMove = (event: React.PointerEvent) => {
    if (!tiltEnabled || !outerRef.current) return;
    ensureTweens();

    const rect = outerRef.current.getBoundingClientRect();
    // Normalise pointer position to -0.5 … 0.5 across the card.
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    quickRef.current?.rotateY(x * 13);
    quickRef.current?.rotateX(-y * 11);
  };

  const handleLeave = () => {
    if (!tiltEnabled) return;
    ensureTweens();
    quickRef.current?.rotateX(0);
    quickRef.current?.rotateY(0);
  };

  const isRental = listing.status === "rent";

  return (
    <div
      ref={outerRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("group relative h-full", variant === "rail" && "select-none")}
      style={{ perspective: tiltEnabled ? "1100px" : undefined }}
    >
      <div
        ref={innerRef}
        className="relative flex h-full flex-col overflow-hidden rounded-lg border border-[color:var(--hairline)] bg-graphite transition-colors duration-500 group-hover:border-gold/45"
        style={{ transformStyle: tiltEnabled ? "preserve-3d" : undefined }}
      >
        {/* ---------- Image ---------- */}
        <div
          className={cn(
            "img-skeleton relative overflow-hidden",
            variant === "rail" ? "aspect-[4/3]" : "aspect-[3/2]",
          )}
          style={tiltEnabled ? { transform: "translateZ(28px)" } : undefined}
        >
          <Image
            src={listing.image}
            alt={`${listing.title} — ${listing.address}`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.09]"
          />

          {/* Bottom scrim so the badge row stays readable on pale photos */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent opacity-80"
          />

          {/* Status + feature badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full border border-bone/25 bg-obsidian/70 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-bone backdrop-blur-sm">
              {isRental ? "To let" : "For sale"}
            </span>
            {listing.badge ? (
              <span className="rounded-full bg-gold px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-obsidian">
                {listing.badge}
              </span>
            ) : null}
          </div>

          {/* Price — slides up and gains its rule on hover */}
          <div
            className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3"
            style={tiltEnabled ? { transform: "translateZ(46px)" } : undefined}
          >
            <div className="overflow-hidden">
              <p className="display text-[1.75rem] leading-none text-bone transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-0.5">
                {formatPriceShort(listing.price)}
                {isRental ? (
                  <span className="ml-1 font-sans text-xs tracking-wide text-stone">
                    / month
                  </span>
                ) : null}
              </p>
              <span className="mt-2 block h-px w-0 bg-gold transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full" />
            </div>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="flex flex-1 flex-col p-5">
          <p className="label !text-[0.5625rem]">{listing.neighbourhood}</p>

          <h3 className="display mt-2 text-[1.4rem] leading-tight text-bone">
            {listing.title}
          </h3>

          <p className="mt-1.5 text-sm text-stone">{listing.address}</p>

          <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-bone/80">
            <Spec label="Beds" value={String(listing.beds)} />
            <Spec label="Baths" value={String(listing.baths)} />
            <Spec label="Area" value={formatArea(listing.area)} />
          </dl>

          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <span className="text-[0.8125rem] text-stone">{listing.type}</span>

            <button
              type="button"
              onClick={() => onQuickView(listing)}
              data-cursor="view"
              data-cursor-label="View"
              className="group/btn inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:text-gold"
            >
              Quick view
              <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover/btn:translate-x-1">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M1 8h13M9 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sr-only">{listing.title}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="label !text-[0.5625rem] !tracking-[0.14em]">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
