import { getDb } from "@/lib/db";
import { listVisitsToday } from "@/lib/visits";
import { listSpots } from "@/lib/parking";
import { hora } from "@/lib/format";
import VisitForm from "./VisitForm";
import ExitButton from "./ExitButton";

export const dynamic = "force-dynamic";

export default async function Porteria() {
  const db = getDb();
  const [visits, spots, units] = await Promise.all([
    listVisitsToday(db),
    listSpots(db),
    db.query("SELECT label FROM units ORDER BY label"),
  ]);
  const visitorSpots = spots
    .filter((s) => s.kind === "visita" && !s.occupied)
    .map((s) => ({ label: s.label }));

  return (
    <>
      <h1>Portería</h1>
      <p className="subtitle">Registro de ingresos y salidas de visitas.</p>

      <div className="panel">
        <h2>Registrar ingreso</h2>
        <VisitForm
          units={units.rows as { label: string }[]}
          visitorSpots={visitorSpots}
        />
      </div>

      <div className="panel">
        <h2>Visitas de hoy</h2>
        {visits.length === 0 ? (
          <p className="muted">Todavía no hay visitas registradas hoy.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Visitante</th>
                <th>Doc.</th>
                <th>Unidad</th>
                <th>Patente</th>
                <th>Cochera</th>
                <th>Ingreso</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v.id}>
                  <td>{v.visitor_name}</td>
                  <td>{v.visitor_doc}</td>
                  <td>{v.unit_label}</td>
                  <td>{v.plate ?? "—"}</td>
                  <td>{v.spot_label ?? "—"}</td>
                  <td>{hora(v.entered_at)}</td>
                  <td>
                    {v.exited_at ? (
                      <span className="badge ok">
                        Salió {hora(v.exited_at)}
                      </span>
                    ) : (
                      <span className="badge busy">En el edificio</span>
                    )}
                  </td>
                  <td>{!v.exited_at && <ExitButton id={v.id} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
