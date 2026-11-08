"use client";

import { useCallback, useSyncExternalStore } from "react";

/** A subscribe function for stores that never change during a session. */
const neverChanges = () => () => {};

/**
 * Tracks a media query.
 *
 * Implemented with `useSyncExternalStore` rather than useState + useEffect:
 * matchMedia is exactly the kind of external, subscribable store the hook
 * exists for. It also gives us a proper server snapshot, so the prerendered
 * HTML is generated as though the query did not match and React reconciles
 * on the client without a hydration mismatch — and without the extra render
 * pass a setState-in-effect would cost.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // On the server nothing matches: the static shell is the "no special
  // capability" case, which every component here degrades to safely.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True when the visitor has asked their OS to reduce motion.
 * Every animated component checks this and degrades to a static or
 * opacity-only presentation.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Phones and small tablets — where we drop the heavy effects. */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 1023px)");
}

/**
 * True only for devices with a real, hoverable pointer.
 * Gates the custom cursor and the 3D tilt, both of which are meaningless
 * (and janky) on touch.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * True once the component has mounted on the client. Use it to defer
 * anything that genuinely cannot match the server output, such as a portal.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/**
 * Whether the branded intro has already run in this browser session.
 *
 * The server snapshot is `true` ("already played") so the preloader is never
 * part of the prerendered HTML — returning visitors would otherwise see it
 * flash before the client could decide to skip it.
 */
export function useIntroAlreadyPlayed(sessionKey: string): boolean {
  const getSnapshot = useCallback(() => {
    try {
      return window.sessionStorage.getItem(sessionKey) === "1";
    } catch {
      // Private browsing can throw on access; treat it as "not played".
      return false;
    }
  }, [sessionKey]);

  return useSyncExternalStore(neverChanges, getSnapshot, () => true);
}
