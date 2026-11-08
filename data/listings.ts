/**
 * Property listings.
 *
 * To add a listing: copy a block, give it a unique `id` and `slug`, and drop
 * it anywhere in the array. The search filters, the horizontal gallery and the
 * quick-view modal all read straight from here — no other file needs touching.
 *
 * `price` is a plain number in EGP. For rentals it is the MONTHLY rent;
 * `status: "rent"` is what makes the card render "/ month".
 */

export type ListingStatus = "sale" | "rent";
export type ListingType =
  | "Villa"
  | "Apartment"
  | "Penthouse"
  | "Townhouse"
  | "Duplex";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  /** Short street-level line shown under the title. */
  address: string;
  neighbourhood: string;
  type: ListingType;
  status: ListingStatus;
  /** EGP. Monthly when status is "rent". */
  price: number;
  beds: number;
  baths: number;
  /** Built-up area in square metres. */
  area: number;
  parking: number;
  yearBuilt: number;
  /** Primary card image. */
  image: string;
  /** Extra images for the quick-view modal. */
  gallery: string[];
  features: string[];
  description: string;
  /** Featured listings appear in the pinned horizontal gallery. */
  featured: boolean;
  /** Drives the gold "New" / "Exclusive" badge. */
  badge?: "New" | "Exclusive" | "Price drop";
}

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const listings: Listing[] = [
  {
    id: "amg-001",
    slug: "katameya-heights-garden-villa",
    title: "Garden Villa, Katameya Heights",
    address: "Fairway Close, Katameya Heights",
    neighbourhood: "New Cairo",
    type: "Villa",
    status: "sale",
    price: 48500000,
    beds: 5,
    baths: 6,
    area: 620,
    parking: 3,
    yearBuilt: 2019,
    image: u("photo-1564013799919-ab600027ffc6"),
    gallery: [
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1600566753086-00f18fb6b3ea"),
      u("photo-1484154218962-a197022b5858"),
    ],
    features: [
      "Private pool",
      "Golf course frontage",
      "Staff quarters",
      "Smart home system",
      "Landscaped garden",
      "Backup generator",
    ],
    description:
      "A low, wide villa set along the eleventh fairway, built around a walled courtyard that keeps the house cool through the Cairo summer. Living spaces open on three sides; the garden was planted in 2019 and has grown in properly.",
    featured: true,
    badge: "Exclusive",
  },
  {
    id: "amg-002",
    slug: "fifth-settlement-sky-penthouse",
    title: "Sky Penthouse, Ninety Avenue",
    address: "90th Street North, Fifth Settlement",
    neighbourhood: "Fifth Settlement",
    type: "Penthouse",
    status: "sale",
    price: 32750000,
    beds: 4,
    baths: 4,
    area: 410,
    parking: 2,
    yearBuilt: 2022,
    image: u("photo-1600596542815-ffad4c1539a9"),
    gallery: [
      u("photo-1600607687920-4e2a09cf159d"),
      u("photo-1522708323590-d24dbb6b0267"),
      u("photo-1600210492486-724fe5c67fb0"),
    ],
    features: [
      "240m² roof terrace",
      "Double-height living room",
      "Private lift access",
      "Chef's kitchen",
      "Concierge",
      "Covered parking",
    ],
    description:
      "The top two floors of a 2022 building on 90th Street, with a roof terrace that runs the full footprint. South-facing glazing is shaded by a deep brise-soleil, so the living room stays usable at midday.",
    featured: true,
    badge: "New",
  },
  {
    id: "amg-003",
    slug: "sheikh-zayed-courtyard-house",
    title: "Courtyard House, Allegria",
    address: "Allegria, Sheikh Zayed City",
    neighbourhood: "Sheikh Zayed",
    type: "Villa",
    status: "sale",
    price: 41200000,
    beds: 5,
    baths: 5,
    area: 540,
    parking: 2,
    yearBuilt: 2017,
    image: u("photo-1512917774080-9991f1c4c750"),
    gallery: [
      u("photo-1600047509807-ba8f99d2cdde"),
      u("photo-1493809842364-78817add7ffb"),
      u("photo-1600121848594-d8644e57abab"),
    ],
    features: [
      "Central courtyard",
      "Swimming pool",
      "Home cinema",
      "Solar water heating",
      "Guest annexe",
      "Golf club membership",
    ],
    description:
      "Built around a shaded courtyard in the traditional manner, then detailed in limestone and oiled oak. The guest annexe has its own entrance, which makes it unusually practical for extended family.",
    featured: true,
  },
  {
    id: "amg-004",
    slug: "new-capital-tower-residence",
    title: "Tower Residence, New Capital",
    address: "Downtown District, New Administrative Capital",
    neighbourhood: "New Capital",
    type: "Apartment",
    status: "sale",
    price: 14900000,
    beds: 3,
    baths: 3,
    area: 225,
    parking: 1,
    yearBuilt: 2024,
    image: u("photo-1545324418-cc1a3fa10c00"),
    gallery: [
      u("photo-1600585154526-990dced4db0d"),
      u("photo-1502672260266-1c1ef2d93688"),
      u("photo-1598928506311-c55ded91a20c"),
    ],
    features: [
      "Panoramic city views",
      "Gym & spa",
      "24/7 security",
      "Fibre to the unit",
      "Central A/C",
      "Residents' lounge",
    ],
    description:
      "A corner unit on the nineteenth floor of a 2024 tower in the Downtown District, delivered fully finished. Both the living room and principal bedroom look west, so the whole flat turns gold about an hour before sunset.",
    featured: true,
    badge: "New",
  },
  {
    id: "amg-005",
    slug: "madinaty-family-townhouse",
    title: "Family Townhouse, Madinaty",
    address: "Group 86, Madinaty",
    neighbourhood: "Madinaty",
    type: "Townhouse",
    status: "sale",
    price: 11750000,
    beds: 4,
    baths: 3,
    area: 265,
    parking: 2,
    yearBuilt: 2020,
    image: u("photo-1600047509358-9dc75507daeb"),
    gallery: [
      u("photo-1600566752355-35792bedcfea"),
      u("photo-1600210491892-03d54c0aaf87"),
      u("photo-1560185007-cde436f6a4d0"),
    ],
    features: [
      "Private garden",
      "Roof terrace",
      "Walk to international school",
      "Community pool",
      "Storage room",
      "Pet friendly",
    ],
    description:
      "A middle-of-terrace house in one of Madinaty's quieter groups, three minutes' walk from the school gate. Sensible rather than spectacular — which is exactly why families keep taking it.",
    featured: true,
  },
  {
    id: "amg-006",
    slug: "zamalek-river-apartment",
    title: "River Apartment, Zamalek",
    address: "Abu El Feda Street, Zamalek",
    neighbourhood: "Zamalek",
    type: "Apartment",
    status: "rent",
    price: 125000,
    beds: 3,
    baths: 2,
    area: 240,
    parking: 1,
    yearBuilt: 1962,
    image: u("photo-1502672260266-1c1ef2d93688"),
    gallery: [
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1512915922686-57c11dde9b6b"),
      u("photo-1484154218962-a197022b5858"),
    ],
    features: [
      "Direct Nile view",
      "Original parquet",
      "Fully furnished",
      "Balcony on two sides",
      "Doorman",
      "Short-let considered",
    ],
    description:
      "Third floor of a 1962 block on Abu El Feda, with the Nile straight ahead and the original parquet still in place. Furnished to a high standard and available on a twelve-month term.",
    featured: true,
    badge: "Exclusive",
  },
  {
    id: "amg-007",
    slug: "maadi-degla-garden-duplex",
    title: "Garden Duplex, Degla",
    address: "Road 250, Degla, Maadi",
    neighbourhood: "Maadi",
    type: "Duplex",
    status: "rent",
    price: 78000,
    beds: 3,
    baths: 3,
    area: 210,
    parking: 1,
    yearBuilt: 1998,
    image: u("photo-1600607688969-a5bfcd646154"),
    gallery: [
      u("photo-1600047509358-9dc75507daeb"),
      u("photo-1522708323590-d24dbb6b0267"),
      u("photo-1560185007-cde436f6a4d0"),
    ],
    features: [
      "Mature private garden",
      "Two reception rooms",
      "Quiet tree-lined road",
      "Pet friendly",
      "Backup water tank",
      "Unfurnished",
    ],
    description:
      "Ground and first floor of a 1990s villa on one of Degla's quietest roads, with a garden the current tenants have kept beautifully. Unfurnished, long let preferred.",
    featured: false,
  },
  {
    id: "amg-008",
    slug: "mivida-parkside-villa",
    title: "Parkside Villa, Mivida",
    address: "The Parks, Mivida, New Cairo",
    neighbourhood: "New Cairo",
    type: "Villa",
    status: "sale",
    price: 36800000,
    beds: 4,
    baths: 5,
    area: 480,
    parking: 2,
    yearBuilt: 2021,
    image: u("photo-1580587771525-78b9dba3b914"),
    gallery: [
      u("photo-1600573472550-8090b5e0745e"),
      u("photo-1598928506311-c55ded91a20c"),
      u("photo-1600210491892-03d54c0aaf87"),
    ],
    features: [
      "Backs onto central park",
      "Double garage",
      "Underfloor heating",
      "Outdoor kitchen",
      "Study",
      "Smart irrigation",
    ],
    description:
      "Backs directly onto Mivida's central park, so the garden reads as about three times its actual size. Finished in 2021 and barely lived in since.",
    featured: false,
    badge: "Price drop",
  },
  {
    id: "amg-009",
    slug: "october-hills-contemporary",
    title: "Contemporary Villa, October Hills",
    address: "Beverly Hills, 6th of October",
    neighbourhood: "6th of October",
    type: "Villa",
    status: "sale",
    price: 27400000,
    beds: 4,
    baths: 4,
    area: 430,
    parking: 2,
    yearBuilt: 2016,
    image: u("photo-1600563438938-a9a27216b4f5"),
    gallery: [
      u("photo-1600573472550-8090b5e0745e"),
      u("photo-1600047509782-20d39509f26d"),
      u("photo-1616486338812-3dadae4b4ace"),
    ],
    features: [
      "Elevated plot",
      "Pool & deck",
      "Open-plan ground floor",
      "Solar panels",
      "Gated compound",
      "Driver's room",
    ],
    description:
      "Sits high on the plot, which gives the first floor a long view west over the compound. Open-plan downstairs, four proper bedrooms upstairs, and solar on the roof since 2021.",
    featured: false,
  },
  {
    id: "amg-010",
    slug: "fifth-settlement-studio-let",
    title: "Studio Let, Cairo Festival City",
    address: "The Village, Cairo Festival City",
    neighbourhood: "Fifth Settlement",
    type: "Apartment",
    status: "rent",
    price: 32000,
    beds: 1,
    baths: 1,
    area: 78,
    parking: 1,
    yearBuilt: 2021,
    image: u("photo-1631679706909-1844bbd07221"),
    gallery: [
      u("photo-1600566753086-00f18fb6b3ea"),
      u("photo-1600494603989-9650cf6ddd3d"),
      u("photo-1600210492486-724fe5c67fb0"),
    ],
    features: [
      "Fully furnished",
      "Walk to the mall",
      "Shared gym",
      "Bills included",
      "Six-month term",
      "High floor",
    ],
    description:
      "A compact, well-planned studio on a high floor at Festival City, let furnished with bills included. Popular with people on six to twelve month postings.",
    featured: false,
    badge: "New",
  },
  {
    id: "amg-011",
    slug: "new-heliopolis-corner-apartment",
    title: "Corner Apartment, New Heliopolis",
    address: "Golden Square, New Heliopolis",
    neighbourhood: "Heliopolis",
    type: "Apartment",
    status: "sale",
    price: 9250000,
    beds: 3,
    baths: 2,
    area: 185,
    parking: 1,
    yearBuilt: 2023,
    image: u("photo-1512915922686-57c11dde9b6b"),
    gallery: [
      u("photo-1600121848594-d8644e57abab"),
      u("photo-1600494603989-9650cf6ddd3d"),
      u("photo-1522708323590-d24dbb6b0267"),
    ],
    features: [
      "Dual aspect",
      "Semi-finished option",
      "Landscaped courtyard",
      "Lift & generator",
      "Nursery on site",
      "Flexible payment plan",
    ],
    description:
      "Corner unit with windows on two elevations, which is rarer than it sounds in this price bracket. Available finished or semi-finished with a payment plan over four years.",
    featured: false,
  },
  {
    id: "amg-012",
    slug: "palm-hills-managed-villa",
    title: "Managed Villa, Palm Hills",
    address: "Palm Hills, Cairo–Alexandria Road",
    neighbourhood: "Sheikh Zayed",
    type: "Villa",
    status: "rent",
    price: 195000,
    beds: 5,
    baths: 5,
    area: 510,
    parking: 3,
    yearBuilt: 2015,
    image: u("photo-1600047509807-ba8f99d2cdde"),
    gallery: [
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1493809842364-78817add7ffb"),
      u("photo-1600210491892-03d54c0aaf87"),
    ],
    features: [
      "Fully managed by AM Group",
      "Private pool",
      "Gardener & pool service",
      "Furnished",
      "Corporate lets welcome",
      "Generator",
    ],
    description:
      "One of the villas on our own management book, which means maintenance, the gardener and the pool service are already handled. Let furnished, corporate tenancies welcome.",
    featured: false,
  },
];

/** Derived filter options — kept in sync with the data automatically. */
export const neighbourhoodOptions = Array.from(
  new Set(listings.map((l) => l.neighbourhood)),
).sort();

export const typeOptions = Array.from(
  new Set(listings.map((l) => l.type)),
).sort() as ListingType[];

export const featuredListings = listings.filter((l) => l.featured);

export const priceBounds = {
  min: 0,
  max: 50000000,
};
