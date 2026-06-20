/** Formatea una marca de tiempo a HH:MM (es-UY). */
export function hora(value: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
