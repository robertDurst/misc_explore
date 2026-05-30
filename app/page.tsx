import Link from "next/link";
import { latestByFormat } from "@/lib/posts";
import { POST_FORMATS, POST_FORMAT_META, type PostFormat } from "@/lib/schema";

export default function Home() {
  const latest = latestByFormat();
  return (
    <main className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src="/logo.svg" alt="Café Azzurro" width={170} height={170} />
      <h1>
        Café <span className="az">Azzurro</span>
      </h1>
      <p className="credit">Napoli · dal 1926</p>
      <hr className="rule" />
      <p className="tag">Donde el azzurro huele a café.</p>
      <Link className="cta" href="/noticias">
        Leer las noticias →
      </Link>

      <section className="carta-strip" aria-label="La Carta">
        <p className="kicker carta-strip-kicker">La Carta</p>
        <ul className="slot-cards">
          {POST_FORMATS.map((fmt: PostFormat) => {
            const meta = POST_FORMAT_META[fmt];
            const post = latest[fmt];
            return (
              <li key={fmt} className="slot-card">
                <p className="slot-name">{meta.label}</p>
                <p className="slot-tagline">{meta.tagline}</p>
                {post ? (
                  <Link className="slot-link" href={`/noticias/${post.slug}`}>
                    <span className="slot-latest-date">{post.date}</span>
                    <span className="slot-latest-title">{post.title}</span>
                  </Link>
                ) : (
                  <p className="slot-empty">Próximamente</p>
                )}
              </li>
            );
          })}
        </ul>
        <Link className="carta-strip-more" href="/la-carta">
          Ver La Carta →
        </Link>
      </section>
    </main>
  );
}
