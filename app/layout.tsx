import "./globals.css";
import type { ReactNode } from "react";
import { Fira_Sans, Fira_Code } from "next/font/google";
import { BuildingIcon } from "./icons";
import { ToastProvider } from "./ui/Toast";
import Clock from "./ui/Clock";
import NavLink from "./ui/NavLink";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/porteria">Portería</NavLink>
              <NavLink href="/parking">Cocheras</NavLink>
              <NavLink href="/noticias">Noticias</NavLink>
              <NavLink href="/alertas">Alertas</NavLink>
              <NavLink href="/denuncias">Denuncias</NavLink>
            </nav>
          </header>
          <main className="container">
            <div className="page-head">
              <Clock />
            </div>
            {children}
          </main>
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
