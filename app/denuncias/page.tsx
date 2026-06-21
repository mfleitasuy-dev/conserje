import { getDb } from "@/lib/db";
import { listComplaints } from "@/lib/complaints";
import { fechaHora } from "@/lib/format";
import { FlagIcon, InboxIcon } from "../icons";
import ComplaintForm from "./ComplaintForm";

export const dynamic = "force-dynamic";

export default async function Denuncias() {
  const db = getDb();
  const [complaints, units] = await Promise.all([
    listComplaints(db),
    db.query("SELECT label FROM units ORDER BY label"),
  ]);

  return (
    <>
      <h1>Denuncias</h1>
      <p className="subtitle">Reclamos reportados por los residentes.</p>

      <div className="panel">
        <h2>
          <FlagIcon size={18} />
          Registrar denuncia
        </h2>
        <ComplaintForm units={units.rows as { label: string }[]} />
      </div>

      <div className="panel">
        <h2>
          <FlagIcon size={18} />
          Registradas
        </h2>
        {complaints.length === 0 ? (
          <div className="empty">
            <InboxIcon size={32} />
            <p>Todavía no hay denuncias registradas.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Unidad</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Registrada</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.unit_label}</td>
                    <td>
                      <span className="badge neutral">{c.category}</span>
                    </td>
                    <td>{c.description}</td>
                    <td>{fechaHora(c.created_at)}</td>
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
