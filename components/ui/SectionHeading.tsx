"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";
import { cn } from "@/lib/format";

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  title: string;
  /** Second line, rendered in the gold gradient. */
  titleAccent?: string;
  intro?: ReactNode;
  /** Right-hand slot, usually a button. */
  aside?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

/** Shared section header so every band on the page opens the same way. */
export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  intro,
  aside,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        align === "center" && "lg:flex-col lg:items-center lg:text-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Reveal>
          <p
            className={cn(
              "label flex items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            <span className="h-px w-10 bg-gold" />
            {eyebrow}
          </p>
        </Reveal>

        <h2 className="display mt-5 text-[clamp(2.4rem,5.6vw,5rem)] text-bone">
          <SplitText text={title} />
          {titleAccent ? (
            <span className="block">
              <SplitText text={titleAccent} accent delay={0.12} />
            </span>
          ) : null}
        </h2>

        {intro ? (
          <Reveal delay={0.12}>
            <div className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-stone">
              {intro}
            </div>
          </Reveal>
        ) : null}
      </div>

      {aside ? (
        <Reveal delay={0.2} className="shrink-0">
          {aside}
        </Reveal>
      ) : null}
    </div>
  );
}
