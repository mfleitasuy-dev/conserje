"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { label: string };

export default function VisitForm({
  units,
  visitorSpots,
}: {
  units: Option[];
  visitorSpots: Option[];
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
    const body: Record<string, string> = {
      visitor_name: String(data.get("visitor_name") ?? ""),
      visitor_doc: String(data.get("visitor_doc") ?? ""),
      unidad: String(data.get("unidad") ?? ""),
    };
    const plate = String(data.get("plate") ?? "").trim();
    const cochera = String(data.get("cochera_visita") ?? "").trim();
    if (plate) body.plate = plate;
    if (cochera) body.cochera_visita = cochera;

    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "No se pudo registrar la visita.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div>
        <label htmlFor="visitor_name">Visitante</label>
        <input id="visitor_name" name="visitor_name" required />
      </div>
      <div>
        <label htmlFor="visitor_doc">Documento</label>
        <input id="visitor_doc" name="visitor_doc" required />
      </div>
      <div>
        <label htmlFor="unidad">Unidad</label>
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
        <label htmlFor="plate">Patente (opcional)</label>
        <input id="plate" name="plate" placeholder="ABC1234" />
      </div>
      <div>
        <label htmlFor="cochera_visita">Cochera de visita (opcional)</label>
        <select id="cochera_visita" name="cochera_visita" defaultValue="">
          <option value="">Sin cochera</option>
          {visitorSpots.map((s) => (
            <option key={s.label} value={s.label}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit" disabled={busy}>
          {busy && <span className="spinner" aria-hidden />}
          {busy ? "Registrando…" : "Registrar ingreso"}
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
