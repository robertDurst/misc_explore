import Link from "next/link";

export default function Home() {
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
    </main>
  );
}
