// Curated 2025-26 Napoli squad data. Hardcoded for v1 (deterministic, no API freshness risk).
// Designed for incremental expansion: add joinedYear, joinedFrom, contractEnd, transferFee
// to the Player type as we layer transfer data on top in future iterations.

export type SquadGroup =
  | "Porteros"
  | "Defensas"
  | "Mediocampistas"
  | "Delanteros";

export const SQUAD_GROUPS: SquadGroup[] = [
  "Porteros",
  "Defensas",
  "Mediocampistas",
  "Delanteros",
];

export type Player = {
  name: string;
  role: string;        // POR, DFC, LD, LI, MCD, MC, MCO, EI, ED, DC
  position: SquadGroup;
  nationality: string; // Spanish name
  flag: string;        // emoji
  age: number;         // as of 2026-05-29; refresh seasonally
};

export const SQUAD: Player[] = [
  // PORTEROS
  { name: "Alex Meret",               role: "POR", position: "Porteros",       nationality: "Italia",        flag: "🇮🇹",                age: 29 },
  { name: "Vanja Milinković-Savić",   role: "POR", position: "Porteros",       nationality: "Serbia",        flag: "🇷🇸",                age: 29 },

  // DEFENSAS
  { name: "Giovanni Di Lorenzo",      role: "LD",  position: "Defensas",       nationality: "Italia",        flag: "🇮🇹",                age: 32 },
  { name: "Alessandro Buongiorno",    role: "DFC", position: "Defensas",       nationality: "Italia",        flag: "🇮🇹",                age: 26 },
  { name: "Amir Rrahmani",            role: "DFC", position: "Defensas",       nationality: "Kosovo",        flag: "🇽🇰",                age: 32 },
  { name: "Sam Beukema",              role: "DFC", position: "Defensas",       nationality: "Países Bajos", flag: "🇳🇱",                age: 27 },
  { name: "Juan Jesus",               role: "DFC", position: "Defensas",       nationality: "Brasil",        flag: "🇧🇷",                age: 34 },
  { name: "Mathías Olivera",          role: "LI",  position: "Defensas",       nationality: "Uruguay",       flag: "🇺🇾",                age: 28 },
  { name: "Miguel Gutiérrez",         role: "LI",  position: "Defensas",       nationality: "España",        flag: "🇪🇸",                age: 24 },
  { name: "Leonardo Spinazzola",      role: "LI",  position: "Defensas",       nationality: "Italia",        flag: "🇮🇹",                age: 33 },

  // MEDIOCAMPISTAS
  { name: "Stanislav Lobotka",        role: "MCD", position: "Mediocampistas", nationality: "Eslovaquia",    flag: "🇸🇰",                age: 31 },
  { name: "Frank Anguissa",           role: "MC",  position: "Mediocampistas", nationality: "Camerún",       flag: "🇨🇲",                age: 30 },
  { name: "Scott McTominay",          role: "MC",  position: "Mediocampistas", nationality: "Escocia",       flag: "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", age: 29 },
  { name: "Billy Gilmour",            role: "MC",  position: "Mediocampistas", nationality: "Escocia",       flag: "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", age: 24 },
  { name: "Kevin De Bruyne",          role: "MCO", position: "Mediocampistas", nationality: "Bélgica",       flag: "🇧🇪",                age: 34 },

  // DELANTEROS
  { name: "Rasmus Højlund",           role: "DC",  position: "Delanteros",     nationality: "Dinamarca",     flag: "🇩🇰",                age: 23 },
  { name: "Romelu Lukaku",            role: "DC",  position: "Delanteros",     nationality: "Bélgica",       flag: "🇧🇪",                age: 33 },
  { name: "David Neres",              role: "EI",  position: "Delanteros",     nationality: "Brasil",        flag: "🇧🇷",                age: 29 },
  { name: "Matteo Politano",          role: "ED",  position: "Delanteros",     nationality: "Italia",        flag: "🇮🇹",                age: 33 },
  { name: "Giovane",                  role: "DC",  position: "Delanteros",     nationality: "Brasil",        flag: "🇧🇷",                age: 22 },
];
