"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CLIENT } from "@/lib/data";

const TABS = [
  { href: "/visao-geral", label: "Visão Geral" },
  { href: "/ao-vivo", label: "Ao Vivo", live: true },
  { href: "/funil", label: "Funil" },
  { href: "/inteligencia", label: "Inteligência" },
];

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="num hidden text-xs font-medium tracking-widest text-ink-dim lg:block">
      {now ?? "--:--:--"}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/65 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1480px] items-center gap-6 px-5 md:px-8 lg:px-12">
        {/* Logo Vipple */}
        <Link href="/visao-geral" className="flex shrink-0 items-end gap-[3px]">
          <img
            src="/vipple-logo.png"
            alt="Vipple"
            className="h-8 w-auto translate-y-[2px]"
            style={{ filter: "drop-shadow(0 0 14px rgba(255,23,23,0.5))" }}
          />
          <span className="flex flex-col leading-none">
            <span className="display text-[1.55rem] font-medium lowercase tracking-tight text-white">
              ipple
            </span>
            <span className="self-end text-[0.42rem] font-medium uppercase tracking-[0.5em] text-ink-mute">
              digital
            </span>
          </span>
        </Link>

        <span className="hidden h-7 w-px bg-white/10 md:block" />
        <span className="kicker hidden whitespace-nowrap !text-[0.55rem] md:block">
          Central de Comando · IA
        </span>

        {/* Navegação — estilo da apresentação */}
        <div className="relative mx-auto min-w-0">
          {/* Fade nas bordas: indica scroll horizontal apenas no mobile */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black to-transparent lg:hidden"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black to-transparent lg:hidden"
          />
          <nav
            aria-label="Navegação principal"
            className="no-scrollbar flex items-center gap-1 overflow-x-auto lg:gap-2"
          >
            {TABS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 lg:px-4 lg:py-2 ${
                    active
                      ? "text-vred"
                      : "text-ink-dim hover:text-white"
                  }`}
                >
                  {tab.live && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vred opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-vred" />
                    </span>
                  )}
                  {tab.label}
                  <span
                    className={`absolute inset-x-3 -bottom-[calc(1.05rem)] h-px transition-all duration-300 ${
                      active
                        ? "bg-vred shadow-[0_0_12px_rgba(255,23,23,0.9)]"
                        : "bg-transparent"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cliente + relógio */}
        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-xs font-medium text-white">{CLIENT.name}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-ink-mute">
              {CLIENT.segment}
            </span>
          </div>
          <span className="h-7 w-px bg-white/10" />
          <Clock />
        </div>
      </div>
    </header>
  );
}
