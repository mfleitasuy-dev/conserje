import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb } from "./helpers/db";
import { createNews, listNews, getNews } from "@/lib/news";
import type { DB } from "@/lib/db";

let db: DB;
beforeEach(() => {
  db = makeTestDb();
});

describe("createNews", () => {
  it("publica una noticia", async () => {
    const n = await createNews(db, {
      title: "Pintura del palier",
      body: "Se pintará el palier el lunes.",
    });
    expect(n.id).toBeGreaterThan(0);
    expect(n.title).toBe("Pintura del palier");
    expect(n.created_at).not.toBeNull();
  });

  it("falla si el título está vacío", async () => {
    await expect(
      createNews(db, { title: "  ", body: "algo" }),
    ).rejects.toThrow();
  });

  it("falla si el cuerpo está vacío", async () => {
    await expect(createNews(db, { title: "algo", body: "" })).rejects.toThrow();
  });
});

describe("listNews", () => {
  it("lista las noticias, la más nueva primero", async () => {
    const vieja = await createNews(db, { title: "Vieja", body: "x" });
    await db.query(
      "UPDATE news SET created_at = now() - interval '1 hour' WHERE id = $1",
      [vieja.id],
    );
    await createNews(db, { title: "Nueva", body: "y" });
    const list = await listNews(db);
    expect(list).toHaveLength(2 + 2); // 2 del seed + 2 creadas
    expect(list[0].title).toBe("Nueva");
  });
});

describe("getNews", () => {
  it("devuelve null si la noticia no existe", async () => {
    expect(await getNews(db, 9999)).toBeNull();
  });
});
