import { z } from "zod";

/** Datos para registrar una visita en portería. */
export const visitInput = z.object({
  visitor_name: z.string().trim().min(1, "nombre requerido"),
  visitor_doc: z.string().trim().min(1, "documento requerido"),
  unidad: z.string().trim().min(1, "unidad requerida"),
  plate: z.string().trim().min(1).optional(),
  cochera_visita: z.string().trim().min(1).optional(),
});
export type VisitInput = z.infer<typeof visitInput>;

/** Datos para asignar una cochera de residente a una unidad. */
export const assignSpotInput = z.object({
  spot_label: z.string().trim().min(1),
  unidad: z.string().trim().min(1),
});
export type AssignSpotInput = z.infer<typeof assignSpotInput>;

/** Datos para publicar una noticia del consorcio. */
export const newsInput = z.object({
  title: z.string().trim().min(1, "título requerido"),
  body: z.string().trim().min(1, "cuerpo requerido"),
});
export type NewsInput = z.infer<typeof newsInput>;

/** Datos para crear una alerta de seguridad. */
export const alertInput = z.object({
  message: z.string().trim().min(1, "mensaje requerido"),
  severity: z.enum(["baja", "media", "alta"]).default("media"),
});
// Usamos el tipo de entrada porque `severity` tiene default (es opcional al crear).
export type AlertInput = z.input<typeof alertInput>;

/** Datos para registrar una denuncia de un residente. */
export const complaintInput = z.object({
  unidad: z.string().trim().min(1, "unidad requerida"),
  category: z.string().trim().min(1, "categoría requerida"),
  description: z.string().trim().min(1, "descripción requerida"),
});
export type ComplaintInput = z.infer<typeof complaintInput>;
