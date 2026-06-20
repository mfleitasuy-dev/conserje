"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExitButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch(`/api/visits/${id}/exit`, { method: "POST" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button className="ghost" onClick={onClick} disabled={busy}>
      {busy ? "…" : "Marcar salida"}
    </button>
  );
}
