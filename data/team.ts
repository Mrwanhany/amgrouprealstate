/** The people on the About section. */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const team: TeamMember[] = [
  {
    name: "Ahmed El Nahal",
    role: "Founder & Managing Director",
    bio: "Eleven years brokering across New Cairo and Zayed. Handles the firm's villa and estate work personally.",
    image: u("photo-1618077360395-f3068be8e001"),
  },
  {
    name: "Nour Abdelrahman",
    role: "Head of Sales",
    bio: "Runs the sales desk and the off-market list. Previously eight years with a national developer.",
    image: u("photo-1573496359142-b8d87734a5a2"),
  },
  {
    name: "Karim Fathy",
    role: "Head of Lettings",
    bio: "Tenancies, referencing and renewals. Knows the Maadi and Zamalek rental market street by street.",
    image: u("photo-1500648767791-00dcc994a43e"),
  },
  {
    name: "Salma Darwish",
    role: "Property Management Lead",
    bio: "Looks after the managed portfolio — inspections, contractors and the monthly owner statements.",
    image: u("photo-1580489944761-15a19d654956"),
  },
];

/** Milestones for the About timeline. */
export const milestones = [
  { year: "2014", text: "AM Group opens a single desk in Fifth Settlement." },
  { year: "2017", text: "Lettings division launched; first managed portfolio signed." },
  { year: "2020", text: "Crossed 500 completed transactions across Greater Cairo." },
  { year: "2023", text: "New Capital desk opens; management book passes EGP 3B." },
  { year: "2025", text: "Eleven years, four districts, one office that never moved." },
];
