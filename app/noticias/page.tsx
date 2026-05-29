import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Noticias · Café Azzurro" };

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
                <span className="post-date">{p.date}</span>
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
