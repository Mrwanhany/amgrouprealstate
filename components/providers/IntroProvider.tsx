"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface IntroValue {
  /** True once the preloader has finished (or was skipped entirely). */
  introDone: boolean;
  markIntroDone: () => void;
}

const IntroContext = createContext<IntroValue>({
  introDone: true,
  markIntroDone: () => {},
});

export const useIntro = () => useContext(IntroContext);

/**
 * Lets the hero wait for the preloader without the two components knowing
 * anything about each other: the preloader flips the flag, the hero starts
 * its timeline when it sees it.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const markIntroDone = useCallback(() => setIntroDone(true), []);

  const value = useMemo(
    () => ({ introDone, markIntroDone }),
    [introDone, markIntroDone],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
