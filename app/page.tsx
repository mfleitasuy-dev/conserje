import { getDb } from "@/lib/db";
import { listVisitsToday } from "@/lib/visits";
import { parkingSummary } from "@/lib/parking";
import { listActiveAlerts } from "@/lib/alerts";
import { hora, fechaHora } from "@/lib/format";
import {
  UsersIcon,
  GaugeIcon,
  CarIcon,
  CheckCircleIcon,
  InboxIcon,
  AlertTriangleIcon,
} from "./icons";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const db = getDb();
  const [visits, parking, activeAlerts] = await Promise.all([
    listVisitsToday(db),
    parkingSummary(db),
    listActiveAlerts(db),
  ]);
  const activas = visits.filter((v) => !v.exited_at);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="subtitle">Resumen del día en el edificio.</p>

      <div className="cards">
        <div className="card">
          <div className="card-head">
            <UsersIcon size={18} />
          </div>
          <div className="num">{activas.length}</div>
          <div className="lbl">Visitas en el edificio</div>
        </div>
        <div className="card">
          <div className="card-head">
            <GaugeIcon size={18} />
          </div>
          <div className="num">{visits.length}</div>
          <div className="lbl">Visitas registradas hoy</div>
        </div>
        <div className="card">
          <div className="card-head">
            <CarIcon size={18} />
          </div>
          <div className="num">{parking.ocupadas}</div>
          <div className="lbl">Cocheras ocupadas</div>
        </div>
        <div className="card">
          <div className="card-head">
            <CheckCircleIcon size={18} />
          </div>
          <div className="num">{parking.libres}</div>
          <div className="lbl">Cocheras libres</div>
        </div>
        <div className="card">
          <div className="card-head">
            <AlertTriangleIcon size={18} />
          </div>
          <div className="num">{activeAlerts.length}</div>
          <div className="lbl">Alertas activas</div>
        </div>
      </div>

      <div className="panel">
        <h2>
          <AlertTriangleIcon size={18} />
          Alertas activas
        </h2>
        {activeAlerts.length === 0 ? (
          <div className="empty">
            <CheckCircleIcon size={32} />
            <p>No hay alertas activas.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mensaje</th>
                  <th>Severidad</th>
                  <th>Creada</th>
                </tr>
              </thead>
              <tbody>
                {activeAlerts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.message}</td>
                    <td>
                      <span className={`badge sev-${a.severity}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td>{fechaHora(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>
          <UsersIcon size={18} />
          Visitas en el edificio ahora
        </h2>
        {activas.length === 0 ? (
          <div className="empty">
            <InboxIcon size={32} />
            <p>No hay visitas dentro del edificio.</p>
          </div>
        ) : (
          <div className="table-wrap">
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
          </div>
        )}
      </div>
    </>
  );
}
