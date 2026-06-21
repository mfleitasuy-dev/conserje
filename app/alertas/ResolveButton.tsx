"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircleIcon } from "../icons";

export default function ResolveButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch(`/api/alerts/${id}/resolve`, { method: "POST" });
    setBusy(false);
    if (res.ok) router.refresh();
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
