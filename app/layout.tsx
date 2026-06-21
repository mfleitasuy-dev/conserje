import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fira_Sans, Fira_Code } from "next/font/google";
import { BuildingIcon } from "./icons";
import { ToastProvider } from "./ui/Toast";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata = {
  title: "Conserje — gestión de accesos y cocheras",
  description: "Panel de portería y cocheras para edificios",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${firaSans.variable} ${firaCode.variable}`}>
      <body>
        <ToastProvider>
          <header className="topbar">
            <div className="brand">
              <BuildingIcon size={22} />
              Conserje
            </div>
            <nav>
              <Link href="/">Dashboard</Link>
              <Link href="/porteria">Portería</Link>
              <Link href="/parking">Cocheras</Link>
              <Link href="/noticias">Noticias</Link>
              <Link href="/alertas">Alertas</Link>
              <Link href="/denuncias">Denuncias</Link>
            </nav>
          </header>
          <main className="container">{children}</main>
          <footer className="footer">
            <div className="footer-inner">
              <div className="brand">
                <BuildingIcon size={18} />
                Conserje
              </div>
              <span className="footer-copy">© 2026 Conserje</span>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
