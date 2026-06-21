"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOutIcon } from "../icons";
import { useToast } from "../ui/Toast";

export default function ExitButton({ id }: { id: number }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch(`/api/visits/${id}/exit`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo marcar la salida",
        description: j.error,
      });
      return;
    }
    notify({ type: "ok", title: "Salida marcada" });
    router.refresh();
  }

  return (
    <button className="ghost" onClick={onClick} disabled={busy}>
      {busy ? (
        <span className="spinner" aria-hidden />
      ) : (
        <LogOutIcon size={14} />
      )}
      {busy ? "Saliendo…" : "Marcar salida"}
    </button>
  );
}
