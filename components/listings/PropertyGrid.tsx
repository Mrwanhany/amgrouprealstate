"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Listing } from "@/data/listings";
import { useSearch } from "@/components/providers/SearchProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  onQuickView: (listing: Listing) => void;
}

/**
 * Filtered results grid.
 *
 * `layout` on each item means Framer Motion measures the before/after
 * positions and FLIPs the cards into their new places, so re-filtering
 * re-flows smoothly instead of the grid jumping. Items that leave animate
 * out via AnimatePresence rather than vanishing.
 */
export function PropertyGrid({ onQuickView }: PropertyGridProps) {
  const { results, reset } = useSearch();
  const reducedMotion = usePrefersReducedMotion();

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[color:var(--hairline-strong)] px-6 py-24 text-center"
      >
        <p className="display text-3xl text-bone">Nothing matches — yet.</p>
        <p className="mt-3 max-w-md text-stone">
          Our off-market book is considerably longer than this page. Clear the
          filters, or tell us what you are looking for and we will go find it.
        </p>
        <button
          type="button"
          onClick={reset}
          data-cursor="button"
          className="mt-7 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-gold underline underline-offset-4"
        >
          Clear all filters
        </button>
      </motion.div>
    );
  }

  return (
    <motion.ul
      layout={!reducedMotion}
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {results.map((listing, index) => (
          <motion.li
            key={listing.id}
            layout={!reducedMotion}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 26, scale: reducedMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
            transition={{
              duration: reducedMotion ? 0.15 : 0.6,
              // Cap the stagger so a 12-card reflow doesn't crawl.
              delay: reducedMotion ? 0 : Math.min(index * 0.05, 0.4),
              ease: [0.16, 1, 0.3, 1],
              layout: { type: "spring", stiffness: 320, damping: 36 },
            }}
          >
            <PropertyCard listing={listing} onQuickView={onQuickView} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
