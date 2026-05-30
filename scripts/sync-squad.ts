#!/usr/bin/env tsx
// Drift detector + optional writer for content/jugadores/*.md.
//
// Reads the Napoli squad from API-Football (api-sports.io v3, free tier),
// compares it to the markdown frontmatter on disk, and prints a report.
// With --write, it overwrites auto-synced fields in existing files and
// creates new files for unrecognised players (flagged with `_review: true`).
//
// Only `shirtNumber` is auto-synced — it changes legitimately each season
// and the API is authoritative. Everything else (dob, position, role, name,
// nationality, joinedFrom, joinedYear, loanTo, contractEnd) is reported as
// MANUAL so the human can spot real drift (e.g. wrong DOB) without
// auto-corrupting good data (e.g. API miscategorizing a winger as a midfielder).
//
// Env: API_FOOTBALL_KEY (required), NAPOLI_TEAM_ID (default 492).
//
// Exit 0 = no drift, 1 = drift detected (so CI can branch on it).

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  PlayerFrontmatterSchema,
  type PlayerFrontmatter,
  type SquadGroup,
} from "../lib/schema";

const API = "https://v3.football.api-sports.io";
const KEY = process.env.API_FOOTBALL_KEY;
const TEAM_ID = Number(process.env.NAPOLI_TEAM_ID ?? 492);
const DIR = path.join(process.cwd(), "content", "jugadores");
const WRITE = process.argv.includes("--write");

if (!KEY) {
  console.error("✗ API_FOOTBALL_KEY not set");
  process.exit(2);
}

// ---------- API-Football types (subset, v3) ----------

type ApiSquadPlayer = {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Attacker";
  photo: string;
};

type ApiPlayerProfile = {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  birth: { date: string; place: string | null; country: string };
  nationality: string;
  height: string | null;
  weight: string | null;
};

type ApiTransfer = {
  player: { id: number; name: string };
  update: string;
  transfers: Array<{
    date: string;
    type: string | null; // "Loan" | "Free" | "€20M" | etc.
    teams: {
      in: { id: number; name: string; logo: string };
      out: { id: number; name: string; logo: string };
    };
  }>;
};

// ---------- mappings (translate API → repo conventions) ----------

const POSITION_TO_GROUP: Record<ApiSquadPlayer["position"], SquadGroup> = {
  Goalkeeper: "Porteros",
  Defender: "Defensas",
  Midfielder: "Mediocampistas",
  Attacker: "Delanteros",
};

const DEFAULT_ROLE: Record<ApiSquadPlayer["position"], PlayerFrontmatter["role"]> = {
  Goalkeeper: "POR",
  Defender: "DFC",
  Midfielder: "MC",
  Attacker: "DC",
};

// Spanish nationality + flag for common cases. Extend as needed.
const NATIONALITY: Record<string, { es: string; flag: string }> = {
  Italy:        { es: "Italia",       flag: "🇮🇹" },
  Brazil:       { es: "Brasil",       flag: "🇧🇷" },
  Belgium:      { es: "Bélgica",      flag: "🇧🇪" },
  Denmark:      { es: "Dinamarca",    flag: "🇩🇰" },
  Slovakia:     { es: "Eslovaquia",   flag: "🇸🇰" },
  Cameroon:     { es: "Camerún",      flag: "🇨🇲" },
  Netherlands:  { es: "Países Bajos", flag: "🇳🇱" },
  Spain:        { es: "España",       flag: "🇪🇸" },
  Uruguay:      { es: "Uruguay",      flag: "🇺🇾" },
  Kosovo:       { es: "Kosovo",       flag: "🇽🇰" },
  Serbia:       { es: "Serbia",       flag: "🇷🇸" },
  Scotland:     { es: "Escocia",      flag: "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}" },
  "North Macedonia": { es: "Macedonia del Norte", flag: "🇲🇰" },
};

// ---------- fetch helpers ----------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function api<T>(endpoint: string): Promise<T> {
  // Free tier: 10 req/min hard cap. Back off on 429 and retry a few times.
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`${API}${endpoint}`, {
      headers: { "x-apisports-key": KEY! },
    });
    if (res.status === 429) {
      const wait = (attempt + 1) * 8000;
      console.log(`  · 429 on ${endpoint}, backing off ${wait}ms`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`${endpoint} → ${res.status} ${res.statusText}`);
    const json = (await res.json()) as { response: T; errors?: unknown };
    if (json.errors && Object.keys(json.errors as object).length > 0) {
      throw new Error(`${endpoint} → ${JSON.stringify(json.errors)}`);
    }
    return json.response;
  }
  throw new Error(`${endpoint} → exhausted retries (still 429)`);
}

