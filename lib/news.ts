import type { DB } from "./db";
import { newsInput, type NewsInput } from "./schemas";

export type News = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

const NEWS_SELECT = `
  SELECT id, title, body, created_at
  FROM news`;

export async function getNews(db: DB, id: number): Promise<News | null> {
  const { rows } = await db.query(`${NEWS_SELECT} WHERE id = $1`, [id]);
  return (rows[0] as News) ?? null;
}

export async function createNews(db: DB, input: NewsInput): Promise<News> {
  const data = newsInput.parse(input);
  const { rows } = await db.query(
    "INSERT INTO news (title, body) VALUES ($1, $2) RETURNING id",
    [data.title, data.body],
  );
  return (await getNews(db, rows[0].id as number))!;
}

export async function listNews(db: DB): Promise<News[]> {
  const { rows } = await db.query(`${NEWS_SELECT} ORDER BY created_at DESC`);
  return rows as News[];
}
