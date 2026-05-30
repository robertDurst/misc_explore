import { defineCollection, z } from "astro:content";

// YAML auto-parses unquoted ISO dates to Date; accept either form and normalize.
const dateOrString = z
  .union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
    z.date(),
  ])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const noticias = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1),
    date: dateOrString,
    resumen: z.string().max(200).optional(),
  }),
});

export const collections = { noticias };
