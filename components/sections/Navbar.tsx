"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Navigation bar.
 *
 * Hides when you scroll down and reappears the moment you scroll up — the
 * direction comes from the shared Lenis instance rather than from a second
 * scroll listener, so there is exactly one source of truth.
 *
 * The bar is translucent at the top of the page and gains a blurred,
 * hairline-bordered background once you have scrolled past the hero fold.
 */
export function Navbar() {
  const { direction, scrollY, scrollTo } = useSmoothScroll();
  const reducedMotion = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = scrollY > 80;
  // Never hide while the mobile menu is open, or near the very top.
  const hidden = !menuOpen && direction === "down" && scrollY > 420;

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setMenuOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    // Let the menu's exit animation start before the scroll takes over.
    window.setTimeout(() => scrollTo(href), menuOpen ? 220 : 0);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[250] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-obsidian"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[100]"
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{
          duration: reducedMotion ? 0 : 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div
          className={cn(
            "transition-[background-color,backdrop-filter,border-color] duration-500",
            scrolled || menuOpen
              ? "border-b border-[color:var(--hairline)] bg-obsidian/72 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex h-[4.5rem] max-w-[115rem] items-center justify-between px-[var(--gutter)] lg:h-20"
          >
            {/* Wordmark */}
            <button
              type="button"
              onClick={() => scrollTo(0)}
              data-cursor="link"
              className="group flex items-baseline gap-2.5 text-left"
              aria-label={`${site.name} — back to top`}
            >
              <span className="display text-[1.6rem] leading-none text-bone transition-colors duration-500 group-hover:text-champagne">
                {site.name}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-gold sm:block" />
              <span className="label hidden !text-[0.5625rem] sm:block">
                Est. 2014
              </span>
            </button>

            {/* Desktop links */}
            <ul className="hidden items-center gap-9 lg:flex">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => go(item.href)}
                    data-cursor="link"
                    className="group relative py-2 text-[0.8125rem] font-medium tracking-[0.02em] text-bone/75 transition-colors duration-300 hover:text-bone"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <MagneticButton
                href={site.contact.phoneHref}
                variant="outline"
                className="!hidden !px-5 !py-2.5 !text-[0.6875rem] xl:!inline-flex"
              >
                {site.contact.phone}
              </MagneticButton>

              <div className="hidden lg:block">
                <MagneticButton onClick={() => go("#contact")}>
                  Book a viewing
                </MagneticButton>
              </div>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                data-cursor="button"
                className="relative z-[120] flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline-strong)] lg:hidden"
              >
                <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
                <span className="relative block h-3 w-5">
                  <motion.span
                    className="absolute left-0 block h-px w-full bg-bone"
                    animate={
                      menuOpen
                        ? { top: "50%", rotate: 45 }
                        : { top: 0, rotate: 0 }
                    }
                    transition={{ duration: reducedMotion ? 0 : 0.35 }}
                  />
                  <motion.span
                    className="absolute left-0 block h-px w-full bg-bone"
                    animate={
                      menuOpen
                        ? { top: "50%", rotate: -45 }
                        : { top: "100%", rotate: 0 }
                    }
                    transition={{ duration: reducedMotion ? 0 : 0.35 }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-obsidian px-[var(--gutter)] pb-12 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{
              duration: reducedMotion ? 0.12 : 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <ul className="flex flex-col gap-1">
              {site.nav.map((item, index) => (
                <li key={item.href} className="line-mask">
                  <motion.button
                    type="button"
                    onClick={() => go(item.href)}
                    className="display block w-full py-1.5 text-left text-[clamp(2.25rem,11vw,3.5rem)] text-bone"
                    initial={{ y: reducedMotion ? 0 : "115%", opacity: reducedMotion ? 0 : 1 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: reducedMotion ? 0 : "115%", opacity: reducedMotion ? 0 : 1 }}
                    transition={{
                      duration: reducedMotion ? 0.12 : 0.75,
                      delay: reducedMotion ? 0 : 0.12 + index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span className="mr-3 align-super text-[0.75rem] text-gold">
                      0{index + 1}
                    </span>
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>

            <motion.div
              className="hairline-t flex flex-col gap-4 pt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.45, duration: 0.5 }}
            >
              <a
                href={site.contact.phoneHref}
                className="text-lg text-bone transition-colors hover:text-gold"
              >
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="text-lg text-stone transition-colors hover:text-gold"
              >
                {site.contact.email}
              </a>
              <p className="label pt-2">
                {site.contact.address} · {site.contact.city}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
