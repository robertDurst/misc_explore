import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { POST_FORMATS, POST_FORMAT_META, type PostFormat } from "@/lib/schema";

export const metadata = {
  title: "La Carta",
  description:
    "Las secciones recurrentes de Café Azzurro: Expreso, Cortado y Sobremesa.",
};

export default function LaCarta() {
  const all = getAllPosts();
  return (
    <main className="container">
      <h1 className="page-title">La Carta</h1>
      <p className="page-sub">Las secciones de la casa</p>

      {POST_FORMATS.map((fmt: PostFormat) => {
        const posts = all.filter((p) => p.format === fmt);
        const meta = POST_FORMAT_META[fmt];
        return (
          <section key={fmt} className="carta-section">
            <header className="carta-head">
              <h2 className="carta-name">{meta.label}</h2>
              <p className="carta-tagline">{meta.tagline}</p>
            </header>
            {posts.length === 0 ? (
              <p className="empty">Próximamente.</p>
            ) : (
              <ul className="post-list">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/noticias/${p.slug}`}>
                      <span className="post-date">{p.date}</span>
                      <span className="post-title">{p.title}</span>
                      {p.resumen && <span className="post-sum">{p.resumen}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
