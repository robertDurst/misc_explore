#!/usr/bin/env tsx
// Validates content/jugadores/*.md + content/noticias/*.md against the Zod
// schemas in lib/schema.ts. Run via `tsx`. Fails the build on any error.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PlayerFrontmatterSchema, PostFrontmatterSchema } from "../lib/schema";

const PLAYERS_DIR = path.join(process.cwd(), "content", "jugadores");
const POSTS_DIR = path.join(process.cwd(), "content", "noticias");

const errors: string[] = [];
const formatIssue = (file: string, p: PropertyKey[], msg: string) =>
  `  ${file} · ${p.length ? p.map(String).join(".") : "(root)"}: ${msg}`;

// --- jugadores ---
if (!fs.existsSync(PLAYERS_DIR)) {
  errors.push(`✗ ${PLAYERS_DIR} does not exist`);
} else {
  const files = fs.readdirSync(PLAYERS_DIR).filter((f) => f.endsWith(".md"));
  if (files.length === 0) errors.push(`✗ no .md in ${PLAYERS_DIR}`);

  const seenNumbers = new Map<number, string[]>();
  const seenNames = new Map<string, string[]>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(PLAYERS_DIR, file), "utf8");
    const { data } = matter(raw);
    const result = PlayerFrontmatterSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(formatIssue(`jugadores/${file}`, issue.path, issue.message));
      }
      continue;
    }
    const p = result.data;
    if (p.position !== "Cedidos" && typeof p.shirtNumber === "number") {
      if (!seenNumbers.has(p.shirtNumber)) seenNumbers.set(p.shirtNumber, []);
      seenNumbers.get(p.shirtNumber)!.push(file);
    }
    if (!seenNames.has(p.name)) seenNames.set(p.name, []);
    seenNames.get(p.name)!.push(file);
  }

  for (const [num, fs_] of seenNumbers) {
    if (fs_.length > 1)
      errors.push(`  jugadores · duplicate shirtNumber ${num}: ${fs_.join(", ")}`);
  }
  for (const [name, fs_] of seenNames) {
    if (fs_.length > 1)
      errors.push(`  jugadores · duplicate name "${name}": ${fs_.join(", ")}`);
  }
}

// --- noticias (optional — only validate if files exist) ---
if (fs.existsSync(POSTS_DIR)) {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const seenSlugs = new Map<string, string[]>();
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data } = matter(raw);
    const result = PostFrontmatterSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(formatIssue(`noticias/${file}`, issue.path, issue.message));
      }
    }
    if (!seenSlugs.has(slug)) seenSlugs.set(slug, []);
    seenSlugs.get(slug)!.push(file);
  }
  for (const [slug, fs_] of seenSlugs) {
    if (fs_.length > 1)
      errors.push(`  noticias · duplicate slug "${slug}": ${fs_.join(", ")}`);
  }
}

if (errors.length > 0) {
  console.error(`✗ ${errors.length} content error${errors.length === 1 ? "" : "s"}:\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("✓ content valid");
