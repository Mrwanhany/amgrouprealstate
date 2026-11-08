# AM Group — Real Estate Landing Page

A single-page, heavily animated marketing site for **AM Group**, a full-service
property house covering New Cairo, Sheikh Zayed, Zamalek, Maadi, Madinaty and
the New Administrative Capital.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, GSAP +
ScrollTrigger, Framer Motion, Lenis, lottie-react and React Three Fiber.

---

## Contents

1. [Running it](#running-it)
2. [Project structure](#project-structure)
3. [Customising the brand](#customising-the-brand)
4. [Editing listings and other content](#editing-listings-and-other-content)
5. [Lottie animations](#lottie-animations)
6. [The contact form (Formspree)](#the-contact-form-formspree)
7. [How the animation layer fits together](#how-the-animation-layer-fits-together)
8. [Accessibility and reduced motion](#accessibility-and-reduced-motion)
9. [Performance notes](#performance-notes)
10. [Deploying to Vercel](#deploying-to-vercel)
11. [Replace before you go live](#replace-before-you-go-live)

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

Node 20+ is recommended. The whole page prerenders to static HTML — there is no
database, no API and no server-side data fetching.

---

## Project structure

```
app/
  layout.tsx              Fonts, metadata, Open Graph, providers
  page.tsx                Composes the twelve sections + JSON-LD schema
  globals.css             Design tokens, utilities, reduced-motion rules
  sitemap.ts  robots.ts   SEO files
  opengraph-image.tsx     Social share card, generated at build time
  icon.tsx  apple-icon.tsx  Favicons, generated at build time

components/
  providers/   SmoothScrollProvider (Lenis↔GSAP), CursorProvider,
               IntroProvider, SearchProvider, Providers
  ui/          SplitText, Reveal, MagneticButton, AnimatedCounter,
               AnimatedNumber, Marquee, ScrollProgress, Divider,
               SectionHeading, Modal, LottiePlayer, LottieImpl
  sections/    Preloader, Navbar, Hero, FeaturedListings, Services, Stats,
               Neighbourhoods, MortgageCalculator, About, Testimonials,
               Contact, Footer
  listings/    PropertyCard, PropertyGrid, SearchFilters, QuickViewModal,
               BeforeAfter
  three/       HeroScene (lazy-loaded 3D accent)

lib/           format.ts, mortgage.ts, hooks.ts, gsap.ts
data/          site.ts, listings.ts, services.ts, stats.ts,
               neighbourhoods.ts, team.ts, testimonials.ts
public/lottie/ Seven hand-authored animations
```

**Everything editable is in `data/`.** You should not need to open a component
to change copy, prices, districts, team members or contact details.

---

## Customising the brand

### Name, contact details, tagline

`data/site.ts` is the single source of truth. Change it and the whole site
re-brands — navigation, footer, metadata, schema.org data and the preloader
monogram all read from it.

```ts
export const site = {
  name: "AM Group",
  principal: "Ahmed El Nahal",
  tagline: "Where Cairo comes home.",
  url: "https://your-real-domain.com",   // used for canonical + OG + sitemap
  contact: { phone, email, address, ... },
  formspreeId: "YOUR_FORM_ID",
  nav: [...],
};
```

### Colours

Six tokens in `app/globals.css` drive the entire palette:

| Token | Default | Used for |
|---|---|---|
| `--obsidian` | `#0a0a0b` | Page background |
| `--graphite` | `#141416` | Cards, modals, raised surfaces |
| `--ink` | `#1c1c1f` | Slider tracks, inset wells |
| `--gold` | `#c9a227` | Accent, rules, active states |
| `--champagne` | `#e8d5a3` | Gradient highlight, hover |
| `--bone` | `#f4f1ea` | Primary text |
| `--stone` | `#8a867e` | Muted text and labels |

They are exposed to Tailwind through `@theme inline`, so `bg-obsidian`,
`text-gold`, `border-champagne` and so on all work as utilities. Change the
hex values in `:root` and everything follows.

If you change `--gold`, also update the two hard-coded hexes in
`components/three/HeroScene.tsx` (the 3D materials cannot read CSS variables)
and the colours at the top of the Lottie generator if you regenerate the
icons.

### Typography

Set in `app/layout.tsx` via `next/font/google`:

- **Instrument Serif** — display headlines (`font-display`, or the `.display` class)
- **Inter** — everything else (`font-sans`)

Swap either by changing the import and the `--font-*` variable name. Both are
self-hosted automatically, so no external request is made at runtime.

---

## Editing listings and other content

### Listings — `data/listings.ts`

Copy any existing block, give it a unique `id` and `slug`, and drop it anywhere
in the array. The horizontal gallery, the filter bar, the grid and the
quick-view modal all derive from this one array, including the filter
dropdown options.

```ts
{
  id: "amg-013",
  slug: "some-unique-slug",
  title: "Garden Villa, Katameya Heights",
  address: "Fairway Close, Katameya Heights",
  neighbourhood: "New Cairo",     // becomes a filter option automatically
  type: "Villa",                  // Villa | Apartment | Penthouse | Townhouse | Duplex
  status: "sale",                 // "sale" | "rent"  ("rent" renders "/ month")
  price: 48500000,                // plain number, EGP. Monthly when renting.
  beds: 5, baths: 6, area: 620, parking: 3, yearBuilt: 2019,
  image: u("photo-..."),          // card image
  gallery: [u("..."), u("..."), u("...")],   // quick-view extras
  features: ["Private pool", "..."],
  description: "...",
  featured: true,                 // true = appears in the pinned gallery
  badge: "Exclusive",             // optional: New | Exclusive | Price drop
}
```

Notes:

- `featured: true` puts a listing in the pinned horizontal rail. Five or six
  is a good number; the rail scrolls for as long as it needs to.
- The budget slider only filters **sale** prices. Rentals are monthly figures
  and would otherwise always pass a sale-sized budget.
- `u()` is a small helper at the top of the file that builds an Unsplash URL.
  For your own photography, put files in `public/` and use `"/listings/x.jpg"`
  instead. Remote hosts other than Unsplash must be added to
  `images.remotePatterns` in `next.config.ts`.

### Everything else

| File | Drives |
|---|---|
| `data/services.ts` | The four service cards and their Lottie icons |
| `data/stats.ts` | Animated counters + the three "why us" points |
| `data/neighbourhoods.ts` | Map pins, photos and district statistics |
| `data/team.ts` | Team grid and the About timeline |
| `data/testimonials.ts` | The carousel |

In `data/neighbourhoods.ts`, `x` and `y` are percentage coordinates (0–100)
on the stylised map, measured from the left and top. Move a pin by changing
those two numbers.

---

## Lottie animations

Seven animations ship in `public/lottie/`, hand-authored for this project.
They are small (2–6 KB each), use the brand colours, and work out of the box —
**nothing needs downloading**.

| File | Used by | Behaviour |
|---|---|---|
| `preloader.json` | Preloader | Counter-rotating gold arcs |
| `scroll-indicator.json` | Hero | Dot falling through a capsule, two passes |
| `success-check.json` | Contact | Ring draws, then a tick. Plays once |
| `icon-buying.json` | Services | House outline with a light chasing it |
| `icon-selling.json` | Services | House with a rising arrow |
| `icon-renting.json` | Services | A key turning in a lock |
| `icon-management.json` | Services | Building whose windows light in sequence |

### Replacing one with a LottieFiles download

If you want richer artwork, download a JSON from
[lottiefiles.com](https://lottiefiles.com) (choose **Lottie JSON**, not
dotLottie) and save it over the matching file. Suggested searches:

| Save as | Search LottieFiles for |
|---|---|
| `public/lottie/preloader.json` | "minimal loader ring" / "luxury loading" |
| `public/lottie/scroll-indicator.json` | "scroll down mouse" |
| `public/lottie/success-check.json` | "success checkmark outline" |
| `public/lottie/icon-buying.json` | "house line icon animated" |
| `public/lottie/icon-selling.json` | "house sale arrow" |
| `public/lottie/icon-renting.json` | "key unlock line icon" |
| `public/lottie/icon-management.json` | "building management line icon" |

Two things to check when you swap one in:

1. **Frame 0 must look complete.** On pointer devices the service icons sit
   still until hovered, so whatever the first frame shows is what visitors see
   most of the time. An animation that starts from nothing will look broken.
2. **Recolour it** to the brand palette in the LottieFiles editor, or it will
   arrive in whatever colours the original author used.

To point a service card at a different file, change the `lottie` field in
`data/services.ts` — no component changes needed.

### Regenerating the bundled ones

They were produced by a script rather than drawn by hand. If you want to tweak
timing or colour, the generator is small and self-contained; see the brand
colour constants at the top of it. Any valid Lottie JSON works here, so you can
also just replace the files.

---

## The contact form (Formspree)

The form ships in **demo mode**: it validates, animates and shows the success
state, but sends nothing. The success panel says so, so you cannot ship it by
accident.

To go live:

1. Create a form at [formspree.io](https://formspree.io).
2. Copy the ID out of the endpoint (`https://formspree.io/f/**xyzabcd**`).
3. Set `formspreeId: "xyzabcd"` in `data/site.ts`.

That is the only change. The form then POSTs `FormData` to Formspree and shows
a real error state if the request fails. A honeypot field (`_gotcha`) is
already wired up for spam.

---

## How the animation layer fits together

**One Lenis instance, one GSAP ticker.** `SmoothScrollProvider` creates Lenis
with `autoRaf: false` and steps it from `gsap.ticker`, while driving
`ScrollTrigger.update()` from Lenis's own scroll event. If you add scroll
animation, import `gsap` and `ScrollTrigger` from `@/lib/gsap` rather than from
the packages, so plugins are registered exactly once.

**Two libraries, two jobs.** GSAP owns scroll-driven work — pinning, scrubbing,
parallax, split-text reveals. Framer Motion owns component state — presence,
layout, drag, hover. They are not mixed on the same element.

**Watch out for `gsap.utils.toArray("...")`.** `useGSAP`'s context only rewrites
selector strings passed to GSAP's own animation methods. `toArray` with a
string queries the whole document, which will silently target every matching
element on the page. Query the scope element directly instead — the components
here all do.

**Prefer `fromTo` over `set` + `to`** for anything using `yPercent`/`xPercent`.
A bare `to({ yPercent: 0 })` resolves its start value from GSAP's cache, and
that cache does not survive a context revert — the element's existing
`translate(0, 115%)` then reads back as `y: 131px, yPercent: 0` and the tween
becomes a silent no-op.

---

## Accessibility and reduced motion

`prefers-reduced-motion: reduce` is honoured in CSS **and** in JavaScript. When
it is set:

- Lenis is never instantiated; the browser's native scrolling is untouched
- The preloader is skipped entirely
- Split text renders as plain strings rather than per-letter spans
- The custom cursor, 3D scene, marquee, card tilt and carousel autoplay are all off
- The pinned horizontal gallery becomes an ordinary scroll-snap row
- Reveals degrade to a short opacity fade with no movement

Also in place:

- Skip-to-content link, visible gold focus ring on every interactive element
- The modal traps focus, closes on Escape and restores focus to its opener
- Form errors use `aria-invalid` + `aria-describedby` + `role="alert"`, and
  submitting an invalid form moves focus to the first problem field
- Result counts announce via `aria-live`; the carousel is arrow-key operable
- Split headlines keep one screen-reader copy of the real sentence; the
  per-letter spans are `aria-hidden`
- Decorative animations that start on their own stop within five seconds,
  so no pause control is required (WCAG 2.2.2)
- Body text clears AA against the background; gold on obsidian is ~7.8:1

---

## Performance notes

- The route is fully static — `next build` prerenders it to HTML
- Three.js loads only on desktop, only after `requestIdleCallback`, and never
  under reduced motion
- The Lottie engine and each JSON load only when a player is within 200px of
  the viewport, via `next/dynamic` with `ssr: false`
- All photography goes through `next/image` with explicit `sizes`. The hero is
  the LCP element and uses `loading="eager"` + `fetchPriority="high"`
  (`priority` is deprecated in Next 16)
- Fonts are self-hosted by `next/font` with metric fallbacks, so no CLS
- The marquee is pure CSS and costs nothing in the JS frame budget
- Pointer-driven effects use `gsap.quickTo`, which reuses one tween instead of
  creating one per `pointermove`

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). The framework is
   detected automatically; no build settings or environment variables needed.
3. Add your domain, then set `site.url` in `data/site.ts` to match — it drives
   the canonical URL, Open Graph tags and `sitemap.xml`.
4. Redeploy so the metadata picks up the new URL.

`next build` must pass locally first; the production build is the only place
some CSS-ordering and prerender issues show up.

---

## Replace before you go live

The content is realistic placeholder material, not real business data. Before
launch:

- [ ] **Contact details** in `data/site.ts` — the phone, emails and address are invented
- [ ] **Formspree ID** — the form sends nothing until you set it
- [ ] **`site.url`** — currently a placeholder Vercel domain
- [ ] **Listings** — all twelve are fictional, as are the prices
- [ ] **Statistics** — "1,240+ properties closed", "98% would recommend" and the
      JSON-LD `aggregateRating` are invented. Publishing invented review counts
      as structured data can get a site penalised, so either make them true or
      remove the `aggregateRating` block in `app/page.tsx`
- [ ] **Testimonials** — written for the demo; use real, permissioned quotes
- [ ] **Team photographs** — Unsplash stock, not your colleagues
- [ ] **Before/after slider** in `components/sections/About.tsx` — currently two
      *different* rooms chosen to look similar. Replace with a genuine pair of
      the same room, before and after styling
- [ ] **Social links** in `data/site.ts` point at bare `instagram.com` etc.
- [ ] **Listing photography** — Unsplash stand-ins; swap in your own shoots

---

Built with Next.js 16, Tailwind CSS v4, GSAP, Framer Motion, Lenis,
lottie-react and React Three Fiber.
