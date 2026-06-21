"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/Toast";

export default function AlertForm() {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      message: String(data.get("message") ?? ""),
      severity: String(data.get("severity") ?? "media"),
    };

    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo crear la alerta",
        description: j.error,
      });
      return;
    }
    notify({ type: "ok", title: "Alerta creada" });
    form.reset();
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div style={{ gridColumn: "1 / -1" }}>
        <label htmlFor="message">Mensaje</label>
        <input id="message" name="message" required />
      </div>
      <div>
        <label htmlFor="severity">Severidad</label>
        <select id="severity" name="severity" defaultValue="media">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      <div>
        <button type="submit" disabled={busy}>
          {busy && <span className="spinner" aria-hidden />}
          {busy ? "Creando…" : "Crear alerta"}
        </button>
      </div>
    </form>
  );
}
