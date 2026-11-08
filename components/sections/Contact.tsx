"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LottiePlayer } from "@/components/ui/LottiePlayer";
import { cn } from "@/lib/format";

type Status = "idle" | "submitting" | "success" | "error";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = {
  name: "",
  email: "",
  phone: "",
  interest: "Buying",
  message: "",
};

const INTERESTS = [
  "Buying",
  "Selling",
  "Renting",
  "Property management",
  "Something else",
];

/** Deliberately permissive — the server is the real validator. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please tell us your name.";
  }

  if (!values.email.trim()) {
    errors.email = "We need an email to reply to.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "That doesn't look like a valid email address.";
  }

  // Phone is optional, but if given it should be plausible.
  if (values.phone.trim() && values.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "That number looks too short.";
  }

  if (!values.message.trim()) {
    errors.message = "A sentence or two is plenty.";
  } else if (values.message.trim().length < 10) {
    errors.message = "A little more detail would help us help you.";
  }

  return errors;
}

export function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const reducedMotion = usePrefersReducedMotion();

  // Until a real Formspree ID is configured the form runs in demo mode:
  // it validates and animates, but posts nowhere.
  const isConfigured = site.formspreeId !== "YOUR_FORM_ID";

  const update = (field: keyof FormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear an error as soon as the visitor starts fixing it.
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    }
  };

  const blur = (field: keyof FormValues) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
    const fieldErrors = validate(values);
    setErrors((previous) => ({ ...previous, [field]: fieldErrors[field] }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      interest: true,
      message: true,
    });

    if (Object.values(nextErrors).some(Boolean)) {
      // Move focus to the first field with a problem.
      const firstInvalid = (
        ["name", "email", "phone", "message"] as const
      ).find((field) => nextErrors[field]);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    setStatus("submitting");

    try {
      if (isConfigured) {
        const response = await fetch(
          `https://formspree.io/f/${site.formspreeId}`,
          {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(event.target as HTMLFormElement),
          },
        );
        if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      } else {
        // Demo mode — a short wait so the submitting state is visible.
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setStatus("success");
      setValues(EMPTY);
      setTouched({});
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-[var(--section-y)]">
      <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
        <SectionHeading
          eyebrow="Get in touch"
          title="Tell us what"
          titleAccent="you're looking for."
          intro="A sentence is enough to start. We reply to everything within one working day — and if we are not the right firm for it, we will say so and point you somewhere better."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[color:var(--hairline)] lg:grid-cols-[1fr_0.72fr]">
          {/* ---------- Form ---------- */}
          <div className="relative bg-graphite p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  className="flex min-h-[32rem] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                  role="status"
                >
                  <LottiePlayer
                    src="/lottie/success-check.json"
                    className="h-28 w-28"
                    loop={false}
                    rootMargin="0px"
                    fallback={<SuccessFallback />}
                  />

                  <h3 className="display mt-6 text-[clamp(2rem,4vw,3rem)] text-bone">
                    Message received.
                  </h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-stone">
                    Thank you — someone from the team will be in touch within one
                    working day, usually sooner.
                    {!isConfigured ? (
                      <span className="mt-3 block text-[0.8125rem] text-gold/80">
                        Demo mode: nothing was actually sent. Add your Formspree
                        ID in <code className="font-mono">data/site.ts</code> to
                        go live.
                      </span>
                    ) : null}
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    data-cursor="button"
                    className="mt-8 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.12 : 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      id="name"
                      label="Your name"
                      value={values.name}
                      error={touched.name ? errors.name : undefined}
                      onChange={(value) => update("name", value)}
                      onBlur={() => blur("name")}
                      autoComplete="name"
                      required
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      value={values.email}
                      error={touched.email ? errors.email : undefined}
                      onChange={(value) => update("email", value)}
                      onBlur={() => blur("email")}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      id="phone"
                      label="Phone (optional)"
                      type="tel"
                      value={values.phone}
                      error={touched.phone ? errors.phone : undefined}
                      onChange={(value) => update("phone", value)}
                      onBlur={() => blur("phone")}
                      autoComplete="tel"
                    />

                    <div className="flex flex-col">
                      <label htmlFor="interest" className="label mb-2.5">
                        I&rsquo;m interested in
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={values.interest}
                        onChange={(event) => update("interest", event.target.value)}
                        data-cursor="link"
                        className="w-full cursor-pointer appearance-none border-b border-[color:var(--hairline-strong)] bg-transparent pb-3 text-[1rem] text-bone outline-none transition-colors duration-300 focus:border-gold"
                      >
                        {INTERESTS.map((option) => (
                          <option key={option} value={option} className="bg-graphite">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Field
                    id="message"
                    label="What are you looking for?"
                    value={values.message}
                    error={touched.message ? errors.message : undefined}
                    onChange={(value) => update("message", value)}
                    onBlur={() => blur("message")}
                    multiline
                    required
                  />

                  {/* Honeypot — bots fill it, humans never see it. */}
                  <div aria-hidden="true" className="absolute left-[-9999px]">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="_gotcha"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status === "error" ? (
                    <p
                      role="alert"
                      className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    >
                      Something went wrong sending that. Please try again, or
                      email us directly at{" "}
                      <a href={`mailto:${site.contact.email}`} className="underline">
                        {site.contact.email}
                      </a>
                      .
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap items-center gap-5">
                    <MagneticButton
                      type="submit"
                      disabled={status === "submitting"}
                      ariaLabel="Send your enquiry"
                    >
                      {status === "submitting" ? "Sending…" : "Send enquiry"}
                    </MagneticButton>

                    <p className="text-[0.75rem] text-stone">
                      We never share your details. Ever.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ---------- Contact details ---------- */}
          <div className="flex flex-col justify-between bg-obsidian p-8 lg:p-10">
            <div className="flex flex-col gap-8">
              <ContactLine label="Call the office" value={site.contact.phone} href={site.contact.phoneHref} />
              <ContactLine label="Email" value={site.contact.email} href={`mailto:${site.contact.email}`} />
              <ContactLine label="Sales enquiries" value={site.contact.salesEmail} href={`mailto:${site.contact.salesEmail}`} />

              <div>
                <p className="label">Office</p>
                <p className="mt-2.5 leading-relaxed text-bone">
                  {site.contact.address}
                  <br />
                  {site.contact.city}
                </p>
              </div>

              <div>
                <p className="label">Opening hours</p>
                <p className="mt-2.5 text-bone">{site.contact.hours}</p>
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="hairline-t mt-10 pt-7">
                <p className="label mb-4">Follow</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {site.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="group inline-flex items-center gap-1.5 text-[0.875rem] text-stone transition-colors duration-300 hover:text-gold"
                      >
                        {social.label}
                        <span className="inline-block transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path
                              d="M1 9L9 1M9 1H3M9 1v6"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

interface FieldProps {
  id: keyof FormValues;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
}

/**
 * Underlined input with an inline error.
 *
 * The error is wired up with `aria-describedby` and `aria-invalid` so screen
 * readers announce it with the field rather than leaving it orphaned, and it
 * is rendered in a `role="alert"` region so it is announced on change.
 */
function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  multiline,
  required,
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: id,
    value,
    required,
    autoComplete,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    onBlur,
    className: cn(
      "w-full border-b bg-transparent pb-3 text-[1rem] text-bone outline-none transition-colors duration-300 placeholder:text-stone/50",
      error
        ? "border-red-400/70 focus:border-red-400"
        : "border-[color:var(--hairline-strong)] focus:border-gold",
    ),
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="label mb-2.5">
        {label}
        {required ? <span className="ml-1 text-gold">*</span> : null}
      </label>

      {multiline ? (
        <textarea {...shared} rows={5} className={cn(shared.className, "resize-none")} />
      ) : (
        <input {...shared} type={type} />
      )}

      <AnimatePresence>
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden pt-2 text-[0.8125rem] text-red-300"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ContactLine({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <a
        href={href}
        data-cursor="link"
        className="group mt-2.5 inline-block text-[1.0625rem] text-bone transition-colors duration-300 hover:text-gold"
      >
        {value}
        <span className="block h-px w-0 bg-gold transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full" />
      </a>
    </div>
  );
}

function SuccessFallback() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2.5"
      />
      <path
        d="M20 33l8 8 16-17"
        fill="none"
        stroke="var(--champagne)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
