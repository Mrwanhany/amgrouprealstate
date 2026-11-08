"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Listing } from "@/data/listings";
import { formatArea, formatPrice } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Modal } from "@/components/ui/Modal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { site } from "@/data/site";

interface QuickViewModalProps {
  listing: Listing | null;
  onClose: () => void;
}

/**
 * Quick-view dialog: gallery on the left, specification on the right.
 * Accessibility (focus trap, Escape, scroll lock) lives in <Modal>.
 */
export function QuickViewModal({ listing, onClose }: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [shownListingId, setShownListingId] = useState(listing?.id);
  const reducedMotion = usePrefersReducedMotion();

  // Reset to the first photograph whenever a different listing is opened.
  // Adjusting state during render is React's documented pattern for this and
  // avoids the extra commit a reset-in-an-effect would cause.
  if (listing?.id !== shownListingId) {
    setShownListingId(listing?.id);
    setActiveImage(0);
  }

  const images = listing ? [listing.image, ...listing.gallery] : [];

  return (
    <Modal open={Boolean(listing)} onClose={onClose} labelledBy="quick-view-title">
      {listing ? (
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          {/* ---------- Gallery ---------- */}
          <div className="relative">
            <div className="img-skeleton relative aspect-[4/3] overflow-hidden lg:h-full lg:aspect-auto lg:min-h-[32rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.15 : 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Image
                    src={images[activeImage]}
                    alt={`${listing.title}, photograph ${activeImage + 1} of ${images.length}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent"
              />
            </div>

            {/* Thumbnails */}
            <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show photograph ${index + 1}`}
                  aria-current={index === activeImage}
                  data-cursor="link"
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded border transition-all duration-500 ${
                    index === activeImage
                      ? "border-gold opacity-100"
                      : "border-transparent opacity-55 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ---------- Detail ---------- */}
          <div className="flex flex-col p-7 lg:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label !text-[0.5625rem]">
                  {listing.neighbourhood} · {listing.type}
                </p>
                <h2
                  id="quick-view-title"
                  className="display mt-2.5 text-[clamp(1.75rem,3.2vw,2.5rem)] text-bone"
                >
                  {listing.title}
                </h2>
                <p className="mt-2 text-sm text-stone">{listing.address}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                data-cursor="button"
                className="shrink-0 rounded-full border border-[color:var(--hairline-strong)] p-2.5 text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <p className="display mt-6 text-[2.25rem] leading-none text-gold">
              {formatPrice(listing.price)}
              {listing.status === "rent" ? (
                <span className="ml-2 font-sans text-sm tracking-wide text-stone">
                  per month
                </span>
              ) : null}
            </p>

            <p className="mt-5 leading-relaxed text-bone/80">
              {listing.description}
            </p>

            {/* Specification table */}
            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-3">
              {[
                ["Bedrooms", String(listing.beds)],
                ["Bathrooms", String(listing.baths)],
                ["Built area", formatArea(listing.area)],
                ["Parking", `${listing.parking} cars`],
                ["Built", String(listing.yearBuilt)],
                ["Reference", listing.id.toUpperCase()],
              ].map(([label, value]) => (
                <div key={label} className="bg-graphite p-4">
                  <dt className="label !text-[0.5rem]">{label}</dt>
                  <dd className="mt-1.5 text-[0.9375rem] tabular-nums text-bone">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Features */}
            <div className="mt-7">
              <p className="label">Features</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {listing.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-[color:var(--hairline)] px-3.5 py-1.5 text-[0.8125rem] text-bone/80"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <MagneticButton
                href={`mailto:${site.contact.salesEmail}?subject=${encodeURIComponent(
                  `Viewing request — ${listing.title} (${listing.id.toUpperCase()})`,
                )}`}
              >
                Request a viewing
              </MagneticButton>
              <MagneticButton href={site.contact.phoneHref} variant="outline">
                {site.contact.phone}
              </MagneticButton>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
