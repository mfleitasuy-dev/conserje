import { getDb } from "@/lib/db";
import { listSpots } from "@/lib/parking";
import AssignForm from "./AssignForm";

export const dynamic = "force-dynamic";

export default async function Parking() {
  const db = getDb();
  const [spots, units] = await Promise.all([
    listSpots(db),
    db.query("SELECT label FROM units ORDER BY label"),
  ]);

  return (
    <>
      <h1>Cocheras</h1>
      <p className="subtitle">Estado y asignación de cocheras del edificio.</p>

      <div className="panel">
        <h2>Asignar cochera a un residente</h2>
        <AssignForm
          spots={spots.map((s) => ({ label: s.label }))}
          units={units.rows as { label: string }[]}
        />
      </div>

      <div className="panel">
        <h2>Estado de cocheras</h2>
        <div className="grid-spots">
          {spots.map((s) => (
            <div className="spot" key={s.id}>
              <div className="name">{s.label}</div>
              <div className="kind">
                {s.kind === "residente"
                  ? `Residente ${s.unit_label ?? ""}`.trim()
                  : "Visita"}
              </div>
              <div style={{ marginTop: 8 }}>
                {s.occupied ? (
                  <span className="badge busy">Ocupada</span>
                ) : (
                  <span className="badge ok">Libre</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
