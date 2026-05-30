import { getCalendario, type Fixture } from "@/lib/fixtures";
import { crestPath, displayName } from "@/lib/crests";
import LocalTime from "./LocalTime";

export const revalidate = 21600; // 6h

export const metadata = {
  title: "Calendario",
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
function shortRound(r: string | null) {
  return r ? r.replace(/^Matchday /, "J") : "";
}

function Crest({ teamName, size = 20 }: { teamName: string; size?: number }) {
  const src = crestPath(teamName);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="crest" width={size} height={size} />;
}

function MatchRow({ m, kind }: { m: Fixture; kind: "upcoming" | "past" }) {
  const middle =
    kind === "past" && m.score ? (
      <span className="score">
        {m.score[0]} — {m.score[1]}
      </span>
    ) : (
      <span className="vs">vs</span>
    );
  return (
    <li className="match">
      <div className="match-date">
        {dow(m.utcISO)} {dm(m.utcISO)}
      </div>
      <div className="match-line">
        <Crest teamName={m.homeTeam} />
        <span className="team-name">{displayName(m.homeTeam)}</span>
        {middle}
        <span className="team-name">{displayName(m.awayTeam)}</span>
        <Crest teamName={m.awayTeam} />
      </div>
      <div className="match-comp">Serie A {shortRound(m.round)}</div>
    </li>
  );
}

export default async function Calendario() {
  const { upcoming, past, form, upcomingSeasonLabel } = await getCalendario();
  const hero = upcoming[0];
  const restUpcoming = upcoming.slice(1, 11);
  const recentPast = past.slice(0, 5);

  return (
    <main className="container">
      <h1 className="page-title">Calendario</h1>

      <section className="hero-match">
        <p className="kicker">Próximo partido</p>
        {hero ? (
          <div className="hero-card">
            <div className="hero-teams">
              <Crest teamName={hero.homeTeam} size={42} /> {displayName(hero.homeTeam)}
              {" vs "}
              <Crest teamName={hero.awayTeam} size={42} /> {displayName(hero.awayTeam)}
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

      {form.length > 0 && (
        <section className="form-section">
          <p className="kicker">Forma · Últimos 5</p>
          <div className="form-pills" role="list" aria-label="Forma de los últimos 5 partidos">
            {form.map((r, i) => {
              const label = r === "W" ? "V" : r === "D" ? "E" : "D";
              const title = r === "W" ? "Victoria" : r === "D" ? "Empate" : "Derrota";
              return (
                <span
                  key={i}
                  role="listitem"
                  className={`form-pill form-${r}`}
                  title={title}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </section>
      )}

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
