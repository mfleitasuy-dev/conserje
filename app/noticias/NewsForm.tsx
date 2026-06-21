"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/Toast";

export default function NewsForm() {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      title: String(data.get("title") ?? ""),
      body: String(data.get("body") ?? ""),
    };

    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo publicar la noticia",
        description: j.error,
      });
      return;
    }
    notify({ type: "ok", title: "Noticia publicada" });
    form.reset();
    router.refresh();
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div style={{ gridColumn: "1 / -1" }}>
        <label htmlFor="title">Título</label>
        <input id="title" name="title" required />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <label htmlFor="body">Cuerpo</label>
        <input
          id="body"
          name="body"
          required
          placeholder="Detalle de la noticia"
        />
      </div>
      <div>
        <button type="submit" disabled={busy}>
          {busy && <span className="spinner" aria-hidden />}
          {busy ? "Publicando…" : "Publicar noticia"}
        </button>
      </div>
    </form>
  );
}
