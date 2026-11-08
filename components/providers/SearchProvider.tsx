"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { listings, priceBounds, type Listing } from "@/data/listings";

export interface Filters {
  neighbourhood: string; // "" = any
  type: string; // "" = any
  status: "" | "sale" | "rent";
  /** Upper bound in EGP. Rentals are compared against a monthly figure. */
  maxPrice: number;
  /** Minimum bedrooms. 0 = any. */
  beds: number;
}

export const defaultFilters: Filters = {
  neighbourhood: "",
  type: "",
  status: "",
  maxPrice: priceBounds.max,
  beds: 0,
};

interface SearchValue {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setFilters: (next: Partial<Filters>) => void;
  reset: () => void;
  results: Listing[];
  activeCount: number;
}

const SearchContext = createContext<SearchValue | null>(null);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used inside <SearchProvider>");
  }
  return context;
}

/**
 * Holds the listing filters.
 *
 * Lifted to a provider because two very distant components write to it —
 * the hero's search bar and the filter bar above the grid — and the grid
 * reads it. Filtering is a cheap synchronous pass over a local array, so
 * it is derived during render rather than stored.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFiltersState((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const setFilters = useCallback((next: Partial<Filters>) => {
    setFiltersState((previous) => ({ ...previous, ...next }));
  }, []);

  const reset = useCallback(() => setFiltersState(defaultFilters), []);

  const results = useMemo(() => {
    return listings.filter((listing) => {
      if (filters.neighbourhood && listing.neighbourhood !== filters.neighbourhood) {
        return false;
      }
      if (filters.type && listing.type !== filters.type) return false;
      if (filters.status && listing.status !== filters.status) return false;
      if (filters.beds && listing.beds < filters.beds) return false;

      // A rental's monthly figure would always clear a sale-sized budget,
      // so the price ceiling only constrains sales unless the visitor has
      // explicitly asked for rentals.
      if (listing.status === "sale" && listing.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.neighbourhood) count += 1;
    if (filters.type) count += 1;
    if (filters.status) count += 1;
    if (filters.beds) count += 1;
    if (filters.maxPrice < priceBounds.max) count += 1;
    return count;
  }, [filters]);

  const value = useMemo(
    () => ({ filters, setFilter, setFilters, reset, results, activeCount }),
    [filters, setFilter, setFilters, reset, results, activeCount],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
