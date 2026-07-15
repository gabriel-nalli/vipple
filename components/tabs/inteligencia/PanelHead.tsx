"use client";

import type { ReactNode } from "react";

/* Cabeçalho interno de painel — kicker + título display com
   a palavra-chave em vermelho passada inline via children. */
export function PanelHead({
  kicker,
  children,
  right,
  className = "",
}: {
  kicker: string;
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-3 ${className}`}
    >
      <div>
        <p className="kicker mb-2 !text-[0.56rem]">{kicker}</p>
        <h3 className="display text-lg text-white md:text-[1.35rem]">
          {children}
        </h3>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* Caixa de insight — leitura acionável extraída dos dados. */
export function Insight({
  icon,
  children,
  tone = "red",
  className = "",
}: {
  icon: ReactNode;
  children: ReactNode;
  tone?: "red" | "amber";
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${
        tone === "amber"
          ? "border-warn/20 bg-warn/5"
          : "border-vred/20 bg-vred/5"
      } ${className}`}
    >
      <span
        className={`mt-0.5 shrink-0 ${
          tone === "amber" ? "text-warn" : "text-vred"
        }`}
      >
        {icon}
      </span>
      <p className="text-[0.74rem] font-light leading-relaxed text-ink-dim">
        {children}
      </p>
    </div>
  );
}
