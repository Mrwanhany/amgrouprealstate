"use client";

import { motion } from "framer-motion";
import { useSearch } from "@/components/providers/SearchProvider";
import { neighbourhoodOptions, priceBounds, typeOptions } from "@/data/listings";
import { cn, formatPriceShort } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Filter bar above the listings grid.
 *
 * Status and bedrooms are segmented pill groups (fast, thumb-friendly);
 * area and type are native selects (long lists, better handled by the OS);
 * budget is a range input. Everything writes to the shared search context,
 * so the hero's quick search and this bar stay in sync automatically.
 */
export function SearchFilters() {
  const { filters, setFilter, reset, results, activeCount } = useSearch();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="rounded-xl border border-[color:var(--hairline)] bg-graphite/60 p-5 backdrop-blur-sm lg:p-6">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-6">
        {/* Buy / rent */}
        <fieldset className="min-w-[13rem]">
          <legend className="label mb-2.5">Looking to</legend>
          <div className="flex gap-1.5">
            {[
              { value: "", label: "All" },
              { value: "sale", label: "Buy" },
              { value: "rent", label: "Rent" },
            ].map((option) => (
              <Pill
                key={option.value}
                active={filters.status === option.value}
                onClick={() =>
                  setFilter("status", option.value as "" | "sale" | "rent")
                }
                layoutId="status-pill"
                reducedMotion={reducedMotion}
              >
                {option.label}
              </Pill>
            ))}
          </div>
        </fieldset>

        {/* Area */}
        <Select
          label="Area"
          value={filters.neighbourhood}
          onChange={(value) => setFilter("neighbourhood", value)}
          options={neighbourhoodOptions}
          anyLabel="Any area"
        />

        {/* Type */}
        <Select
          label="Property type"
          value={filters.type}
          onChange={(value) => setFilter("type", value)}
          options={typeOptions}
          anyLabel="Any type"
        />

        {/* Bedrooms */}
        <fieldset className="min-w-[14rem]">
          <legend className="label mb-2.5">Bedrooms</legend>
          <div className="flex gap-1.5">
            {[0, 2, 3, 4, 5].map((count) => (
              <Pill
                key={count}
                active={filters.beds === count}
                onClick={() => setFilter("beds", count)}
                layoutId="beds-pill"
                reducedMotion={reducedMotion}
              >
                {count === 0 ? "Any" : `${count}+`}
              </Pill>
            ))}
          </div>
        </fieldset>

        {/* Budget */}
        <div className="min-w-[15rem] flex-1">
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <label htmlFor="budget" className="label">
              Max budget
            </label>
            <span className="text-[0.8125rem] tabular-nums text-gold">
              {filters.maxPrice >= priceBounds.max
                ? "No limit"
                : formatPriceShort(filters.maxPrice)}
            </span>
          </div>
          <input
            id="budget"
            type="range"
            min={2000000}
            max={priceBounds.max}
            step={500000}
            value={filters.maxPrice}
            onChange={(event) =>
              setFilter("maxPrice", Number(event.target.value))
            }
            aria-valuetext={
              filters.maxPrice >= priceBounds.max
                ? "No limit"
                : formatPriceShort(filters.maxPrice)
            }
            className="w-full"
            style={{
              // Fill the track up to the thumb in gold.
              background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${
                ((filters.maxPrice - 2000000) / (priceBounds.max - 2000000)) * 100
              }%, var(--ink) ${
                ((filters.maxPrice - 2000000) / (priceBounds.max - 2000000)) * 100
              }%, var(--ink) 100%)`,
              height: 4,
              borderRadius: 999,
            }}
          />
          <p className="mt-2 text-[0.6875rem] text-stone">
            Applies to sale prices. Rentals are quoted monthly.
          </p>
        </div>
      </div>

      {/* Result count + reset */}
      <div className="hairline-t mt-6 flex flex-wrap items-center justify-between gap-4 pt-5">
        <p className="text-sm text-stone" aria-live="polite">
          <span className="tabular-nums text-bone">{results.length}</span>{" "}
          {results.length === 1 ? "property" : "properties"} match
          {activeCount > 0 ? (
            <span className="text-stone">
              {" "}
              · {activeCount} filter{activeCount === 1 ? "" : "s"} active
            </span>
          ) : null}
        </p>

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={reset}
            data-cursor="button"
            className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone underline decoration-gold/50 underline-offset-4 transition-colors duration-300 hover:text-gold"
          >
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Pill({
  active,
  onClick,
  children,
  layoutId,
  reducedMotion,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  layoutId: string;
  reducedMotion: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-cursor="button"
      className={cn(
        "relative rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-300",
        active ? "text-obsidian" : "text-bone/70 hover:text-bone",
      )}
    >
      {/* The gold lozenge slides between options via a shared layoutId. */}
      {active ? (
        <motion.span
          layoutId={reducedMotion ? undefined : layoutId}
          className="absolute inset-0 -z-10 rounded-full bg-gold"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        />
      ) : (
        <span className="absolute inset-0 -z-10 rounded-full border border-[color:var(--hairline)]" />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  anyLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  anyLabel: string;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="min-w-[11rem]">
      <label htmlFor={id} className="label mb-2.5 block">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-cursor="link"
        className="w-full cursor-pointer appearance-none rounded-full border border-[color:var(--hairline)] bg-transparent px-4 py-2 text-[0.875rem] text-bone outline-none transition-colors duration-300 hover:border-gold/50"
      >
        <option value="" className="bg-graphite">
          {anyLabel}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-graphite">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
