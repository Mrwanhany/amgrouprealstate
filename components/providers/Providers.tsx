"use client";

import type { ReactNode } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { IntroProvider } from "./IntroProvider";
import { SearchProvider } from "./SearchProvider";

/**
 * All client-side context in one place so the root layout can stay a
 * Server Component.
 *
 * Order matters: SmoothScrollProvider must be outermost because both the
 * preloader and the modal reach for it to lock scrolling.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <IntroProvider>
        <SearchProvider>{children}</SearchProvider>
      </IntroProvider>
    </SmoothScrollProvider>
  );
}
