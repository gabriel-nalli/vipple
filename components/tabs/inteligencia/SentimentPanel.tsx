"use client";

import { Panel, useInViewOnce } from "@/components/ui/kit";
import { CHART } from "@/components/charts/theme";
import { CLIENT, SENTIMENT, TOTALS } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { PanelHead } from "./PanelHead";

const SEGMENTS = [
  { label: "Positivo", pct: SENTIMENT.positivo, color: CHART.money },
  { label: "Neutro", pct: SENTIMENT.neutro, color: CHART.gray },
  { label: "Negativo", pct: SENTIMENT.negativo, color: CHART.redSoft },
];

export default function SentimentPanel({
  className = "",
}: {
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const csat = TOTALS.csat.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <Panel className={`flex flex-col p-6 md:p-7 ${className}`}>
      <PanelHead kicker="Sentimento & satisfação">
        Clima das <span className="text-vred">conversas</span>
      </PanelHead>

      {/* CSAT gigante */}
      <div className="mt-7">
        <div className="flex items-end gap-2.5">
          <p className="display num text-[3.6rem] leading-none text-white md:text-[4.2rem]">
            {csat}
          </p>
          <span
            aria-hidden
            className="pb-1 text-[1.7rem] leading-none text-vred"
            style={{ textShadow: "0 0 22px rgba(255,23,23,0.55)" }}
          >
            ★
          </span>
          <span className="num pb-1.5 text-[0.75rem] text-ink-mute">/ 5</span>
        </div>
        <p className="mt-2 text-[0.7rem] font-light text-ink-mute">
          CSAT médio informado pelos leads ao fim do atendimento
        </p>
      </div>

      {/* Barra segmentada de sentimento */}
      <div ref={ref} className="mt-8">
        <div className="flex h-3 w-full gap-[2px]" role="img" aria-label="Distribuição de sentimento das conversas">
          {SEGMENTS.map((s, i) => (
            <div
              key={s.label}
              className="h-full rounded-full"
              style={{
                width: inView ? `${s.pct}%` : "0%",
                background: s.color,
                transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
              }}
            />
          ))}
        </div>
        <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
          {SEGMENTS.map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-1.5 text-[0.7rem] font-light text-ink-dim"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
              <span className="num font-medium text-white">
                {fmtPct(s.pct)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Escalada precoce */}
      <div className="mt-auto pt-7">
        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-[0.72rem] font-light leading-relaxed text-ink-dim">
            Apenas{" "}
            <span className="num font-medium text-white">
              {fmtPct(TOTALS.escaladaPrecocePct, 1)}
            </span>{" "}
            das conversas escalaram para um humano antes da hora — a{" "}
            {CLIENT.agentName} segura a conversa até o lead estar pronto.
          </p>
        </div>
      </div>
    </Panel>
  );
}
