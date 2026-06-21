"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/Toast";

type Option = { label: string };

export default function AssignForm({
  spots,
  units,
}: {
  spots: Option[];
  units: Option[];
}) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const spotLabel = String(data.get("spot_label") ?? "");
    const unidad = String(data.get("unidad") ?? "");
    const res = await fetch("/api/parking", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spot_label: spotLabel,
        unidad,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo asignar la cochera",
        description: j.error,
      });
      return;
    }
    notify({
      type: "ok",
      title: "Cochera asignada",
      description: `${spotLabel} · Unidad ${unidad}`,
    });
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
          {busy && <span className="spinner" aria-hidden />}
          {busy ? "Asignando…" : "Asignar a residente"}
        </button>
      </div>
    </form>
  );
}