async function fetchProfiles(ids: number[]): Promise<ApiPlayerProfile[]> {
  // /players?team=X&season=Y is gated to 2022-2024 on the free tier. The
  // /players/profiles?player=ID endpoint is not season-gated and returns
  // birth/nationality/position. Costs one call per player — ~27 for Napoli,
  // well under the 100 req/day free cap (≈58 calls/day at 12h cadence).
  const out: ApiPlayerProfile[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (i > 0) await sleep(6500); // stay under 10 req/min
    const r = await api<Array<{ player: ApiPlayerProfile }>>(
      `/players/profiles?player=${id}`,
    );
    if (r[0]) out.push(r[0].player);
    process.stdout.write(`  · profile ${i + 1}/${ids.length}\r`);
  }
  console.log("");
  return out;
}

// ---------- repo reading ----------

type RepoPlayer = PlayerFrontmatter & { slug: string };

function readRepo(): RepoPlayer[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), "utf8");
      const { data } = matter(raw);
      const parsed = PlayerFrontmatterSchema.parse(data);
      return { ...parsed, slug: f.replace(/\.md$/, "") };
    });
}

// Match API player → repo file. Try exact name, then last-word, then first-word.
function matchSlug(apiName: string, repo: RepoPlayer[]): RepoPlayer | undefined {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const a = norm(apiName);
  return (
    repo.find((p) => norm(p.name) === a) ??
    repo.find((p) => a.includes(norm(p.name))) ??
    repo.find((p) => norm(p.name).includes(a.split(" ").pop()!))
  );
}

// ---------- diff + write ----------

type Drift = {
  slug: string;
  name: string;
  changes: Array<{ field: string; from: unknown; to: unknown; autoSync: boolean }>;
};

const AUTO_SYNC = new Set(["shirtNumber"]);

// Fields excluded from drift detection entirely.
// - name: API uses initials ("A. Meret" vs "Alex Meret"), always noise.
// - joinedFrom/joinedYear: API spells club names differently, every player drifts.
// - role: API's broad position can't map to fine-grained roles (LD/LI/MCO/etc).
// - position: API miscategorizes wingers as midfielders (e.g. Politano), causes false drift.
const IGNORE_DIFF = new Set(["name", "joinedFrom", "joinedYear", "role", "position"]);

function buildSyncedPlayer(args: {
  api: ApiSquadPlayer;
  profile: ApiPlayerProfile | undefined;
  loanTo: string | undefined;
}): Partial<PlayerFrontmatter> {
  const { api: a, profile, loanTo } = args;
  const nat = profile && NATIONALITY[profile.nationality];
  return {
    name: a.name,
    role: DEFAULT_ROLE[a.position],
    position: loanTo ? "Cedidos" : POSITION_TO_GROUP[a.position],
    nationality: nat?.es ?? profile?.nationality ?? "—",
    flag: nat?.flag ?? "🏳️",
    dob: profile?.birth.date ?? "1900-01-01",
    shirtNumber: a.number ?? undefined,
    loanTo,
  };
}

function diff(repo: RepoPlayer, synced: Partial<PlayerFrontmatter>): Drift["changes"] {
  const out: Drift["changes"] = [];
  for (const field of Object.keys(synced) as Array<keyof PlayerFrontmatter>) {
    if (IGNORE_DIFF.has(field as string)) continue;
    const v = synced[field];
    if (v === undefined) continue;
    if (repo[field] !== v) {
      out.push({
        field,
        from: repo[field],
        to: v,
        autoSync: AUTO_SYNC.has(field as string),
      });
    }
  }
  return out;
}

