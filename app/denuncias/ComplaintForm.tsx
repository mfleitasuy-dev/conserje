"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/Toast";

type Option = { label: string };

export default function ComplaintForm({ units }: { units: Option[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      unidad: String(data.get("unidad") ?? ""),
      category: String(data.get("category") ?? ""),
      description: String(data.get("description") ?? ""),
    };

    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo registrar la denuncia",
        description: j.error,
      });
      return;
    }
    notify({ type: "ok", title: "Denuncia registrada" });
    form.reset();
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
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
        <label htmlFor="category">Categoría</label>
        <input
          id="category"
          name="category"
          required
          placeholder="ruidos, limpieza…"
        />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <label htmlFor="description">Descripción</label>
        <input id="description" name="description" required />
      </div>
      <div>
        <button type="submit" disabled={busy}>
          {busy && <span className="spinner" aria-hidden />}
          {busy ? "Registrando…" : "Registrar denuncia"}
        </button>
      </div>
    </form>
  );
}
