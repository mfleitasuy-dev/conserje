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
