/** Testimonial carousel content. Add or remove freely — it loops. */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  image: string;
}

const u = (id: string, w = 400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ahmed talked us out of the first villa we fell in love with. He was right about the title, and we found out later exactly how right. Two months on we bought in Mivida instead and we have never second-guessed it.",
    name: "Hala & Tarek Mansour",
    role: "Bought a villa",
    location: "Mivida, New Cairo",
    image: u("photo-1544005313-94ddf0286df2"),
  },
  {
    quote:
      "I live in Dubai and own two flats in Zamalek. AM Group has managed both for four years. I get a statement I can read, photographs every quarter, and I have genuinely never had to chase them for anything.",
    name: "Youssef Ramzi",
    role: "Landlord, managed portfolio",
    location: "Zamalek",
    image: u("photo-1472099645785-5658abf4ff4e"),
  },
  {
    quote:
      "We listed with two other agencies first and got nothing but time-wasters. AM Group photographed it properly, priced it honestly, and had a signed offer in five weeks.",
    name: "Mona Abdel Aziz",
    role: "Sold a townhouse",
    location: "Madinaty",
    image: u("photo-1534528741775-53994a69daeb"),
  },
  {
    quote:
      "Relocating from London with eight weeks' notice and two children. Karim found us the Degla duplex, handled the contract in both languages, and had the keys ready the day we landed.",
    name: "James Whitfield",
    role: "Rented a duplex",
    location: "Degla, Maadi",
    image: u("photo-1519085360753-af0119f7cbe7"),
  },
  {
    quote:
      "What I appreciated was that the person who showed me the apartment was the person who closed it. No handoffs, no repeating myself to a new name every week.",
    name: "Dina Serageldin",
    role: "Bought an apartment",
    location: "New Heliopolis",
    image: u("photo-1601412436009-d964bd02edbc"),
  },
];
