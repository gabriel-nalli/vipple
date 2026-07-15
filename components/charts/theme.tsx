"use client";

import type { ReactNode } from "react";

/* ══════════════════════════════════════════════════════════════
   Tema de gráficos Vipple (recharts)
   Regras (validadas com o validador de paleta):
   · máx. 2 séries por gráfico: VERMELHO × BRANCO, sempre com
     legenda + rótulos/marcadores (encoding secundário)
   · 3+ categorias → RankRow (barras rotuladas em vermelho único)
   · sequencial (heatmap) → rampa de vermelho, luminosidade monotônica
   · verde APENAS para dinheiro/positivo · âmbar para alerta
   · nunca dual-axis · texto sempre em tons de tinta, não na cor da série
   ══════════════════════════════════════════════════════════════ */

export const CHART = {
  red: "#FF1717",
  redSoft: "#FF5C47",
  white: "#F5F5F5",
  gray: "#8A8A8A",
  money: "#2FBF71",
  warn: "#FFB224",
  grid: "rgba(255,255,255,0.055)",
  axis: "#6E6E6E",
  /* rampa sequencial — luminosidade estritamente crescente */
  seq: ["#1C0606", "#4A0C0C", "#7A1010", "#AB1313", "#D91515", "#FF1717", "#FF7A5C"],
} as const;

/** Cor sequencial para intensidade 0–100 (heatmap) */
export function seqColor(v: number): string {
  const idx = Math.min(
    CHART.seq.length - 1,
    Math.floor((v / 100) * CHART.seq.length)
  );
  return CHART.seq[idx];
}

/* Props padrão de eixos — discretos, Poppins, sem linhas duras */
export const AXIS = {
  tickLine: false,
  axisLine: false,
  tick: { fill: CHART.axis, fontSize: 10.5, fontFamily: "var(--font-poppins)" },
} as const;

export const GRID = {
  stroke: CHART.grid,
  strokeDasharray: "3 6",
  vertical: false,
} as const;

/* Gradientes reutilizáveis — elemento <defs> pronto para o recharts.
   IMPORTANTE: passe {CHART_DEFS} (não <ChartDefs />) dentro do chart.
   O recharts v2 descarta filhos que não sejam tags SVG string, então um
   function component nunca renderiza os <linearGradient> no SVG. */
export const CHART_DEFS = (
  <defs>
    <linearGradient id="vredFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FF1717" stopOpacity={0.32} />
      <stop offset="100%" stopColor="#FF1717" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="vwhiteFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F5F5F5" stopOpacity={0.18} />
      <stop offset="100%" stopColor="#F5F5F5" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="vmoneyFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2FBF71" stopOpacity={0.3} />
      <stop offset="100%" stopColor="#2FBF71" stopOpacity={0} />
    </linearGradient>
  </defs>
);

/* Mantido para não quebrar imports antigos — prefira {CHART_DEFS}. */
export function ChartDefs() {
  return CHART_DEFS;
}

/* ── Tooltip customizado (painel escuro da identidade) ──────── */

type TooltipRow = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

export function VTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
  formatter?: (value: number | string, name?: string) => ReactNode;
  labelFormatter?: (label: string | number) => ReactNode;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[150px] rounded-xl border border-white/10 bg-[#0c0c0c]/95 px-3.5 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-md">
      {label !== undefined && (
        <p className="kicker mb-2 !text-[0.52rem]">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[0.7rem] font-light text-ink-dim">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: row.color ?? CHART.red }}
              />
              {row.name}
            </span>
            <span className="num text-[0.75rem] font-medium text-white">
              {formatter
                ? formatter(row.value ?? "", row.name)
                : typeof row.value === "number"
                ? row.value.toLocaleString("pt-BR")
                : row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Legenda manual padrão (usar sempre que houver 2 séries) */
export function ChartLegend({
  items,
}: {
  items: { label: string; color: string; dashed?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {items.map((it) => (
        <span
          key={it.label}
          className="flex items-center gap-1.5 text-[0.68rem] font-light text-ink-dim"
        >
          <span
            className="inline-block h-[3px] w-4 rounded-full"
            style={{
              background: it.dashed
                ? `repeating-linear-gradient(90deg, ${it.color} 0 4px, transparent 4px 7px)`
                : it.color,
            }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
