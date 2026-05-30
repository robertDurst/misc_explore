// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.cafeazzurro1926.es",
  integrations: [sitemap()],
  trailingSlash: "never",
  build: { format: "directory" },
});
