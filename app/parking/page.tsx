import { getDb } from "@/lib/db";
import { listSpots, parkingSummary } from "@/lib/parking";
import { CarIcon, CheckCircleIcon } from "../icons";
import AssignForm from "./AssignForm";
import FreeButton from "./FreeButton";

export const dynamic = "force-dynamic";

export default async function Parking() {
  const db = getDb();
  const [spots, units, parking] = await Promise.all([
    listSpots(db),
    db.query("SELECT label FROM units ORDER BY label"),
    parkingSummary(db),
  ]);

  return (
    <>
      <h1>Cocheras</h1>
      <p className="subtitle">Estado y asignación de cocheras del edificio.</p>

      <div className="cards">
        <div className="card accent">
          <div className="card-head">
            <CheckCircleIcon size={18} />
          </div>
          <div className="num">{parking.libres}</div>
          <div className="lbl">Cocheras libres</div>
        </div>
      </div>

      <div className="panel">
        <h2>
          <CarIcon size={18} />
          Asignar cochera a un residente
        </h2>
        <AssignForm
          spots={spots.map((s) => ({ label: s.label }))}
          units={units.rows as { label: string }[]}
        />
      </div>

      <div className="panel">
        <h2>
          <CarIcon size={18} />
          Estado de cocheras
        </h2>
        <div className="grid-spots">
          {spots.map((s) => (
            <div
              className={`spot ${s.occupied ? "is-busy" : "is-free"}`}
              key={s.id}
            >
              <div className="name">{s.label}</div>
              <div className="kind">
                {s.kind === "residente"
                  ? `Residente ${s.unit_label ?? ""}`.trim()
                  : "Visita"}
              </div>
              {s.occupied ? (
                <span className="badge busy">
                  <CarIcon size={13} />
                  Ocupada
                </span>
              ) : (
                <span className="badge ok">
                  <CheckCircleIcon size={13} />
                  Libre
                </span>
              )}
              {s.occupied && <FreeButton spotLabel={s.label} />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
