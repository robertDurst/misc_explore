import { getCalendario, type Fixture } from "@/lib/fixtures";
import LocalTime from "./LocalTime";

export const revalidate = 21600; // 6h

export const metadata = {
  title: "Calendario · Café Azzurro",
  description: "Próximo partido del Napoli y resultados recientes en Serie A.",
};

const dowFmt = new Intl.DateTimeFormat("es", {
  weekday: "short",
  timeZone: "Europe/Rome",
});
const dmFmt = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Rome",
});

function dow(iso: string) {
  return dowFmt.format(new Date(iso));
}
function dm(iso: string) {
  return dmFmt.format(new Date(iso));
}
function strip(s: string) {
  return s
    .replace(/^(SSC|AC|AS|US|FC|SS) /, "")
    .replace(/ FC$| Calcio$/, "");
}
function shortRound(r: string | null) {
  return r ? r.replace(/^Matchday /, "J") : "";
}

function MatchRow({ m, kind }: { m: Fixture; kind: "upcoming" | "past" }) {
  const teamsLine =
    kind === "past" && m.score
      ? `${strip(m.homeTeam)} ${m.score[0]} — ${m.score[1]} ${strip(m.awayTeam)}`
      : m.napoliIsHome
      ? `Napoli vs ${strip(m.opponent)}`
      : `${strip(m.opponent)} vs Napoli`;
  return (
    <li className="match">
      <div className="match-date">
        <span className="dow">{dow(m.utcISO)}</span>
        <span className="dm">{dm(m.utcISO)}</span>
      </div>
      <div className="match-teams">{teamsLine}</div>
      <div className="match-comp">Serie A {shortRound(m.round)}</div>
    </li>
  );
}

export default async function Calendario() {
  const { upcoming, past, upcomingSeasonLabel } = await getCalendario();
  const hero = upcoming[0];
  const restUpcoming = upcoming.slice(1, 11);
  const recentPast = past.slice(0, 10);

  return (
    <main className="container">
      <h1 className="page-title">Calendario</h1>

      <section className="hero-match">
        <p className="kicker">Próximo partido</p>
        {hero ? (
          <div className="hero-card">
            <div className="hero-teams">
              {hero.napoliIsHome
                ? `Napoli vs ${strip(hero.opponent)}`
                : `${strip(hero.opponent)} vs Napoli`}
            </div>
            <div className="hero-meta">
              {dow(hero.utcISO)} {dm(hero.utcISO)}
              {hero.italyTime && (
                <>
                  {" · "}
                  <time dateTime={hero.utcISO}>{hero.italyTime}</time>
                  {" Nápoles"}
                  <LocalTime iso={hero.utcISO} />
                </>
              )}
            </div>
            <div className="hero-comp">
              Serie A {shortRound(hero.round)}
            </div>
          </div>
        ) : (
          <p className="off-season">
            Pretemporada — el calendario {upcomingSeasonLabel} se publica en julio.
          </p>
        )}
      </section>

      {restUpcoming.length > 0 && (
        <section>
          <h2 className="section-title">Próximos</h2>
          <ul className="match-list">
            {restUpcoming.map((m, i) => (
              <MatchRow key={`u-${i}`} m={m} kind="upcoming" />
            ))}
          </ul>
        </section>
      )}

      {recentPast.length > 0 && (
        <section>
          <h2 className="section-title">Resultados</h2>
          <ul className="match-list">
            {recentPast.map((m, i) => (
              <MatchRow key={`p-${i}`} m={m} kind="past" />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
