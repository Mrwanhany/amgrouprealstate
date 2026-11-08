"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Custom cursor.
 *
 * A small filled dot that tracks the pointer exactly, plus a ring that trails
 * it. Any element carrying `data-cursor="<state>"` changes the ring when
 * hovered; `data-cursor-label="View"` additionally prints a word inside it.
 *
 * Rendered only for devices with a fine, hoverable pointer and only when the
 * visitor has not asked for reduced motion. On every other device this
 * component renders nothing at all and the native cursor is untouched.
 */
export function CursorProvider() {
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = hasFinePointer && !reducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<string>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.removeAttribute("data-custom-cursor");
      return;
    }

    document.body.setAttribute("data-custom-cursor", "on");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // quickTo creates a reusable tween — far cheaper than a new tween
    // per mousemove event.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      setVisible(true);
    };

    // Delegated hover detection — one listener for the whole document
    // instead of a pair on every interactive element.
    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      if (target) {
        setState(target.dataset.cursor || "link");
        setLabel(target.dataset.cursorLabel || "");
      } else {
        setState("default");
        setLabel("");
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.body.removeAttribute("data-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const isActive = state !== "default";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 220ms ease" }}
    >
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border will-change-transform"
        style={{
          width: isActive ? 76 : 34,
          height: isActive ? 76 : 34,
          marginLeft: isActive ? -38 : -17,
          marginTop: isActive ? -38 : -17,
          borderColor: isActive ? "var(--gold)" : "var(--hairline-strong)",
          backgroundColor: isActive
            ? "color-mix(in srgb, var(--gold) 14%, transparent)"
            : "transparent",
          backdropFilter: isActive ? "blur(2px)" : "none",
          transition:
            "width 380ms cubic-bezier(.16,1,.3,1), height 380ms cubic-bezier(.16,1,.3,1), margin 380ms cubic-bezier(.16,1,.3,1), background-color 280ms ease, border-color 280ms ease",
        }}
      >
        <span
          className="label !text-[9px] !tracking-[0.18em] text-bone"
          style={{
            opacity: label ? 1 : 0,
            transform: `scale(${label ? 1 : 0.7})`,
            transition: "opacity 240ms ease, transform 240ms ease",
          }}
        >
          {label}
        </span>
      </div>

      {/* Exact-tracking dot — hidden while the ring is expanded */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone will-change-transform"
        style={{
          marginLeft: -3,
          marginTop: -3,
          opacity: isActive ? 0 : 1,
          transition: "opacity 220ms ease",
        }}
      />
    </div>
  );
}
