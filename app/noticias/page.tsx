import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { POST_FORMAT_META } from "@/lib/schema";

export const metadata = {
  title: "Noticias",
  description: "Noticias y análisis del SSC Napoli en español.",
};

export default function Noticias() {
  const posts = getAllPosts();
  return (
    <main className="container">
      <h1 className="page-title">Noticias</h1>
      {posts.length === 0 ? (
        <p className="empty">Próximamente.</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/noticias/${p.slug}`}>
                <span className="post-date">
                  {p.date}
                  {p.format && (
                    <span className={`format-badge format-${p.format}`}>
                      {POST_FORMAT_META[p.format].label}
                    </span>
                  )}
                </span>
                <span className="post-title">{p.title}</span>
                {p.resumen && <span className="post-sum">{p.resumen}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
