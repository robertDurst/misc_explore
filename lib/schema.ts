// Single source of truth for content schemas.
// Used by lib/squad.ts (runtime + types) and scripts/validate-content.ts (CI).

import { z } from "zod";

export const SQUAD_GROUPS = [
  "Porteros",
  "Defensas",
  "Mediocampistas",
  "Delanteros",
  "Cedidos",
] as const;

export const ROLES = [
  "POR", "DFC", "LD", "LI", "MCD", "MC", "MCO", "EI", "ED", "DC",
] as const;

export type SquadGroup = (typeof SQUAD_GROUPS)[number];
export type Role = (typeof ROLES)[number];

// YAML auto-parses unquoted ISO dates to Date; accept either form and normalize.
const dateOrString = z
  .union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
    z.date(),
  ])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const playerBase = z.object({
  name: z.string().min(1),
  role: z.enum(ROLES),
  position: z.enum(SQUAD_GROUPS),
  nationality: z.string().min(1),
  flag: z.string().min(1),
  dob: dateOrString,
  shirtNumber: z.number().int().min(1).max(99).optional(),
  joinedYear: z.number().int().min(1900).max(2100).optional(),
  joinedFrom: z.string().min(1).optional(),
  contractEnd: z.number().int().min(2020).max(2040).optional(),
  loanTo: z.string().min(1).optional(),
});

export const PlayerFrontmatterSchema = playerBase.superRefine((p, ctx) => {
  if (p.position === "Cedidos" && !p.loanTo) {
    ctx.addIssue({
      code: "custom",
      message: "Cedidos requires loanTo",
      path: ["loanTo"],
    });
  }
  if (p.position !== "Cedidos" && p.loanTo) {
    ctx.addIssue({
      code: "custom",
      message: `only Cedidos may have loanTo (got "${p.loanTo}")`,
      path: ["loanTo"],
    });
  }
});

export type PlayerFrontmatter = z.infer<typeof PlayerFrontmatterSchema>;

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: dateOrString,
  resumen: z.string().max(200).optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
