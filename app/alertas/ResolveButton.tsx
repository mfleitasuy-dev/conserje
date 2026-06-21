"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircleIcon } from "../icons";
import { useToast } from "../ui/Toast";

export default function ResolveButton({ id }: { id: number }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch(`/api/alerts/${id}/resolve`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      notify({
        type: "error",
        title: "No se pudo resolver la alerta",
        description: j.error,
      });
      return;
    }
    notify({ type: "ok", title: "Alerta resuelta" });
    router.refresh();
  }

  return (
    <button className="ghost" onClick={onClick} disabled={busy}>
      {busy ? (
        <span className="spinner" aria-hidden />
      ) : (
        <CheckCircleIcon size={14} />
      )}
      {busy ? "Resolviendo…" : "Resolver"}
    </button>
  );
}
