"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AXIS,
  CHART,
  CHART_DEFS,
  ChartLegend,
  GRID,
  VTooltip,
} from "@/components/charts/theme";
import { DAILY } from "@/lib/data";
import { Panel, SectionHeader } from "@/components/ui/kit";

export default function AttendanceRoi() {
  return (
    <section>
      {/* ── Gráfico principal: contatos × qualificados, 30 dias ── */}
      <Panel beam className="p-6 md:p-7">
        <SectionHeader
          kicker="Volume · 30 dias"
          title="Atendimento"
          accent="diário"
          right={
            <ChartLegend
              items={[
                { label: "Contatos", color: CHART.white },
                { label: "Qualificados", color: CHART.red },
              ]}
            />
          }
          className="mb-6"
        />
        <div
          className="h-[300px]"
          role="img"
          aria-label="Contatos e leads qualificados por dia nos últimos 30 dias"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              accessibilityLayer
              data={DAILY}
              margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
            >
              {CHART_DEFS}
              <CartesianGrid {...GRID} />
              <XAxis
                {...AXIS}
                dataKey="d"
                minTickGap={28}
                interval="preserveStartEnd"
              />
              <YAxis {...AXIS} width={34} />
              <Tooltip
                content={<VTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.16)", strokeDasharray: "3 4" }}
              />
              <Area
                type="monotone"
                dataKey="contatos"
                name="Contatos"
                stroke={CHART.white}
                strokeWidth={2}
                fill="url(#vwhiteFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="qualificados"
                name="Qualificados"
                stroke={CHART.red}
                strokeWidth={2}
                fill="url(#vredFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </section>
  );
}
