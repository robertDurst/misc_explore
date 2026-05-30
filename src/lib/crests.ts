// Self-hosted Serie A crests in /public/crests/<slug>.svg.
// Sourced from Wikimedia (Commons + en.wikipedia infobox SVGs) for the 2025-26 season.
// To refresh post-relegation: update the keys to match the new openfootball team names
// and re-run the crest-fetcher (see commit history for the agent task).

type TeamInfo = { slug: string; display: string };

const TEAMS: Record<string, TeamInfo> = {
  "AC Milan":                  { slug: "ac-milan",      display: "Milan" },
  "AC Pisa 1909":              { slug: "pisa",          display: "Pisa" },
  "ACF Fiorentina":            { slug: "fiorentina",    display: "Fiorentina" },
  "AS Roma":                   { slug: "as-roma",       display: "Roma" },
  "Atalanta BC":               { slug: "atalanta",      display: "Atalanta" },
  "Bologna FC 1909":           { slug: "bologna",       display: "Bologna" },
  "Cagliari Calcio":           { slug: "cagliari",      display: "Cagliari" },
  "Como 1907":                 { slug: "como",          display: "Como" },
  "FC Internazionale Milano":  { slug: "inter",         display: "Inter" },
  "Genoa CFC":                 { slug: "genoa",         display: "Genoa" },
  "Hellas Verona FC":          { slug: "hellas-verona", display: "Verona" },
  "Juventus FC":               { slug: "juventus",      display: "Juventus" },
  "Parma Calcio 1913":         { slug: "parma",         display: "Parma" },
  "SS Lazio":                  { slug: "lazio",         display: "Lazio" },
  "SSC Napoli":                { slug: "ssc-napoli",    display: "Napoli" },
  "Torino FC":                 { slug: "torino",        display: "Torino" },
  "US Cremonese":              { slug: "cremonese",     display: "Cremonese" },
  "US Lecce":                  { slug: "lecce",         display: "Lecce" },
  "US Sassuolo Calcio":        { slug: "sassuolo",      display: "Sassuolo" },
  "Udinese Calcio":            { slug: "udinese",       display: "Udinese" },
};

export function crestPath(teamName: string): string | null {
  const info = TEAMS[teamName];
  return info ? `/crests/${info.slug}.svg` : null;
}

export function displayName(teamName: string): string {
  return TEAMS[teamName]?.display ?? teamName;
}
