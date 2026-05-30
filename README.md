# Café Azzurro

Spanish-language SSC Napoli fan site. Live at https://www.cafeazzurro1926.es

Unofficial. See `/aviso-legal`.

## Run

```sh
npm install
npm run dev       # http://localhost:3000
npm run build     # validate + test + next build
```

Node 24+.

## Routes

`/` · `/calendario` (ISR 6h) · `/plantilla` (ISR 24h) · `/la-carta` · `/noticias` · `/noticias/[slug]` · `/aviso-legal` · `/sitemap.xml` · `/robots.txt`

## Authoring

**News** → `content/noticias/<slug>.md`:

```yaml
---
title: "Título"
date: 2026-05-29
resumen: "Una línea (≤200 chars)."
format: cortado   # optional: expreso | cortado | sobremesa
---
Cuerpo en Markdown.
```

**Player** → `content/jugadores/<slug>.md`. Schemas (Zod) in `lib/schema.ts`; `npm run validate` gates the build.

## Yearly

- New season: prepend to `SEASONS` in `lib/fixtures.ts`.
- Relegation: update `TEAMS` in `lib/crests.ts` + add 3 SVGs to `public/crests/`.
