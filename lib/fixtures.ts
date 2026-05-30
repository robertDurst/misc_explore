// Pulls Napoli fixtures + results from openfootball (CC0). Server-only.
// Tries newest season first, falls back to most recent that exists,
// so the page auto-comes-alive when the 2026-27 file drops.

type RawMatch = {
  round?: string;
  date: string;            // YYYY-MM-DD (Europe/Rome local date)
  time?: string;           // HH:mm (Europe/Rome local)
  team1: string;
  team2: string;
  score?: { ft?: [number, number]; ht?: [number, number] } | number[];
};
type RawFile = { name?: string; matches: RawMatch[] };

export type Fixture = {
  date: string;
  italyTime: string | null;
  utcISO: string;
  homeTeam: string;
  awayTeam: string;
  napoliIsHome: boolean;
  opponent: string;
  score: [number, number] | null; // FT [home, away]
  competition: string;
  round: string | null;
  season: string;
};

// Newest first — we'll surface the freshest season available.
const SEASONS = ["2026-27", "2025-26"];

function isNapoli(name: string): boolean {
  return name.toLowerCase().includes("napoli");
}

async function fetchSeason(season: string): Promise<RawFile | null> {
  const url = `https://raw.githubusercontent.com/openfootball/football.json/master/${season}/it.1.json`;
  try {
    const res = await fetch(url, { next: { revalidate: 21600 } });
    if (!res.ok) return null;
    return (await res.json()) as RawFile;
  } catch {
    return null;
  }
}

// Italy DST handling without a date library: probe Intl for the offset
// at a candidate UTC moment, then adjust.
// Exported for unit tests (lib/__tests__/fixtures.test.ts).
export function italyOffsetMinutes(utcMoment: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(utcMoment);
  const get = (t: string) => +parts.find((p) => p.type === t)!.value;
  const italyAsIfUtc = Date.UTC(
    get("year"), get("month") - 1, get("day"),
    get("hour"), get("minute"), get("second"),
  );
  return (italyAsIfUtc - utcMoment.getTime()) / 60000;
}

export function italyLocalToUtcISO(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guessUtc = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const offsetMin = italyOffsetMinutes(guessUtc);
  return new Date(guessUtc.getTime() - offsetMin * 60000).toISOString();
}

function normalize(raw: RawMatch, season: string): Fixture | null {
  if (!isNapoli(raw.team1) && !isNapoli(raw.team2)) return null;
  const napoliIsHome = isNapoli(raw.team1);
  const italyTime = raw.time ?? null;
  const utcISO = italyTime
    ? italyLocalToUtcISO(raw.date, italyTime)
    : `${raw.date}T12:00:00Z`;
  let score: [number, number] | null = null;
  if (raw.score) {
    if (Array.isArray(raw.score) && raw.score.length === 2) {
      score = [raw.score[0], raw.score[1]];
    } else if (typeof raw.score === "object" && (raw.score as { ft?: number[] }).ft) {
      const ft = (raw.score as { ft: number[] }).ft;
      if (Array.isArray(ft) && ft.length === 2) score = [ft[0], ft[1]];
    }
  }
  return {
    date: raw.date,
    italyTime,
    utcISO,
    homeTeam: raw.team1,
    awayTeam: raw.team2,
    napoliIsHome,
    opponent: napoliIsHome ? raw.team2 : raw.team1,
    score,
    competition: "Serie A",
    round: raw.round ?? null,
    season,
  };
}

export type CalendarioData = {
  upcoming: Fixture[];
  past: Fixture[];
  form: ("W" | "D" | "L")[]; // oldest -> newest, up to 5
  upcomingSeasonLabel: string;
};

function napoliResult(f: Fixture): "W" | "D" | "L" | null {
  if (!f.score) return null;
  const us = f.napoliIsHome ? f.score[0] : f.score[1];
  const them = f.napoliIsHome ? f.score[1] : f.score[0];
  if (us > them) return "W";
  if (us < them) return "L";
  return "D";
}

export async function getCalendario(): Promise<CalendarioData> {
  const all: Fixture[] = [];
  for (const season of SEASONS) {
    const file = await fetchSeason(season);
    if (!file) continue;
    for (const m of file.matches ?? []) {
      const f = normalize(m, season);
      if (f) all.push(f);
    }
  }
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const upcoming = all
    .filter((f) => f.score === null && new Date(f.utcISO).getTime() > now - TWO_HOURS)
    .sort((a, b) => a.utcISO.localeCompare(b.utcISO));
  const past = all
    .filter((f) => f.score !== null || new Date(f.utcISO).getTime() <= now - TWO_HOURS)
    .sort((a, b) => b.utcISO.localeCompare(a.utcISO));
  const form = past
    .filter((f) => f.score !== null)
    .slice(0, 5)
    .map(napoliResult)
    .filter((r): r is "W" | "D" | "L" => r !== null)
    .reverse(); // oldest on the left, newest on the right
  return { upcoming, past, form, upcomingSeasonLabel: SEASONS[0] };
}
