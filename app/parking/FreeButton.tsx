"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { XIcon } from "../icons";
import { useToast } from "../ui/Toast";

export default function FreeButton({ spotLabel }: { spotLabel: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch("/api/parking", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spot_label: spotLabel }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo liberar la cochera",
        description: j.error,
      });
      return;
    }
    notify({ type: "ok", title: "Cochera liberada", description: spotLabel });
    router.refresh();
  }

  return (
    <button className="ghost" onClick={onClick} disabled={busy}>
      {busy ? <span className="spinner" aria-hidden /> : <XIcon size={14} />}
      {busy ? "Liberando…" : "Liberar"}
    </button>
  );
}
