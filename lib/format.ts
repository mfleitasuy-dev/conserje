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

// Formateadores del reloj del encabezado: se crean una sola vez (crear un
// Intl.DateTimeFormat es caro y estos se usan en cada tick del reloj).
const horaCortaFormatter = new Intl.DateTimeFormat("es-UY", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const fechaLargaFormatter = new Intl.DateTimeFormat("es-UY", {
  day: "numeric",
  month: "long",
});

/** Hora HH:mm en formato 24 h (es-UY), para el reloj del encabezado. */
export function horaCorta(d: Date): string {
  return horaCortaFormatter.format(d);
}

/** Fecha larga "9 de setiembre" (es-UY), para el reloj del encabezado. */
export function fechaLarga(d: Date): string {
  return fechaLargaFormatter.format(d);
}
