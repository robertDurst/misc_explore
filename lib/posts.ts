import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { POST_FORMATS, type PostFormat } from "./schema";

// Strip raw HTML blocks/inline from rendered Markdown so a contributor can't
// inject <script>/<iframe>/onerror=. We control all content today, but the
// moment a stranger PRs a post, this is the difference between editorial and
// XSS. Embeds will arrive via MDX/components if/when we want them.
marked.use({
  renderer: {
    html() {
      return "";
    },
  },
});

const DIR = path.join(process.cwd(), "content", "noticias");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;       // YYYY-MM-DD
  resumen: string;
  format?: PostFormat;
};

function normalizeDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return typeof v === "string" ? v : "";
}

function normalizeFormat(v: unknown): PostFormat | undefined {
  return typeof v === "string" && (POST_FORMATS as readonly string[]).includes(v)
    ? (v as PostFormat)
    : undefined;
}

function readMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: normalizeDate(data.date),
    resumen: typeof data.resumen === "string" ? data.resumen : "",
    format: normalizeFormat(data.format),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      return readMeta(slug, data);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function latestByFormat(): Record<PostFormat, PostMeta | undefined> {
  const all = getAllPosts();
  return {
    expreso:   all.find((p) => p.format === "expreso"),
    cortado:   all.find((p) => p.format === "cortado"),
    sobremesa: all.find((p) => p.format === "sobremesa"),
  };
}

export async function getPost(slug: string) {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const html = await marked.parse(content);
  return { meta: readMeta(slug, data), html };
}
