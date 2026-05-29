import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "noticias");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  resumen: string;
};

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        resumen: data.resumen ?? "",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string) {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const html = await marked.parse(content);
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      resumen: data.resumen ?? "",
    } as PostMeta,
    html,
  };
}