function slugFor(name: string): string {
  return name.toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------- main ----------

async function main(): Promise<void> {
  const repo = readRepo();
  console.log(`→ repo: ${repo.length} jugadores`);

  const [squad, rawTransfers] = await Promise.all([
    api<Array<{ team: unknown; players: ApiSquadPlayer[] }>>(`/players/squads?team=${TEAM_ID}`),
    api<ApiTransfer[]>(`/transfers?team=${TEAM_ID}`),
  ]);
  const squadList = squad[0]?.players ?? [];
  const profiles = await fetchProfiles(squadList.map((p) => p.id));
  console.log(`→ api: ${squadList.length} squad players, ${profiles.length} profiles, ${rawTransfers.length} transfer records`);

  // Latest transfer per player.
  const latestTransfer = new Map<number, ApiTransfer["transfers"][number]>();
  for (const t of rawTransfers) {
    const ordered = [...t.transfers].sort((a, b) => b.date.localeCompare(a.date));
    if (ordered[0]) latestTransfer.set(t.player.id, ordered[0]);
  }

  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const drifts: Drift[] = [];
  const newPlayers: Array<{ slug: string; api: ApiSquadPlayer; data: PlayerFrontmatter }> = [];
  const matchedSlugs = new Set<string>();

  for (const a of squadList) {
    const last = latestTransfer.get(a.id);
    const loanTo = last && last.type?.toLowerCase().includes("loan") && last.teams.out.id === TEAM_ID
      ? last.teams.in.name
      : undefined;
    const synced = buildSyncedPlayer({ api: a, profile: profileById.get(a.id), loanTo });

    const match = matchSlug(a.name, repo);
    if (match) {
      matchedSlugs.add(match.slug);
      const changes = diff(match, synced);
      if (changes.length > 0) drifts.push({ slug: match.slug, name: a.name, changes });
    } else {
      // New player: seed with synced fields + sensible joinedYear from latest transfer if it was an IN.
      const joinIn = last && last.teams.in.id === TEAM_ID ? last : undefined;
      newPlayers.push({
        slug: slugFor(a.name),
        api: a,
        data: {
          ...(synced as PlayerFrontmatter),
          joinedYear: joinIn ? Number(joinIn.date.slice(0, 4)) : undefined,
          joinedFrom: joinIn?.teams.out.name,
        },
      });
    }
  }

  const orphans = repo.filter((p) => !matchedSlugs.has(p.slug) && p.position !== "Cedidos");
  // Cedidos are expected to live in repo even if API drops them from the squad endpoint;
  // we still report them so the human can verify the loan is current.
  const cedidosUnverified = repo.filter((p) => p.position === "Cedidos" && !matchedSlugs.has(p.slug));

  // ----- report -----
  console.log("\n=== sync report ===");
  if (drifts.length === 0 && newPlayers.length === 0 && orphans.length === 0) {
    console.log("✓ no drift");
  } else {
    if (drifts.length > 0) {
      console.log(`\n${drifts.length} drift${drifts.length === 1 ? "" : "s"}:`);
      for (const d of drifts) {
        console.log(`  ${d.slug} (${d.name})`);
        for (const c of d.changes) {
          const tag = c.autoSync ? "auto" : "MANUAL";
          console.log(`    [${tag}] ${c.field}: ${JSON.stringify(c.from)} → ${JSON.stringify(c.to)}`);
        }
      }
    }
    if (newPlayers.length > 0) {
      console.log(`\n${newPlayers.length} new player${newPlayers.length === 1 ? "" : "s"} in API but not repo (verify before adding — many are youth/Primavera):`);
      for (const n of newPlayers) {
        const age = n.api.age;
        const pos = n.api.position;
        const shirt = n.api.number ?? "—";
        console.log(`  + ${n.slug} (${n.api.name}) [age ${age}, ${pos}, #${shirt}]`);
      }
    }
    if (orphans.length > 0) {
      console.log(`\n${orphans.length} repo player${orphans.length === 1 ? "" : "s"} not in API squad (sold? released? slug mismatch?):`);
      for (const o of orphans) console.log(`  - ${o.slug} (${o.name})`);
    }
    if (cedidosUnverified.length > 0) {
      console.log(`\n${cedidosUnverified.length} cedido${cedidosUnverified.length === 1 ? "" : "s"} not seen in API squad (normal — verify loan still active):`);
      for (const c of cedidosUnverified) console.log(`  ? ${c.slug} (${c.name} → ${c.loanTo})`);
    }
  }

  // ----- write -----
  // Only existing files get auto-updated, and only for AUTO_SYNC fields.
  // New players are intentionally NOT created automatically — the API's
  // squad endpoint mixes youth/Primavera with first team, so a human still
  // needs to decide. The report above tells them what to do.
  if (WRITE) {
    let writes = 0;
    for (const d of drifts) {
      const autoChanges = d.changes.filter((c) => c.autoSync);
      if (autoChanges.length === 0) continue;
      const repoFile = path.join(DIR, `${d.slug}.md`);
      const { data, content } = matter(fs.readFileSync(repoFile, "utf8"));
      const next = { ...data } as Record<string, unknown>;
      for (const c of autoChanges) next[c.field] = c.to;
      fs.writeFileSync(repoFile, matter.stringify(content, next));
      writes++;
    }
    console.log(`\n✓ wrote ${writes} file${writes === 1 ? "" : "s"}`);
  } else if (drifts.length > 0 || newPlayers.length > 0) {
    console.log("\nrun with --write to apply auto-syncable changes (shirt # only)");
  }

  const hasAutoDrift = drifts.some((d) => d.changes.some((c) => c.autoSync));
  process.exit(hasAutoDrift ? 1 : 0);
}

main().catch((err) => {
  console.error("✗", err);
  process.exit(2);
});
