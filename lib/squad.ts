// Curated 2025-26 Napoli squad data.
// Hardcoded for v1, but ages are computed dynamically from DOB at render time
// (so they tick over on birthdays — page ISR-revalidates daily).
// Designed to grow: add joinedYear, joinedFrom, contractEnd, transferFee next.

export type SquadGroup =
  | "Porteros"
  | "Defensas"
  | "Mediocampistas"
  | "Delanteros"
  | "Cedidos";

export const SQUAD_GROUPS: SquadGroup[] = [
  "Porteros",
  "Defensas",
  "Mediocampistas",
  "Delanteros",
  "Cedidos",
];

export type Player = {
  name: string;
  role: string;           // POR / DFC / LD / LI / MCD / MC / MCO / EI / ED / DC
  position: SquadGroup;
  nationality: string;    // Spanish name
  flag: string;           // emoji
  dob: string;            // YYYY-MM-DD
  loanTo?: string;        // Cedidos only — club they're currently loaned at
};

export function ageFromDob(dob: string, asOf: Date = new Date()): number {
  const b = new Date(dob);
  let age = asOf.getUTCFullYear() - b.getUTCFullYear();
  const m = asOf.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && asOf.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

// Scotland subdivision flag (regional indicator with tag sequence)
const SCO = "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";

export const SQUAD: Player[] = [
  // PORTEROS
  { name: "Alex Meret",               role: "POR", position: "Porteros",       nationality: "Italia",       flag: "🇮🇹", dob: "1997-03-22" },
  { name: "Vanja Milinković-Savić",   role: "POR", position: "Porteros",       nationality: "Serbia",       flag: "🇷🇸", dob: "1997-02-20" },

  // DEFENSAS
  { name: "Giovanni Di Lorenzo",      role: "LD",  position: "Defensas",       nationality: "Italia",       flag: "🇮🇹", dob: "1993-08-04" },
  { name: "Alessandro Buongiorno",    role: "DFC", position: "Defensas",       nationality: "Italia",       flag: "🇮🇹", dob: "1999-06-06" },
  { name: "Amir Rrahmani",            role: "DFC", position: "Defensas",       nationality: "Kosovo",       flag: "🇽🇰", dob: "1994-02-24" },
  { name: "Sam Beukema",              role: "DFC", position: "Defensas",       nationality: "Países Bajos", flag: "🇳🇱", dob: "1998-11-17" },
  { name: "Juan Jesus",               role: "DFC", position: "Defensas",       nationality: "Brasil",       flag: "🇧🇷", dob: "1991-06-10" },
  { name: "Mathías Olivera",          role: "LI",  position: "Defensas",       nationality: "Uruguay",      flag: "🇺🇾", dob: "1997-10-31" },
  { name: "Miguel Gutiérrez",         role: "LI",  position: "Defensas",       nationality: "España",       flag: "🇪🇸", dob: "2001-07-27" },
  { name: "Leonardo Spinazzola",      role: "LI",  position: "Defensas",       nationality: "Italia",       flag: "🇮🇹", dob: "1993-03-25" },

  // MEDIOCAMPISTAS
  { name: "Stanislav Lobotka",        role: "MCD", position: "Mediocampistas", nationality: "Eslovaquia",   flag: "🇸🇰", dob: "1994-11-25" },
  { name: "Frank Anguissa",           role: "MC",  position: "Mediocampistas", nationality: "Camerún",      flag: "🇨🇲", dob: "1995-11-16" },
  { name: "Scott McTominay",          role: "MC",  position: "Mediocampistas", nationality: "Escocia",      flag: SCO,  dob: "1996-12-08" },
  { name: "Billy Gilmour",            role: "MC",  position: "Mediocampistas", nationality: "Escocia",      flag: SCO,  dob: "2001-06-11" },
  { name: "Kevin De Bruyne",          role: "MCO", position: "Mediocampistas", nationality: "Bélgica",      flag: "🇧🇪", dob: "1991-06-28" },

  // DELANTEROS
  { name: "Rasmus Højlund",           role: "DC",  position: "Delanteros",     nationality: "Dinamarca",    flag: "🇩🇰", dob: "2003-02-04" },
  { name: "Romelu Lukaku",            role: "DC",  position: "Delanteros",     nationality: "Bélgica",      flag: "🇧🇪", dob: "1993-05-13" },
  { name: "David Neres",              role: "EI",  position: "Delanteros",     nationality: "Brasil",       flag: "🇧🇷", dob: "1997-03-03" },
  { name: "Matteo Politano",          role: "ED",  position: "Delanteros",     nationality: "Italia",       flag: "🇮🇹", dob: "1993-05-03" },
  { name: "Giovane",                  role: "DC",  position: "Delanteros",     nationality: "Brasil",       flag: "🇧🇷", dob: "2003-05-13" },

  // CEDIDOS — Napoli-owned, currently on loan elsewhere
  { name: "Lorenzo Lucca",            role: "DC",  position: "Cedidos",        nationality: "Italia",       flag: "🇮🇹", dob: "2000-09-10", loanTo: "Nottingham Forest" },
  { name: "Noa Lang",                 role: "EI",  position: "Cedidos",        nationality: "Países Bajos", flag: "🇳🇱", dob: "1999-06-17", loanTo: "Galatasaray" },
  { name: "Cyril Ngonge",             role: "ED",  position: "Cedidos",        nationality: "Bélgica",      flag: "🇧🇪", dob: "2000-05-26", loanTo: "Espanyol" },
];
