/**
 * Formatting helpers.
 *
 * A fixed locale ("en-US") is used deliberately rather than the visitor's
 * locale: the page is statically prerendered, and letting the number format
 * vary between server and client is a classic hydration mismatch.
 */

const groupedNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** 48500000 -> "EGP 48,500,000" */
export function formatPrice(value: number): string {
  return `EGP ${groupedNumber.format(Math.round(value))}`;
}

/** 48500000 -> "EGP 48.5M" — used where space is tight (cards, sliders). */
export function formatPriceShort(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    const digits = m < 10 && m % 1 !== 0 ? 1 : 0;
    return `EGP ${m.toFixed(digits)}M`;
  }
  if (value >= 1_000) {
    return `EGP ${Math.round(value / 1_000)}K`;
  }
  return `EGP ${groupedNumber.format(value)}`;
}

/** Plain grouped number, no currency. */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** 620 -> "620 m²" */
export function formatArea(value: number): string {
  return `${groupedNumber.format(value)} m²`;
}

/** Tailwind-friendly class joiner. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
