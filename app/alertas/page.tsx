import { getDb } from "@/lib/db";
import { listAlerts, listActiveAlerts } from "@/lib/alerts";
import { fechaHora } from "@/lib/format";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  DotIcon,
  InboxIcon,
} from "../icons";
import AlertForm from "./AlertForm";
import ResolveButton from "./ResolveButton";

export const dynamic = "force-dynamic";

// Ícono por severidad: el estado no se comunica solo por color (spec §4).
const severityIcon = {
  baja: <CheckCircleIcon size={13} />,
  media: <DotIcon size={13} />,
  alta: <AlertTriangleIcon size={13} />,
};

export default async function Alertas() {
  const db = getDb();
  const [alerts, activeAlerts] = await Promise.all([
    listAlerts(db),
    listActiveAlerts(db),
  ]);

  return (
    <>
      <h1>Alertas</h1>
      <p className="subtitle">
        Avisos de seguridad con severidad y seguimiento de resolución.
      </p>

      <div className="cards">
        <div className="card accent">
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
          Crear alerta
        </h2>
        <AlertForm />
      </div>

      <div className="panel">
        <h2>
          <AlertTriangleIcon size={18} />
          Alertas
        </h2>
        {alerts.length === 0 ? (
          <div className="empty">
            <InboxIcon size={32} />
            <p>No hay alertas registradas.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mensaje</th>
                  <th>Severidad</th>
                  <th>Creada</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.message}</td>
                    <td>
                      <span className={`badge sev-${a.severity}`}>
                        {severityIcon[a.severity]}
                        {a.severity}
                      </span>
                    </td>
                    <td className="mono">{fechaHora(a.created_at)}</td>
                    <td>
                      {a.resolved_at ? (
                        <span className="badge ok">
                          <CheckCircleIcon size={13} />
                          Resuelta {fechaHora(a.resolved_at)}
                        </span>
                      ) : (
                        <span className="badge busy">
                          <AlertTriangleIcon size={13} />
                          Activa
                        </span>
                      )}
                    </td>
                    <td>{!a.resolved_at && <ResolveButton id={a.id} />}</td>
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
