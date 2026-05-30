import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE = "https://www.cafeazzurro1926.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,            lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE}/calendario`,  lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE}/plantilla`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE}/noticias`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE}/la-carta`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE}/aviso-legal`, lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];
  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${SITE}/noticias/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...posts];
}
