#!/usr/bin/env node
// Validate content/jugadores/*.md.
// Runs as part of `npm run build` (and in GitHub Actions CI).
// Exit 1 on any problem so the build fails before deploy.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "jugadores");
const ROLES = ["POR","DFC","LD","LI","MCD","MC","MCO","EI","ED","DC"];
const POSITIONS = ["Porteros","Defensas","Mediocampistas","Delanteros","Cedidos"];

if (!fs.existsSync(DIR)) {
  console.error(`✗ ${DIR} does not exist`);
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
if (files.length === 0) {
  console.error(`✗ no .md files in ${DIR}`);
  process.exit(1);
}

const errors = [];
const seenNumbers = new Map(); // shirtNumber -> [files]
const seenNames = new Map();
const isInt = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;

for (const file of files) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data: d } = matter(raw);
  const err = (msg) => errors.push(`  ${file}: ${msg}`);

  // Required
  if (typeof d.name !== "string" || !d.name.trim()) err("name missing or empty");
  if (!ROLES.includes(d.role))
    err(`role "${d.role}" not in ${ROLES.join(", ")}`);
  if (!POSITIONS.includes(d.position))
    err(`position "${d.position}" not in ${POSITIONS.join(", ")}`);
  if (typeof d.nationality !== "string" || !d.nationality.trim())
    err("nationality missing or empty");
  if (typeof d.flag !== "string" || !d.flag.trim())
    err("flag missing or empty");
  // YAML auto-parses unquoted ISO dates to Date — accept either form.
  let dobStr = d.dob;
  if (d.dob instanceof Date) dobStr = d.dob.toISOString().slice(0, 10);
  if (typeof dobStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dobStr))
    err(`dob "${d.dob}" must be YYYY-MM-DD`);
  else if (Number.isNaN(new Date(dobStr).getTime()))
    err(`dob "${dobStr}" is not a real date`);

  // Optional, but if present must be valid
  if ("shirtNumber" in d && !isInt(d.shirtNumber, 1, 99))
    err(`shirtNumber ${d.shirtNumber} must be integer 1–99`);
  if ("joinedYear" in d && !isInt(d.joinedYear, 1900, 2100))
    err(`joinedYear ${d.joinedYear} must be integer 1900–2100`);
  if ("contractEnd" in d && !isInt(d.contractEnd, 2020, 2040))
    err(`contractEnd ${d.contractEnd} must be integer 2020–2040`);
  if ("joinedFrom" in d && (typeof d.joinedFrom !== "string" || !d.joinedFrom.trim()))
    err("joinedFrom must be a non-empty string when present");
  if ("loanTo" in d && (typeof d.loanTo !== "string" || !d.loanTo.trim()))
    err("loanTo must be a non-empty string when present");

  // Loan logic
  if (d.position === "Cedidos" && !d.loanTo)
    err("Cedidos must have loanTo");
  if (d.position !== "Cedidos" && d.loanTo)
    err(`only Cedidos may have loanTo (got "${d.loanTo}")`);

  // Track duplicates (shirt# scoped to active squad, names global)
  if (d.position !== "Cedidos" && typeof d.shirtNumber === "number") {
    if (!seenNumbers.has(d.shirtNumber)) seenNumbers.set(d.shirtNumber, []);
    seenNumbers.get(d.shirtNumber).push(file);
  }
  if (typeof d.name === "string" && d.name) {
    if (!seenNames.has(d.name)) seenNames.set(d.name, []);
    seenNames.get(d.name).push(file);
  }
}

for (const [num, fs_] of seenNumbers) {
  if (fs_.length > 1)
    errors.push(`  Duplicate shirtNumber ${num}: ${fs_.join(", ")}`);
}
for (const [name, fs_] of seenNames) {
  if (fs_.length > 1)
    errors.push(`  Duplicate name "${name}": ${fs_.join(", ")}`);
}

if (errors.length > 0) {
  console.error(
    `✗ ${files.length} player files checked, ${errors.length} error${errors.length === 1 ? "" : "s"}:\n${errors.join("\n")}`,
  );
  process.exit(1);
}
console.log(`✓ ${files.length} player files valid`);
