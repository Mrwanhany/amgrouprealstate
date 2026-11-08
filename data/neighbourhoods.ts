/**
 * Districts shown in the interactive map section. `x`/`y` are percentage
 * coordinates on the stylised Greater Cairo map (0–100, left/top).
 */

export interface Neighbourhood {
  id: string;
  name: string;
  arabic: string;
  blurb: string;
  avgPrice: string;
  listings: number;
  commute: string;
  image: string;
  x: number;
  y: number;
}

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const neighbourhoods: Neighbourhood[] = [
  {
    id: "new-cairo",
    name: "New Cairo",
    arabic: "القاهرة الجديدة",
    blurb:
      "Low-density compounds, international schools and the widest villa stock in the city. Still where most families move to.",
    avgPrice: "EGP 62,000 / m²",
    listings: 3,
    commute: "35 min to Downtown",
    image: u("photo-1613977257363-707ba9348227"),
    x: 72,
    y: 52,
  },
  {
    id: "fifth-settlement",
    name: "Fifth Settlement",
    arabic: "التجمع الخامس",
    blurb:
      "The commercial heart of New Cairo. 90th Street, Festival City and the best of the new apartment towers.",
    avgPrice: "EGP 58,000 / m²",
    listings: 2,
    commute: "40 min to Downtown",
    image: u("photo-1600596542815-ffad4c1539a9"),
    x: 66,
    y: 61,
  },
  {
    id: "sheikh-zayed",
    name: "Sheikh Zayed",
    arabic: "الشيخ زايد",
    blurb:
      "Mature, green and west-facing. Allegria, Beverly Hills and Palm Hills anchor the villa market here.",
    avgPrice: "EGP 54,000 / m²",
    listings: 2,
    commute: "30 min to Mohandessin",
    image: u("photo-1512917774080-9991f1c4c750"),
    x: 22,
    y: 44,
  },
  {
    id: "new-capital",
    name: "New Capital",
    arabic: "العاصمة الإدارية",
    blurb:
      "The newest stock in the country. Strong on payment plans, early on amenities — a buy for the patient.",
    avgPrice: "EGP 47,000 / m²",
    listings: 1,
    commute: "55 min to Downtown",
    image: u("photo-1545324418-cc1a3fa10c00"),
    x: 88,
    y: 66,
  },
  {
    id: "zamalek",
    name: "Zamalek",
    arabic: "الزمالك",
    blurb:
      "Island living, 1930s–60s blocks, and the only Nile frontage that never loses value. Supply is permanently tight.",
    avgPrice: "EGP 95,000 / m²",
    listings: 1,
    commute: "10 min to Downtown",
    image: u("photo-1502672260266-1c1ef2d93688"),
    x: 42,
    y: 36,
  },
  {
    id: "maadi",
    name: "Maadi",
    arabic: "المعادي",
    blurb:
      "Tree-lined, low-rise and quietly international. Degla and Sarayat hold their value through every cycle.",
    avgPrice: "EGP 68,000 / m²",
    listings: 1,
    commute: "20 min to Downtown",
    image: u("photo-1600607688969-a5bfcd646154"),
    x: 48,
    y: 74,
  },
];
