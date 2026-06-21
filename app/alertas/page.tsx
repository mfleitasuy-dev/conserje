import { getDb } from "@/lib/db";
import { listAlerts } from "@/lib/alerts";
import { fechaHora } from "@/lib/format";
import { AlertTriangleIcon, CheckCircleIcon, InboxIcon } from "../icons";
import AlertForm from "./AlertForm";
import ResolveButton from "./ResolveButton";

export const dynamic = "force-dynamic";

export default async function Alertas() {
  const alerts = await listAlerts(getDb());

  return (
    <>
      <h1>Alertas</h1>
      <p className="subtitle">
        Avisos de seguridad con severidad y seguimiento de resolución.
      </p>

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
                        {a.severity}
                      </span>
                    </td>
                    <td>{fechaHora(a.created_at)}</td>
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
