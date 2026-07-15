"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/ui/kit";
import { AXIS, CHART, ChartLegend, GRID, VTooltip } from "@/components/charts/theme";
import { FUNNEL } from "@/lib/data";
import { fmtPct } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   Conversão etapa a etapa — taxa de passagem de cada transição,
   calculada diretamente do FUNNEL (nunca valores inventados).
   1 série vermelha · legenda + tooltip sempre.
   ══════════════════════════════════════════════════════════════ */

const SHORT: Record<string, string> = {
  engajaram: "Engajou",
  identificados: "Identif.",
  qualificados: "Qualif.",
  entregues: "Entrega",
  fechados: "Fechou",
};

const DATA = FUNNEL.slice(1).map((s, i) => ({
  label: SHORT[s.key] ?? s.label,
  taxa: Math.round((s.value / FUNNEL[i].value) * 100),
  transicao: `${FUNNEL[i].label} → ${s.label}`,
}));

const TRANS_BY_LABEL: Record<string, string> = Object.fromEntries(
  DATA.map((d): [string, string] => [d.label, d.transicao])
);

export default function StepConversionChart({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col gap-6 p-6 md:p-8 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker mb-2">Onde o funil aperta</p>
          <h3 className="display text-xl text-white md:text-[1.4rem]">
            Conversão <span className="text-vred">etapa a etapa</span>
          </h3>
        </div>
        <ChartLegend
          items={[{ label: "Taxa de passagem da etapa", color: CHART.red }]}
        />
      </div>

      <div
        className="h-[260px]"
        role="img"
        aria-label="Taxa de passagem por etapa do funil, de engajamento a fechamento"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            accessibilityLayer
            data={DATA}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid {...GRID} />
            <XAxis {...AXIS} dataKey="label" />
            <YAxis
              {...AXIS}
              width={34}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              content={
                <VTooltip
                  formatter={(v) => fmtPct(Number(v))}
                  labelFormatter={(l) => TRANS_BY_LABEL[String(l)] ?? l}
                />
              }
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar
              name="Taxa de passagem"
              dataKey="taxa"
              fill={CHART.red}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-auto border-t border-white/[0.06] pt-4 text-[0.7rem] font-light leading-relaxed text-ink-mute">
        Os degraus de{" "}
        <span className="num font-medium text-ink-dim">
          {fmtPct(DATA[2].taxa)}
        </span>{" "}
        (qualificação) e{" "}
        <span className="num font-medium text-ink-dim">
          {fmtPct(DATA[4].taxa)}
        </span>{" "}
        (fechamento) são decisões — o filtro da Vitória e a negociação do time. A
        entrega ao vendedor quase não perde ninguém:{" "}
        <span className="num font-medium text-ink-dim">
          {fmtPct(DATA[3].taxa)}
        </span>
        .
      </p>
    </Panel>
  );
}
