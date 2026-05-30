# Café Azzurro

Spanish-language SSC Napoli fan content site. Live at https://www.cafeazzurro1926.es

Unofficial, fan-made, no affiliation with the club. See `/aviso-legal`.

## Run

```sh
npm install
npm run dev       # Next dev server (http://localhost:3000)
npm run validate  # Zod-validate content/jugadores + content/noticias
npm run test      # Vitest unit suite (DST + age math)
npm run build     # Runs validate + test, then next build
```

Requires Node 24+.

## Routes

| Route | Source | Cache |
|---|---|---|
| `/` | `app/page.tsx` (static hero) | static |
| `/calendario` | `lib/fixtures.ts` → openfootball JSON | ISR 6h |
| `/plantilla` | `content/jugadores/*.md` (YAML frontmatter) | ISR 24h |
| `/noticias` | `content/noticias/*.md` | static at build |
| `/noticias/[slug]` | one MD file per article | static at build |
| `/aviso-legal` | static | static |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | static |

## Content authoring

### New news article

Create `content/noticias/<slug>.md`:

```yaml
---
title: "Título del artículo"
date: 2026-05-29
resumen: "Una línea de resumen (máximo 200 caracteres)."
---

El cuerpo del artículo en **Markdown**.
```

`git push` → live after Vercel rebuild.

### New player (or edit)

Create `content/jugadores/<slug>.md`:

```yaml
---
name: Player Name
role: MC                   # POR | DFC | LD | LI | MCD | MC | MCO | EI | ED | DC
position: Mediocampistas   # Porteros | Defensas | Mediocampistas | Delanteros | Cedidos
nationality: Italia
flag: 🇮🇹
dob: 2000-01-15
shirtNumber: 23
joinedYear: 2025
joinedFrom: Some Club
contractEnd: 2029
# loanTo: Some Club        # only and required when position: Cedidos
---
```

`npm run validate` (run automatically by `build`) enforces:

- Schema (required fields, allowed enums, integer ranges)
- `loanTo` ⟺ Cedidos invariant
- No duplicate shirt numbers in the active squad
- No duplicate player names

A bad file fails the build and never ships.

## Yearly maintenance

- **Pre-season (July/August):** prepend the new season key to `SEASONS` in `lib/fixtures.ts`.
- **Post-relegation (June):** update the `TEAMS` map in `lib/crests.ts` (3 new entries) and add the 3 new SVGs to `public/crests/`.
- **Shirt numbers:** edit `content/jugadores/*.md`.

## Architecture

- **Next.js 15 App Router** + TypeScript strict.
- **Server-by-default** (only `app/calendario/LocalTime.tsx` is `"use client"`).
- **Content** = Markdown + YAML frontmatter in `content/`. Schemas in `lib/schema.ts` (Zod) — single source of truth for both runtime validation and TS types.
- **Curated > APIs**: ESPN / TheSportsDB miss De Bruyne and Højlund from their Napoli rosters, so the squad source-of-truth is curated MD files. Hybrid-ready — fields like shirt number could later be API-enriched at build time without changing the rest.
- **Single global stylesheet** (`app/globals.css`) anchored on a small palette of CSS custom properties (`--cream`, `--navy`, `--azzurro`, `--gold`, `--espresso`).

## Brand decisions worth knowing

- **Cohesion over redundancy for Forma pills** — cream-on-azzurro fails strict WCAG; accepted for brand. `@media (prefers-contrast: more)` swaps the backgrounds to navy/espresso/dark-red for users who opt in via OS.
- **Espresso for "Derrota"** instead of broadcast red — stays in palette.
- **Brand kit + previews** live in `brand/`.

## Pipeline

- **Push-to-prod on `main`**: Vercel auto-deploys on push.
- **CI** (`.github/workflows/ci.yml`) runs `npm ci → validate → test → build` on every push to main and every PR — same chain Vercel runs.
- **Security headers** are set in `next.config.mjs`.

## License

Content: © Café Azzurro. Crests sourced from Wikimedia Commons (CC BY-SA + fair-use editorial). See `/aviso-legal`.
