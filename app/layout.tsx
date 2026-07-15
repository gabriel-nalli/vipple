import type { Metadata } from "next";
import { Poppins, Archivo } from "next/font/google";
import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";
import Header from "@/components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

/* Fallback grotesco para quando Neue Haas / Helvetica Neue não existir no sistema */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Vipple IA — Central de Comando",
  description:
    "Dashboard de visão total do agente de IA Vipple: atendimento, qualificação, funil, inteligência de mercado e vendas em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${archivo.variable}`}>
      <body>
        <BackgroundFX />
        <Header />
        <main className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pb-24 pt-[7.5rem] md:px-8 lg:px-12">
          {children}
        </main>
      </body>
    </html>
  );
}
