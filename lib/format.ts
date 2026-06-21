/** Formatea una marca de tiempo a HH:MM (es-UY). */
export function hora(value: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Formatea una marca de tiempo a DD/MM HH:MM (es-UY). */
export function fechaHora(value: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
