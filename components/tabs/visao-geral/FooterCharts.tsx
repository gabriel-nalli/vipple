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
import {
  AXIS,
  CHART,
  ChartLegend,
  GRID,
  VTooltip,
} from "@/components/charts/theme";
import { CLIENT, WEEKLY_QUALIFIED } from "@/lib/data";
import { Panel, SectionHeader } from "@/components/ui/kit";

export default function FooterCharts() {
  return (
    <section>
      {/* ── Qualificados por semana: antes × com a Vitória ─────────── */}
      <Panel className="p-6 md:p-7">
        <SectionHeader
          kicker="Ritmo de qualificação"
          title="Qualificados"
          accent="por semana"
          right={
            <ChartLegend
              items={[
                { label: "Média manual (antes)", color: CHART.white },
                { label: `Com a ${CLIENT.agentName}`, color: CHART.red },
              ]}
            />
          }
          className="mb-6"
        />
        <div
          className="h-[280px]"
          role="img"
          aria-label={`Leads qualificados por semana: média manual antes contra com a ${CLIENT.agentName}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={WEEKLY_QUALIFIED}
              margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
              barGap={5}
            >
              <CartesianGrid {...GRID} />
              <XAxis {...AXIS} dataKey="w" />
              <YAxis {...AXIS} width={34} />
              <Tooltip
                content={<VTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar
                dataKey="antes"
                name="Média manual (antes)"
                fill={CHART.white}
                fillOpacity={0.72}
                radius={[4, 4, 0, 0]}
                maxBarSize={34}
              />
              <Bar
                dataKey="comIA"
                name={`Com a ${CLIENT.agentName}`}
                fill={CHART.red}
                radius={[4, 4, 0, 0]}
                maxBarSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </section>
  );
}
