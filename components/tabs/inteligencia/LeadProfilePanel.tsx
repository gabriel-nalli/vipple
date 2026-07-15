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
import { Panel, RankRow } from "@/components/ui/kit";
import {
  AXIS,
  CHART,
  ChartLegend,
  GRID,
  VTooltip,
} from "@/components/charts/theme";
import { AGE_PROFILE, REGIONS } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { PanelHead } from "./PanelHead";

const REGION_MAX = Math.max(...REGIONS.map((r) => r.pct));
const CORE_AGE_PCT = AGE_PROFILE[1].pct + AGE_PROFILE[2].pct; // 25–44 = 58
const CORE_REGION_PCT = REGIONS[0].pct + REGIONS[1].pct + REGIONS[2].pct; // 59

export default function LeadProfilePanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col p-6 md:p-7 ${className}`}>
      <PanelHead kicker="Perfil demográfico">
        Quem é seu <span className="text-vred">lead</span>
      </PanelHead>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Faixa etária — 1 série vermelha */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="kicker !text-[0.52rem]">Faixa etária</p>
            <ChartLegend items={[{ label: "% dos leads", color: CHART.red }]} />
          </div>
          <div
            className="h-[210px]"
            role="img"
            aria-label="Percentual de leads por faixa etária"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={AGE_PROFILE}
                margin={{ top: 6, right: 4, left: 0, bottom: 0 }}
              >
                <CartesianGrid {...GRID} />
                <XAxis {...AXIS} dataKey="label" />
                <YAxis
                  {...AXIS}
                  width={34}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  content={<VTooltip formatter={(v) => fmtPct(Number(v))} />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="pct"
                  name="% dos leads"
                  fill={CHART.red}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Região — barras rotuladas compactas */}
        <div>
          <p className="kicker mb-3 !text-[0.52rem]">Região · São Paulo</p>
          <div className="space-y-4">
            {REGIONS.map((r, i) => (
              <RankRow
                key={r.label}
                label={r.label}
                value={fmtPct(r.pct)}
                pct={(r.pct / REGION_MAX) * 100}
                delay={i * 80}
                color={r.label === "Outras regiões" ? CHART.gray : CHART.red}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-7">
        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-[0.72rem] font-light leading-relaxed text-ink-dim">
            O núcleo do público:{" "}
            <span className="num font-medium text-white">
              {fmtPct(CORE_AGE_PCT)}
            </span>{" "}
            têm entre 25 e 44 anos e{" "}
            <span className="num font-medium text-white">
              {fmtPct(CORE_REGION_PCT)}
            </span>{" "}
            vêm de Moema, Vila Mariana e Itaim — decisores premium no entorno
            da clínica.
          </p>
        </div>
      </div>
    </Panel>
  );
}
