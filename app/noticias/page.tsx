import { getDb } from "@/lib/db";
import { listNews } from "@/lib/news";
import { fechaHora } from "@/lib/format";
import { NewspaperIcon, InboxIcon } from "../icons";
import NewsForm from "./NewsForm";

export const dynamic = "force-dynamic";

export default async function Noticias() {
  const news = await listNews(getDb());

  return (
    <>
      <h1>Noticias</h1>
      <p className="subtitle">Avisos del consorcio para los residentes.</p>

      <div className="panel">
        <h2>
          <NewspaperIcon size={18} />
          Publicar noticia
        </h2>
        <NewsForm />
      </div>

      <div className="panel">
        <h2>
          <NewspaperIcon size={18} />
          Publicadas
        </h2>
        {news.length === 0 ? (
          <div className="empty">
            <InboxIcon size={32} />
            <p>Todavía no hay noticias publicadas.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Detalle</th>
                  <th>Publicada</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id}>
                    <td>{n.title}</td>
                    <td>{n.body}</td>
                    <td>{fechaHora(n.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
