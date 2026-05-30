import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const SITE_TITLE = "Café Azzurro · El Napoli en español";
const SITE_DESCRIPTION =
  "El Napoli, contado en español. Calendario, plantilla, historia y análisis del SSC Napoli desde una perspectiva caribeña.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cafeazzurro1926.es"),
  title: {
    default: SITE_TITLE,
    template: "%s · Café Azzurro",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Café Azzurro",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Café Azzurro",
    description: "El Napoli, contado en español.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fraunces.variable}>
      <body>
        <a className="skip-link" href="#main">Saltar al contenido</a>
        <header className="nav">
          <Link href="/" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={34} height={34} />
            Café <span>Azzurro</span>
          </Link>
          <nav className="links" aria-label="Navegación principal">
            <Link href="/">Inicio</Link>
            <Link href="/calendario">Calendario</Link>
            <Link href="/plantilla">Plantilla</Link>
            <Link href="/noticias">Noticias</Link>
          </nav>
        </header>
        <div id="main">{children}</div>
        <footer className="site-footer">
          <span>Proyecto de fanáticos · sin afiliación oficial con la SSC Napoli</span>
          <span aria-hidden="true"> · </span>
          <Link href="/aviso-legal">Aviso legal</Link>
        </footer>
      </body>
    </html>
  );
}
