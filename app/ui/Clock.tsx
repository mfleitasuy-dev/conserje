"use client";

import { useEffect, useState } from "react";
import { horaCorta, fechaLarga } from "@/lib/format";
import { ClockIcon } from "../icons";

/**
 * Reloj del encabezado: hora y fecha actuales, actualizadas cada minuto.
 * Arranca en `null` y muestra "—" en el servidor y en el primer render del
 * cliente; la hora recién se lee dentro del efecto, así el HTML del servidor
 * y el del cliente coinciden y no hay mismatch de hidratación (UN3).
 */
export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="clock" aria-live="off">
      <ClockIcon size={16} />
      <span className="clock-time">{now ? horaCorta(now) : "—"}</span>
      <span className="clock-date">{now ? fechaLarga(now) : "—"}</span>
    </div>
  );
}
