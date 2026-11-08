"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/format";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How far the button leans toward the pointer, 0–1. */
  strength?: number;
  variant?: "solid" | "outline" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * A button that leans toward the pointer and springs back on exit.
 *
 * The label moves slightly further than the shell, which reads as depth
 * rather than as the whole thing sliding. Magnetism is skipped entirely on
 * touch devices and under reduced motion — in both cases this is just a
 * well-styled button.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 0.38,
  variant = "solid",
  type = "button",
  disabled,
  ariaLabel,
}: MagneticButtonProps) {
  const shellRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const magnetic = hasFinePointer && !reducedMotion;

  // Created lazily so the tweens exist only on devices that use them.
  const quickRef = useRef<{
    shellX: gsap.QuickToFunc;
    shellY: gsap.QuickToFunc;
    labelX: gsap.QuickToFunc;
    labelY: gsap.QuickToFunc;
  } | null>(null);

  const ensureTweens = () => {
    if (quickRef.current || !shellRef.current || !labelRef.current) return;
    const config = { duration: 0.7, ease: "elastic.out(1, 0.5)" };
    quickRef.current = {
      shellX: gsap.quickTo(shellRef.current, "x", config),
      shellY: gsap.quickTo(shellRef.current, "y", config),
      labelX: gsap.quickTo(labelRef.current, "x", config),
      labelY: gsap.quickTo(labelRef.current, "y", config),
    };
  };

  const handleMove = (event: React.PointerEvent) => {
    if (!magnetic || !shellRef.current) return;
    ensureTweens();
    const rect = shellRef.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    quickRef.current?.shellX(offsetX * strength);
    quickRef.current?.shellY(offsetY * strength);
    // Label travels 1.5x further than the shell for a parallax feel.
    quickRef.current?.labelX(offsetX * strength * 0.5);
    quickRef.current?.labelY(offsetY * strength * 0.5);
  };

  const handleLeave = () => {
    if (!magnetic) return;
    ensureTweens();
    quickRef.current?.shellX(0);
    quickRef.current?.shellY(0);
    quickRef.current?.labelX(0);
    quickRef.current?.labelY(0);
  };

  const variants = {
    solid:
      "bg-gold text-obsidian hover:bg-champagne border border-gold hover:border-champagne",
    outline:
      "border border-[color:var(--hairline-strong)] text-bone hover:border-gold hover:text-gold bg-transparent",
    ghost: "border border-transparent text-bone hover:text-gold bg-transparent",
  } as const;

  const content = (
    <span
      ref={shellRef}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 will-change-transform",
        variants[variant],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <span ref={labelRef} className="relative z-10 inline-flex items-center gap-2.5 will-change-transform">
        {children}
      </span>
    </span>
  );

  const shared = {
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    "data-cursor": "button",
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a href={href} className="inline-block" {...shared}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block disabled:cursor-not-allowed"
      {...shared}
    >
      {content}
    </button>
  );
}
