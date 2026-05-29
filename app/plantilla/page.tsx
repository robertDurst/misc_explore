import { SQUAD, SQUAD_GROUPS, type Player } from "@/lib/squad";

export const metadata = {
  title: "Plantilla · Café Azzurro",
  description: "La plantilla del Napoli para la temporada 2025-26.",
};

function PlayerCard({ p }: { p: Player }) {
  return (
    <li className="player-card">
      <div className="player-name">{p.name}</div>
      <div className="player-meta">
        <span className="role">{p.role}</span>
        <span className="dot">·</span>
        <span className="flag" aria-hidden="true">{p.flag}</span>
        <span className="nationality">{p.nationality}</span>
        <span className="dot">·</span>
        <span className="age">{p.age} años</span>
      </div>
    </li>
  );
}

export default function Plantilla() {
  return (
    <main className="container">
      <h1 className="page-title">Plantilla</h1>
      <p className="page-sub">Temporada 2025-26</p>

      {SQUAD_GROUPS.map((group) => {
        const players = SQUAD.filter((p) => p.position === group);
        if (players.length === 0) return null;
        return (
          <section key={group} className="squad-section">
            <h2 className="section-title">{group}</h2>
            <ul className="squad-list">
              {players.map((p) => (
                <PlayerCard key={p.name} p={p} />
              ))}
            </ul>
          </section>
        );
      })}

      <p className="plantilla-note">
        Plantilla aproximada · {SQUAD.length} jugadores · datos curados a mano por ahora.
      </p>
    </main>
  );
}
