"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Delta, Panel } from "@/components/ui/kit";
import {
  AXIS,
  CHART,
  ChartLegend,
  GRID,
  VTooltip,
} from "@/components/charts/theme";
import { CLIENT, MSGS_TREND } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { PanelHead } from "./PanelHead";

const fmt1 = (n: number) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const FIRST = MSGS_TREND[0].msgs; // 14,0
const LAST = MSGS_TREND[MSGS_TREND.length - 1].msgs; // 10,8
const DROP_PCT = Math.round(((LAST - FIRST) / FIRST) * 100); // −23

export default function LearningPanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel beam className={`p-6 md:p-8 ${className}`}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <PanelHead kicker="Curva de aprendizado">
            A {CLIENT.agentName} está{" "}
            <span className="text-vred">aprendendo</span>
          </PanelHead>

          <div className="mt-7 flex items-end gap-3">
            <span className="display num text-[1.9rem] leading-none text-ink-mute">
              {fmt1(FIRST)}
            </span>
            <span aria-hidden className="pb-0.5 text-lg leading-none text-vred">
              →
            </span>
            <span className="display num text-[2.9rem] leading-none text-white">
              {fmt1(LAST)}
            </span>
          </div>
          <p className="kicker mt-3 !text-[0.5rem]">
            Mensagens médias até qualificar
          </p>
          <div className="mt-3">
            <Delta
              value={DROP_PCT}
              suffix="%"
              goodWhenUp={false}
              label="em 4 semanas"
            />
          </div>

          <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-ink-dim">
            Menos atrito, mesma precisão. A cada semana, a {CLIENT.agentName}{" "}
            qualifica com menos mensagens — sem abrir mão de nenhum critério.
          </p>
          <p className="mt-4 text-[0.65rem] font-light leading-relaxed text-ink-mute">
            Eixo recortado entre 8 e 16 mensagens para dar zoom na tendência —
            a queda real sobre a semana 1 é de{" "}
            <span className="num">{fmtPct(Math.abs(DROP_PCT))}</span>.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="mb-3 flex justify-end">
            <ChartLegend
              items={[
                { label: "Mensagens médias até qualificar", color: CHART.red },
              ]}
            />
          </div>
          <div
            className="h-[240px] md:h-[280px]"
            role="img"
            aria-label="Mensagens médias até qualificar por semana, nas últimas 4 semanas"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={MSGS_TREND}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid {...GRID} />
                <XAxis {...AXIS} dataKey="w" />
                <YAxis
                  {...AXIS}
                  width={34}
                  domain={[8, 16]}
                  ticks={[8, 10, 12, 14, 16]}
                />
                <Tooltip
                  content={
                    <VTooltip formatter={(v) => `${fmt1(Number(v))} msgs`} />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="msgs"
                  name="Msgs até qualificar"
                  stroke={CHART.red}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Panel>
  );
}
