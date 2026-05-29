// Squad data source-of-truth lives in content/jugadores/*.md (one YAML
// frontmatter file per player). This module just reads, types, sorts.
// Validation is enforced separately by scripts/validate-squad.mjs, which
// runs as part of `npm run build`.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

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
  slug: string;
  name: string;
  role: string;            // POR / DFC / LD / LI / MCD / MC / MCO / EI / ED / DC
  position: SquadGroup;
  nationality: string;
  flag: string;
  dob: string;             // YYYY-MM-DD
  shirtNumber?: number;
  joinedYear?: number;
  joinedFrom?: string;
  contractEnd?: number;
  loanTo?: string;         // Cedidos only
  bio?: string;            // Markdown body — for future per-player pages
};

const DIR = path.join(process.cwd(), "content", "jugadores");

export function getSquad(): Player[] {
  if (!fs.existsSync(DIR)) return [];

  const players = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f): Player => {
      const slug = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      const bio = content.trim();
      // YAML may auto-parse unquoted ISO dates to a Date object — normalize.
      const dob = data.dob instanceof Date
        ? data.dob.toISOString().slice(0, 10)
        : data.dob;
      return {
        slug,
        ...(data as Omit<Player, "slug" | "bio">),
        dob,
        ...(bio ? { bio } : {}),
      };
    });

  // Stable order: group → shirt number ascending → alphabetical (Spanish locale)
  return players.sort((a, b) => {
    const ga = SQUAD_GROUPS.indexOf(a.position);
    const gb = SQUAD_GROUPS.indexOf(b.position);
    if (ga !== gb) return ga - gb;
    if (a.shirtNumber !== undefined && b.shirtNumber !== undefined) {
      return a.shirtNumber - b.shirtNumber;
    }
    if (a.shirtNumber !== undefined) return -1;
    if (b.shirtNumber !== undefined) return 1;
    return a.name.localeCompare(b.name, "es");
  });
}

export function ageFromDob(dob: string, asOf: Date = new Date()): number {
  const b = new Date(dob);
  let age = asOf.getUTCFullYear() - b.getUTCFullYear();
  const m = asOf.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && asOf.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

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
