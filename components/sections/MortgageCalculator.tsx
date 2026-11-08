"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { calculateMortgage } from "@/lib/mortgage";
import { formatPriceShort } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Mortgage calculator.
 *
 * Four sliders, one animated monthly figure, and a donut showing how much of
 * the total goes to the bank. The maths lives in lib/mortgage.ts so it can
 * be read and checked without wading through JSX.
 *
 * These are indicative figures only — the copy says so, because showing
 * someone a precise-looking number for a loan they haven't been offered is
 * not a favour.
 */
export function MortgageCalculator() {
  const [price, setPrice] = useState(14_000_000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [annualRatePct, setAnnualRatePct] = useState(14.5);
  const [years, setYears] = useState(20);

  const reducedMotion = usePrefersReducedMotion();

  const result = useMemo(
    () => calculateMortgage({ price, downPaymentPct, annualRatePct, years }),
    [price, downPaymentPct, annualRatePct, years],
  );

  // Donut geometry
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const principalArc = circumference * result.principalShare;

  return (
    <section id="calculator" className="relative py-[var(--section-y)]">
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="Affordability"
          title="What it actually"
          titleAccent="costs per month."
          intro="Drag the sliders. Egyptian mortgage rates sit somewhere between 12% and 20% depending on the bank and your profile, so the default here is deliberately realistic rather than flattering."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[color:var(--hairline)] lg:grid-cols-[1.1fr_1fr]">
          {/* ---------- Inputs ---------- */}
          <div className="bg-graphite p-8 lg:p-10">
            <Slider
              id="price"
              label="Property price"
              value={price}
              min={2_000_000}
              max={60_000_000}
              step={250_000}
              display={formatPriceShort(price)}
              onChange={setPrice}
            />

            <Slider
              id="deposit"
              label="Down payment"
              value={downPaymentPct}
              min={5}
              max={80}
              step={1}
              display={`${downPaymentPct}% · ${formatPriceShort(result.downPayment)}`}
              onChange={setDownPaymentPct}
            />

            <Slider
              id="rate"
              label="Interest rate"
              value={annualRatePct}
              min={5}
              max={25}
              step={0.25}
              display={`${annualRatePct.toFixed(2)}%`}
              onChange={setAnnualRatePct}
            />

            <Slider
              id="term"
              label="Term"
              value={years}
              min={3}
              max={30}
              step={1}
              display={`${years} years`}
              onChange={setYears}
              last
            />

            <p className="hairline-t mt-8 pt-6 text-[0.8125rem] leading-relaxed text-stone">
              Indicative only. Excludes registration fees, maintenance deposits,
              insurance and any developer payment plan. We will introduce you to
              a broker who can quote properly.
            </p>
          </div>

          {/* ---------- Results ---------- */}
          <div className="relative flex flex-col justify-between bg-obsidian p-8 lg:p-10">
            <div>
              <p className="label">Estimated monthly payment</p>

              <p className="display mt-4 text-[clamp(2.75rem,6vw,4.5rem)] leading-none text-gold">
                <span className="font-sans text-[0.32em] align-top tracking-wide text-stone">
                  EGP{" "}
                </span>
                <AnimatedNumber value={result.monthlyPayment} className="tabular-nums" />
              </p>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
                {/* Donut */}
                <div className="relative h-44 w-44 shrink-0">
                  <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="16"
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={false}
                      animate={{ strokeDashoffset: circumference - principalArc }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="display text-2xl text-bone">
                      <AnimatedNumber
                        value={result.principalShare * 100}
                        decimals={0}
                        className="tabular-nums"
                      />
                      %
                    </p>
                    <p className="label !text-[0.5rem]">Principal</p>
                  </div>
                </div>

                <dl className="flex flex-1 flex-col gap-4">
                  <Figure label="Loan amount" value={result.principal} />
                  <Figure label="Total interest" value={result.totalInterest} muted />
                  <Figure label="Total repaid" value={result.totalPaid} />
                </dl>
              </div>
            </div>

            <Reveal delay={0.1} className="mt-10">
              <div className="flex flex-wrap gap-3">
                <MagneticButton href="#contact">
                  Get a mortgage introduction
                </MagneticButton>
                <MagneticButton href="#all-listings" variant="outline">
                  Find something in budget
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  last?: boolean;
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  last,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={last ? "" : "mb-8"}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label">
          {label}
        </label>
        <span className="text-[0.9375rem] tabular-nums text-gold">{display}</span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={display}
        className="w-full"
        style={{
          background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${percent}%, var(--ink) ${percent}%, var(--ink) 100%)`,
          height: 4,
          borderRadius: 999,
        }}
      />
    </div>
  );
}

function Figure({
  label,
  value,
  muted,
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[color:var(--hairline)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[0.8125rem] text-stone">{label}</dt>
      <dd
        className={`text-[0.9375rem] tabular-nums ${muted ? "text-stone" : "text-bone"}`}
      >
        <span className="text-[0.75em] text-stone">EGP </span>
        <AnimatedNumber value={value} />
      </dd>
    </div>
  );
}
