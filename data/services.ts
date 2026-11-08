/**
 * The four service pillars. `lottie` points at a file in /public/lottie —
 * swap any of them for a richer animation from LottieFiles and nothing
 * else needs to change.
 */

export interface Service {
  id: string;
  index: string;
  title: string;
  summary: string;
  points: string[];
  lottie: string;
}

export const services: Service[] = [
  {
    id: "buying",
    index: "01",
    title: "Buying",
    summary:
      "We shortlist against your brief, not our stock list — then negotiate, verify title and walk you through registration.",
    points: [
      "Off-market access across New Cairo & Zayed",
      "Full title and licence verification",
      "Negotiation handled end to end",
      "Mortgage introductions",
    ],
    lottie: "/lottie/icon-buying.json",
  },
  {
    id: "selling",
    index: "02",
    title: "Selling",
    summary:
      "Proper photography, an honest price, and a buyer list we've spent eleven years building.",
    points: [
      "Architectural photography & floorplans",
      "Comparable-led valuation",
      "Qualified buyer matching",
      "Average 38 days to offer",
    ],
    lottie: "/lottie/icon-selling.json",
  },
  {
    id: "renting",
    index: "03",
    title: "Renting",
    summary:
      "Tenants screened, contracts drawn correctly, deposits held properly. For landlords and renters both.",
    points: [
      "Tenant referencing & screening",
      "Bilingual contracts, Arabic and English",
      "Inventory and condition reports",
      "Renewal handling",
    ],
    lottie: "/lottie/icon-renting.json",
  },
  {
    id: "management",
    index: "04",
    title: "Property Management",
    summary:
      "The unglamorous part, done well — maintenance, collections, inspections and a monthly statement you can actually read.",
    points: [
      "Rent collection & arrears chasing",
      "Vetted maintenance network",
      "Quarterly inspections with photos",
      "Clear monthly owner statements",
    ],
    lottie: "/lottie/icon-management.json",
  },
];
