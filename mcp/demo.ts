// Demo guiada del MCP propio de Conserje (consorcio-mcp).
// Simula a un agente operando el edificio por el protocolo MCP (stdio):
// lista las tools, registra una visita, consulta el parking, marca la salida.
//
// Correr con:  npx tsx mcp/demo.ts

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const DB = "postgresql://conserje:conserje@localhost:5432/conserje";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Colores ANSI para que la demo se lea bien en pantalla.
const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

function textOf(res: { content: unknown }): string {
  const arr = res.content as { type: string; text: string }[];
  return arr.map((p) => p.text).join("\n");
}

async function step(title: string) {
  console.log("\n" + c.bold(c.cyan("▶ " + title)));
  await sleep(900);
}

async function main() {
  console.log(c.bold("\n🏢 Conserje — demo del MCP propio (consorcio-mcp)\n"));
  console.log(
    c.dim(
      "Un agente se conecta por stdio y opera el edificio con las mismas reglas que la web.\n",
    ),
  );

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "mcp/src/index.ts"],
    env: { ...process.env, DATABASE_URL: DB } as Record<string, string>,
  });
  const client = new Client({ name: "demo", version: "1.0.0" });
  await client.connect(transport);

  await step("Herramientas que expone el servidor");
  const { tools } = await client.listTools();
  for (const t of tools) {
    console.log("  " + c.green("•") + " " + c.bold(t.name));
    console.log("    " + c.dim(t.description?.split(". ")[0] ?? ""));
  }

  await step("estado_parking — situación inicial");
  const before = await client.callTool({ name: "estado_parking", arguments: {} });
  console.log(c.dim(JSON.parse(textOf(before)).summary && JSON.stringify(JSON.parse(textOf(before)).summary)));

  await step("registrar_visita — llega Carla Núñez al 2A, en auto");
  const visita = await client.callTool({
    name: "registrar_visita",
    arguments: {
      visitor_name: "Carla Núñez",
      visitor_doc: "5.987.654-3",
      unidad: "2A",
      plate: "SAB 7788",
      cochera_visita: "V-02",
    },
  });
  const creada = JSON.parse(textOf(visita));
  console.log(c.green("  ✓ visita #" + creada.id + " registrada · cochera " + creada.spot_label));

  await step("estado_parking — V-02 ahora figura ocupada");
  const mid = await client.callTool({ name: "estado_parking", arguments: {} });
  console.log(c.yellow("  " + JSON.stringify(JSON.parse(textOf(mid)).summary)));

  await step("listar_visitas_hoy");
  const list = await client.callTool({ name: "listar_visitas_hoy", arguments: {} });
  for (const v of JSON.parse(textOf(list))) {
    console.log("  - " + v.visitor_name + " · " + v.unit_label + " · cochera " + (v.spot_label ?? "—"));
  }

  await step("registrar_salida — Carla se retira (libera la cochera)");
  const salida = await client.callTool({
    name: "registrar_salida",
    arguments: { visit_id: creada.id },
  });
  console.log(c.green("  ✓ salida marcada a las " + JSON.parse(textOf(salida)).exited_at));

  await step("estado_parking — V-02 vuelve a estar libre");
  const after = await client.callTool({ name: "estado_parking", arguments: {} });
  console.log(c.green("  " + JSON.stringify(JSON.parse(textOf(after)).summary)));

  console.log(c.bold(c.green("\n✅ El agente operó el edificio por MCP — los mismos datos que ve la web.\n")));
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
