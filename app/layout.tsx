import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Conserje — gestión de accesos y cocheras",
  description: "Panel de portería y cocheras para edificios",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="topbar">
          <div className="brand">🏢 Conserje</div>
          <nav>
            <Link href="/">Dashboard</Link>
            <Link href="/porteria">Portería</Link>
            <Link href="/parking">Cocheras</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
