import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.cafeazzurro1926.es/sitemap.xml",
    host: "https://www.cafeazzurro1926.es",
  };
}
