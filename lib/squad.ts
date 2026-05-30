// Reads content/jugadores/*.md, validates against the Zod schema in lib/schema.ts,
// returns sorted Player[]. Validation also runs at build time via
// scripts/validate-content.ts — pages can trust the data here.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  PlayerFrontmatterSchema,
  SQUAD_GROUPS,
  type PlayerFrontmatter,
  type SquadGroup,
} from "./schema";

export { SQUAD_GROUPS, type SquadGroup };

export type Player = PlayerFrontmatter & {
  slug: string;
  bio?: string;            // Markdown body — for future per-player pages
};

const DIR = path.join(process.cwd(), "content", "jugadores");

export function getSquad(): Player[] {
  if (!fs.existsSync(DIR)) return [];

  const players: Player[] = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      const result = PlayerFrontmatterSchema.safeParse(data);
      if (!result.success) {
        // Should never happen — validate-content.ts gates the build.
        throw new Error(
          `Invalid player frontmatter in ${f}: ${result.error.message}`,
        );
      }
      const bio = content.trim();
      return {
        slug,
        ...result.data,
        ...(bio ? { bio } : {}),
      };
    });

  // Stable order: group → shirt number ascending → alphabetical (es).
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
