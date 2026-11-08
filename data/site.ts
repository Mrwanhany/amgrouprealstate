/**
 * Single source of truth for everything brand-specific.
 * Change this file and the whole site re-brands — nothing else hardcodes
 * the company name, contact details or market.
 */

export const site = {
  name: "AM Group",
  legalName: "AM Group Real Estate",
  principal: "Ahmed El Nahal",
  principalRole: "Founder & Managing Director",

  tagline: "Where Cairo comes home.",
  shortPitch:
    "A full-service property house for Greater Cairo — buying, selling, renting and managing the addresses people actually want to live at.",

  market: "New Cairo & Greater Cairo",
  marketLong: "New Cairo, Sheikh Zayed, the New Capital & Greater Cairo",
  focus: "Residential sales, rentals & property management",

  // Used for canonical URLs, OG tags and the sitemap.
  // Set this to your real domain before you deploy.
  url: "https://amgroup-realestate.vercel.app",

  contact: {
    phone: "+20 100 123 4567",
    phoneHref: "tel:+201001234567",
    whatsapp: "+20 100 123 4567",
    email: "hello@amgroup.eg",
    salesEmail: "sales@amgroup.eg",
    address: "90th Street North, Fifth Settlement",
    city: "New Cairo, Cairo Governorate, Egypt",
    hours: "Sunday – Thursday, 10:00 – 19:00 EET",
  },

  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],

  /**
   * Formspree — create a form at https://formspree.io, then replace the ID.
   * Until you do, the contact form runs in demo mode: it validates,
   * animates and reports success without sending anything anywhere.
   */
  formspreeId: "YOUR_FORM_ID",

  nav: [
    { label: "Listings", href: "#listings" },
    { label: "Services", href: "#services" },
    { label: "Neighbourhoods", href: "#neighbourhoods" },
    { label: "Calculator", href: "#calculator" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type Site = typeof site;
