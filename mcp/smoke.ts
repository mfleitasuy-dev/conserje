// Smoke test del MCP: levanta el server por stdio, lista las tools y ejecuta
// algunas. Se corre con `npx tsx mcp/smoke.ts`.

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "mcp/src/index.ts"],
  env: {
    ...process.env,
    DATABASE_URL: "postgresql://conserje:conserje@localhost:5432/conserje",
  } as Record<string, string>,
});

const client = new Client({ name: "smoke", version: "1.0.0" });
await client.connect(transport);

const tools = await client.listTools();
console.log(
  "TOOLS:",
  tools.tools.map((t) => t.name).join(", "),
);

const visita = await client.callTool({
  name: "registrar_visita",
  arguments: {
    visitor_name: "Smoke Test",
    visitor_doc: "0000",
    unidad: "4B",
    cochera_visita: "V-02",
  },
});
console.log("registrar_visita:", JSON.stringify(visita.content));

const parking = await client.callTool({
  name: "estado_parking",
  arguments: {},
});
const parsed = JSON.parse((parking.content as { text: string }[])[0].text);
console.log("estado_parking.summary:", JSON.stringify(parsed.summary));

await client.close();
