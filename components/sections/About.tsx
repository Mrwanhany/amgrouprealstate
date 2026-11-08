"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { milestones, team } from "@/data/team";
import { site } from "@/data/site";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Divider } from "@/components/ui/Divider";
import { BeforeAfter } from "@/components/listings/BeforeAfter";

/**
 * Staging comparison.
 *
 * These are stock stand-ins: two different reception rooms, chosen because
 * they share a framing and a palette so the wipe reads plausibly. REPLACE
 * THEM with a genuine pair — the same room photographed before and after
 * styling — before this goes live. A comparison slider only earns its place
 * when both halves are the same space.
 */
const BEFORE =
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1800&q=80";
const AFTER =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80";

/**
 * About: the firm, the staging work, the timeline and the team.
 *
 * The portrait grid uses a small per-card parallax — each photograph drifts
 * at a slightly different rate — which stops four headshots in a row from
 * reading as a static contact sheet.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      const sectionElement = root.current;
      if (!sectionElement) return;

      // Scoped explicitly: gsap.utils.toArray is not context-aware.
      const photos = gsap.utils.toArray<HTMLElement>(
        sectionElement.querySelectorAll("[data-team-photo]"),
      );

      photos.forEach((photo, index) => {
        gsap.fromTo(
          photo,
          { yPercent: -4 },
          {
            yPercent: 4 + (index % 2) * 3,
            ease: "none",
            scrollTrigger: {
              trigger: photo,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [reducedMotion] },
  );

  return (
    <section ref={root} id="about" className="relative py-[var(--section-y)]">
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="About us"
          title="One office,"
          titleAccent="never moved."
          intro={`${site.principal} opened ${site.name} with a single desk in Fifth Settlement in 2014. The desk has become a team of fourteen; the address has not changed.`}
        />

        {/* ---------- Staging comparison ---------- */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-14">
          <Reveal>
            <BeforeAfter
              beforeSrc={BEFORE}
              afterSrc={AFTER}
              beforeAlt="A reception room before staging, empty and unfurnished"
              afterAlt="The same reception room after staging, furnished and lit"
              beforeLabel="As found"
              afterLabel="As listed"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <p className="label">Staging, included</p>
              <h3 className="display mt-4 text-[clamp(1.875rem,3.4vw,2.75rem)] leading-tight text-bone">
                We photograph it the way it deserves to be seen.
              </h3>
              <p className="mt-5 leading-relaxed text-stone">
                Every sale instruction gets a staging consultation and an
                architectural photography session at our cost. Not because it
                is generous — because a properly presented property in New
                Cairo reliably closes faster and nearer asking, and we would
                rather spend the money than discount the price.
              </p>
              <p className="mt-4 leading-relaxed text-stone">
                Drag the handle to compare an unstyled reception room with one
                we have dressed for listing. The last one we did in Degla went
                under offer in nineteen days.
              </p>
            </div>
          </Reveal>
        </div>

        <Divider className="my-[var(--section-y)]" />

        {/* ---------- Timeline ---------- */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="label">The short version</p>
              <h3 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)] leading-tight text-bone">
                Eleven years, four districts, no franchise.
              </h3>
            </div>
          </Reveal>

          <ol className="relative">
            {/* Vertical rule that draws itself as the list scrolls in */}
            <motion.span
              aria-hidden="true"
              className="absolute left-[4.5rem] top-2 w-px origin-top bg-[color:var(--hairline-strong)] sm:left-[5.5rem]"
              style={{ bottom: "0.5rem" }}
              initial={{ scaleY: reducedMotion ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: reducedMotion ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {milestones.map((milestone, index) => (
              <Reveal key={milestone.year} delay={index * 0.08}>
                <li className="relative flex gap-6 pb-9 last:pb-0 sm:gap-8">
                  <span className="display w-14 shrink-0 text-right text-xl text-gold sm:w-16 sm:text-2xl">
                    {milestone.year}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gold ring-4 ring-obsidian"
                  />
                  <p className="flex-1 pt-0.5 leading-relaxed text-stone">
                    {milestone.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ---------- Team ---------- */}
        <div className="mt-[var(--section-y)]">
          <Reveal>
            <p className="label">The people</p>
            <h3 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)] text-bone">
              Who you will actually deal with.
            </h3>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.08}>
                <li className="group">
                  <div className="img-skeleton relative aspect-[4/5] overflow-hidden rounded-lg">
                    <div
                      data-team-photo
                      className="absolute inset-0 will-change-transform"
                      style={{ height: "112%", top: "-6%" }}
                    >
                      <Image
                        src={member.image}
                        alt={`${member.name}, ${member.role} at ${site.name}`}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 22vw"
                        className="object-cover grayscale transition-all duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="display text-xl text-bone">{member.name}</p>
                      <p className="label mt-1 !text-[0.5rem] text-champagne">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-[0.875rem] leading-relaxed text-stone">
                    {member.bio}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
