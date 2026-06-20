"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { label: string };

export default function AssignForm({
  spots,
  units,
}: {
  spots: Option[];
  units: Option[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = await fetch("/api/parking", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spot_label: String(data.get("spot_label") ?? ""),
        unidad: String(data.get("unidad") ?? ""),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "No se pudo asignar la cochera.");
      return;
    }
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div>
        <label htmlFor="spot_label">Cochera</label>
        <select id="spot_label" name="spot_label" required defaultValue="">
          <option value="" disabled>
            Elegir…
          </option>
          {spots.map((s) => (
            <option key={s.label} value={s.label}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="unidad">Asignar a unidad</label>
        <select id="unidad" name="unidad" required defaultValue="">
          <option value="" disabled>
            Elegir…
          </option>
          {units.map((u) => (
            <option key={u.label} value={u.label}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit" disabled={busy}>
          {busy ? "Asignando…" : "Asignar a residente"}
        </button>
      </div>
      {error && (
        <p className="error" style={{ gridColumn: "1 / -1" }}>
          {error}
        </p>
      )}
    </form>
  );
}
