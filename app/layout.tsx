import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Café Azzurro",
  description: "El Napoli, contado en español.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fraunces.variable}>
      <body>
        <header className="nav">
          <Link href="/" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={34} height={34} />
            Café <span>Azzurro</span>
          </Link>
          <div className="links">
            <Link href="/">Inicio</Link>
            <Link href="/calendario">Calendario</Link>
            <Link href="/noticias">Noticias</Link>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          Proyecto de fanáticos · sin afiliación oficial con la SSC Napoli
        </footer>
      </body>
    </html>
  );
}
