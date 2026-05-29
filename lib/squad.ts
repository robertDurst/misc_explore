// Curated 2025-26 Napoli squad data.
// Ages computed dynamically from DOB (page ISR-revalidates daily).
// Transfer trio (joinedYear / joinedFrom / contractEnd) is best-effort —
// marquee names verified, supporting cast approximate; edit freely.

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
  joinedYear?: number;    // year arrived at Napoli
  joinedFrom?: string;    // previous club (display name in Spanish where natural)
  contractEnd?: number;   // contract expiry year (most end 30 Jun)
  loanTo?: string;        // Cedidos only — club they're currently loaned at
};

export function ageFromDob(dob: string, asOf: Date = new Date()): number {
  const b = new Date(dob);
  let age = asOf.getUTCFullYear() - b.getUTCFullYear();
  const m = asOf.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && asOf.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

/** Compose the small Spanish transfer line shown under the meta. */
export function transferLine(p: Player): string | null {
  const parts: string[] = [];
  if (p.joinedFrom && p.joinedYear) {
    parts.push(`Desde ${p.joinedFrom} (${p.joinedYear})`);
  } else if (p.joinedFrom) {
    parts.push(`Desde ${p.joinedFrom}`);
  } else if (p.joinedYear) {
    parts.push(`Desde ${p.joinedYear}`);
  }
  if (p.contractEnd) parts.push(`hasta ${p.contractEnd}`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

// Scotland subdivision flag (regional indicator with tag sequence)
const SCO = "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";

export const SQUAD: Player[] = [
  // PORTEROS
  { name: "Alex Meret",               role: "POR", position: "Porteros",       nationality: "Italia",       flag: "🇮🇹", dob: "1997-03-22", joinedYear: 2018, joinedFrom: "Udinese",          contractEnd: 2028 },
  { name: "Vanja Milinković-Savić",   role: "POR", position: "Porteros",       nationality: "Serbia",       flag: "🇷🇸", dob: "1997-02-20", joinedYear: 2025, joinedFrom: "Torino",           contractEnd: 2030 },

  // DEFENSAS
  { name: "Giovanni Di Lorenzo",      role: "LD",  position: "Defensas",       nationality: "Italia",       flag: "🇮🇹", dob: "1993-08-04", joinedYear: 2019, joinedFrom: "Empoli",           contractEnd: 2028 },
  { name: "Alessandro Buongiorno",    role: "DFC", position: "Defensas",       nationality: "Italia",       flag: "🇮🇹", dob: "1999-06-06", joinedYear: 2024, joinedFrom: "Torino",           contractEnd: 2029 },
  { name: "Amir Rrahmani",            role: "DFC", position: "Defensas",       nationality: "Kosovo",       flag: "🇽🇰", dob: "1994-02-24", joinedYear: 2020, joinedFrom: "Hellas Verona",    contractEnd: 2027 },
  { name: "Sam Beukema",              role: "DFC", position: "Defensas",       nationality: "Países Bajos", flag: "🇳🇱", dob: "1998-11-17", joinedYear: 2025, joinedFrom: "Bologna",          contractEnd: 2030 },
  { name: "Juan Jesus",               role: "DFC", position: "Defensas",       nationality: "Brasil",       flag: "🇧🇷", dob: "1991-06-10", joinedYear: 2021, joinedFrom: "Roma",             contractEnd: 2026 },
  { name: "Mathías Olivera",          role: "LI",  position: "Defensas",       nationality: "Uruguay",      flag: "🇺🇾", dob: "1997-10-31", joinedYear: 2022, joinedFrom: "Getafe",           contractEnd: 2027 },
  { name: "Miguel Gutiérrez",         role: "LI",  position: "Defensas",       nationality: "España",       flag: "🇪🇸", dob: "2001-07-27", joinedYear: 2025, joinedFrom: "Girona",           contractEnd: 2030 },
  { name: "Leonardo Spinazzola",      role: "LI",  position: "Defensas",       nationality: "Italia",       flag: "🇮🇹", dob: "1993-03-25", joinedYear: 2024, joinedFrom: "Roma",             contractEnd: 2026 },

  // MEDIOCAMPISTAS
  { name: "Stanislav Lobotka",        role: "MCD", position: "Mediocampistas", nationality: "Eslovaquia",   flag: "🇸🇰", dob: "1994-11-25", joinedYear: 2020, joinedFrom: "Celta de Vigo",    contractEnd: 2027 },
  { name: "Frank Anguissa",           role: "MC",  position: "Mediocampistas", nationality: "Camerún",      flag: "🇨🇲", dob: "1995-11-16", joinedYear: 2021, joinedFrom: "Fulham",           contractEnd: 2027 },
  { name: "Scott McTominay",          role: "MC",  position: "Mediocampistas", nationality: "Escocia",      flag: SCO,  dob: "1996-12-08", joinedYear: 2024, joinedFrom: "Manchester United", contractEnd: 2028 },
  { name: "Billy Gilmour",            role: "MC",  position: "Mediocampistas", nationality: "Escocia",      flag: SCO,  dob: "2001-06-11", joinedYear: 2024, joinedFrom: "Brighton",         contractEnd: 2028 },
  { name: "Kevin De Bruyne",          role: "MCO", position: "Mediocampistas", nationality: "Bélgica",      flag: "🇧🇪", dob: "1991-06-28", joinedYear: 2025, joinedFrom: "Manchester City",  contractEnd: 2027 },

  // DELANTEROS
  { name: "Rasmus Højlund",           role: "DC",  position: "Delanteros",     nationality: "Dinamarca",    flag: "🇩🇰", dob: "2003-02-04", joinedYear: 2025, joinedFrom: "Manchester United", contractEnd: 2030 },
  { name: "Romelu Lukaku",            role: "DC",  position: "Delanteros",     nationality: "Bélgica",      flag: "🇧🇪", dob: "1993-05-13", joinedYear: 2024, joinedFrom: "Chelsea",          contractEnd: 2027 },
  { name: "David Neres",              role: "EI",  position: "Delanteros",     nationality: "Brasil",       flag: "🇧🇷", dob: "1997-03-03", joinedYear: 2024, joinedFrom: "Benfica",          contractEnd: 2028 },
  { name: "Matteo Politano",          role: "ED",  position: "Delanteros",     nationality: "Italia",       flag: "🇮🇹", dob: "1993-05-03", joinedYear: 2020, joinedFrom: "Inter",            contractEnd: 2027 },
  { name: "Giovane",                  role: "DC",  position: "Delanteros",     nationality: "Brasil",       flag: "🇧🇷", dob: "2003-05-13", joinedYear: 2025, joinedFrom: "RB Bragantino",    contractEnd: 2030 },

  // CEDIDOS — Napoli-owned, currently on loan elsewhere
  { name: "Lorenzo Lucca",            role: "DC",  position: "Cedidos",        nationality: "Italia",       flag: "🇮🇹", dob: "2000-09-10", joinedYear: 2025, joinedFrom: "Udinese",          contractEnd: 2029, loanTo: "Nottingham Forest" },
  { name: "Noa Lang",                 role: "EI",  position: "Cedidos",        nationality: "Países Bajos", flag: "🇳🇱", dob: "1999-06-17", joinedYear: 2025, joinedFrom: "PSV Eindhoven",    contractEnd: 2030, loanTo: "Galatasaray" },
  { name: "Cyril Ngonge",             role: "ED",  position: "Cedidos",        nationality: "Bélgica",      flag: "🇧🇪", dob: "2000-05-26", joinedYear: 2024, joinedFrom: "Hellas Verona",    contractEnd: 2028, loanTo: "Espanyol" },
];
