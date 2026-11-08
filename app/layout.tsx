import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Providers } from "@/components/providers/Providers";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

/**
 * Both faces are self-hosted by next/font — no network request to Google at
 * runtime, and no layout shift, since the metrics are inlined as a fallback.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const description = `${site.name} — ${site.focus.toLowerCase()} across ${site.marketLong}. ${site.shortPitch}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Real Estate in ${site.market}`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "real estate New Cairo",
    "property Fifth Settlement",
    "villas New Cairo",
    "apartments Sheikh Zayed",
    "Cairo property management",
    "rent Zamalek apartment",
    "New Administrative Capital property",
    site.name,
  ],
  authors: [{ name: site.principal }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_EG",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <ScrollProgress />
          <CursorProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
