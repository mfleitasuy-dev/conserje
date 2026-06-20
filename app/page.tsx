import { getDb } from "@/lib/db";
import { listVisitsToday } from "@/lib/visits";
import { parkingSummary } from "@/lib/parking";
import { hora } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const db = getDb();
  const [visits, parking] = await Promise.all([
    listVisitsToday(db),
    parkingSummary(db),
  ]);
  const activas = visits.filter((v) => !v.exited_at);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="subtitle">Resumen del día en el edificio.</p>

      <div className="cards">
        <div className="card">
          <div className="num">{activas.length}</div>
          <div className="lbl">Visitas en el edificio</div>
        </div>
        <div className="card">
          <div className="num">{visits.length}</div>
          <div className="lbl">Visitas registradas hoy</div>
        </div>
        <div className="card">
          <div className="num">{parking.ocupadas}</div>
          <div className="lbl">Cocheras ocupadas</div>
        </div>
        <div className="card">
          <div className="num">{parking.libres}</div>
          <div className="lbl">Cocheras libres</div>
        </div>
      </div>

      <div className="panel">
        <h2>Visitas en el edificio ahora</h2>
        {activas.length === 0 ? (
          <p className="muted">No hay visitas dentro del edificio.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Visitante</th>
                <th>Unidad</th>
                <th>Cochera</th>
                <th>Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {activas.map((v) => (
                <tr key={v.id}>
                  <td>{v.visitor_name}</td>
                  <td>{v.unit_label}</td>
                  <td>{v.spot_label ?? "—"}</td>
                  <td>{hora(v.entered_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
