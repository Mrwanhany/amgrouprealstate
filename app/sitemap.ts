import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * This is a single-page site, so the sitemap lists the page itself plus its
 * major in-page sections — search engines treat well-labelled anchors as
 * jump-to targets in results.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-07");

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...site.nav.map((item) => ({
      url: `${site.url}/${item.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
