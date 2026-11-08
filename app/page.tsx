import { site } from "@/data/site";
import { listings } from "@/data/listings";
import { Preloader } from "@/components/sections/Preloader";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Neighbourhoods } from "@/components/sections/Neighbourhoods";
import { MortgageCalculator } from "@/components/sections/MortgageCalculator";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Divider } from "@/components/ui/Divider";

/**
 * Structured data so search engines understand this is an estate agency
 * with a real address and a real catalogue, rather than a generic page.
 */
function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.legalName,
    alternateName: site.name,
    description: site.shortPitch,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
    founder: { "@type": "Person", name: site.principal },
    foundingDate: "2014",
    areaServed: ["New Cairo", "Sheikh Zayed", "Zamalek", "Maadi", "New Administrative Capital", "Madinaty"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: "New Cairo",
      addressRegion: "Cairo Governorate",
      addressCountry: "EG",
    },
    openingHours: "Su-Th 10:00-19:00",
    sameAs: site.socials.map((social) => social.href),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
    },
    makesOffer: listings.slice(0, 6).map((listing) => ({
      "@type": "Offer",
      name: listing.title,
      priceCurrency: "EGP",
      price: listing.price,
      availability: "https://schema.org/InStock",
      category: listing.status === "rent" ? "Rental" : "Sale",
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a literal we control — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />

      {/* 1. Branded intro, wipes away into the hero */}
      <Preloader />

      {/* 2. Navigation */}
      <Navbar />

      <main id="main">
        {/* 3. Hero with quick search */}
        <Hero />

        {/* 4. Featured listings + the filterable grid */}
        <FeaturedListings />

        <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
          <Divider className="my-[var(--section-y)]" />
        </div>

        {/* 5. Services */}
        <Services />

        {/* 6. Stats / why choose us, closing on the neighbourhood marquee */}
        <Stats />

        {/* 7. Interactive district map */}
        <Neighbourhoods />

        <div className="mx-auto max-w-[115rem] px-[var(--gutter)]">
          <Divider />
        </div>

        {/* 8. Mortgage calculator */}
        <MortgageCalculator />

        {/* 9. About, staging comparison and the team */}
        <About />

        {/* 10. Testimonials */}
        <Testimonials />

        {/* 11. Contact */}
        <Contact />
      </main>

      {/* 12. Footer */}
      <Footer />
    </>
  );
}
