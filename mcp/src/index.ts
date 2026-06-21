// MCP server propio de Conserje ("consorcio-mcp").
// Expone como tools la misma lógica de dominio que usa la web (lib/), conectada
// a la misma base Postgres. Transporte stdio.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getDb } from "../../lib/db";
import { registerVisit, listVisitsToday, registerExit } from "../../lib/visits";
import {
  listSpots,
  parkingSummary,
  assignResidentSpot,
} from "../../lib/parking";
import { DomainError } from "../../lib/errors";

// Fallback para correr la demo sin tener que exportar la variable a mano.
process.env.DATABASE_URL ||=
  "postgresql://conserje:conserje@localhost:5432/conserje";

const server = new McpServer({ name: "consorcio-mcp", version: "1.0.0" });

/** Envuelve un handler: serializa el resultado y mapea DomainError a isError. */
function ok(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
function fail(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}

server.registerTool(
  "registrar_visita",
  {
    description:
      "Registra el ingreso de una visita al edificio. Requiere nombre, documento y la unidad (apto) que visita. Opcionalmente patente del vehículo y una cochera de visita libre (ej. V-01), que queda ocupada hasta marcar la salida.",
    inputSchema: {
      visitor_name: z.string().describe("Nombre del visitante"),
      visitor_doc: z.string().describe("Documento del visitante"),
      unidad: z.string().describe("Etiqueta de la unidad visitada, ej. 4B"),
      plate: z.string().optional().describe("Patente del vehículo (opcional)"),
      cochera_visita: z
        .string()
        .optional()
        .describe("Etiqueta de cochera de visita, ej. V-01 (opcional)"),
    },
  },
  async (args) => {
    try {
      return ok(await registerVisit(getDb(), args));
    } catch (e) {
      return fail(e instanceof DomainError ? e.message : String(e));
    }
  },
);

server.registerTool(
  "listar_visitas_hoy",
  {
    description:
      "Lista las visitas registradas hoy (activas y con salida), de la más reciente a la más antigua.",
    inputSchema: {},
  },
  async () => {
    try {
      return ok(await listVisitsToday(getDb()));
    } catch (e) {
      return fail(String(e));
    }
  },
);

server.registerTool(
  "registrar_salida",
  {
    description:
      "Marca la salida de una visita activa por su id. Libera automáticamente la cochera de visita si tenía una asignada.",
    inputSchema: {
      visit_id: z.number().int().describe("Id de la visita a cerrar"),
    },
  },
  async ({ visit_id }) => {
    try {
      return ok(await registerExit(getDb(), visit_id));
    } catch (e) {
      return fail(e instanceof DomainError ? e.message : String(e));
    }
  },
);

server.registerTool(
  "estado_parking",
  {
    description:
      "Devuelve el estado de todas las cocheras (libre/ocupada, tipo y unidad asignada) y un resumen de ocupación.",
    inputSchema: {},
  },
  async () => {
    try {
      const db = getDb();
      const [spots, summary] = await Promise.all([
        listSpots(db),
        parkingSummary(db),
      ]);
      return ok({ summary, spots });
    } catch (e) {
      return fail(String(e));
    }
  },
);

server.registerTool(
  "asignar_cochera",
  {
    description:
      "Asigna una cochera a un residente: marca la cochera como tipo 'residente' y la vincula a una unidad.",
    inputSchema: {
      spot_label: z.string().describe("Etiqueta de la cochera, ej. R-01"),
      unidad: z.string().describe("Etiqueta de la unidad, ej. 2B"),
    },
  },
  async ({ spot_label, unidad }) => {
    try {
      return ok(await assignResidentSpot(getDb(), spot_label, unidad));
    } catch (e) {
      return fail(e instanceof DomainError ? e.message : String(e));
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
