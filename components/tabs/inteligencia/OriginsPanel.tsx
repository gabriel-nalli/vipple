"use client";

import { Panel, RankRow } from "@/components/ui/kit";
import { ORIGINS } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { PanelHead } from "./PanelHead";

const MAX_PCT = Math.max(...ORIGINS.map((o) => o.pct));

export default function OriginsPanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col p-6 md:p-7 ${className}`}>
      <PanelHead kicker="Canais de aquisição">
        De onde <span className="text-vred">vêm</span>
      </PanelHead>

      <div className="mt-6 space-y-5">
        {ORIGINS.map((o, i) => (
          <RankRow
            key={o.label}
            label={o.label}
            value={fmtPct(o.pct)}
            pct={(o.pct / MAX_PCT) * 100}
            delay={i * 80}
          />
        ))}
      </div>

      <div className="mt-auto pt-7">
        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-[0.72rem] font-light leading-relaxed text-ink-dim">
            <span className="font-normal text-white">Meta Ads domina</span> —{" "}
            <span className="num font-medium text-white">
              {fmtPct(ORIGINS[0].pct)}
            </span>{" "}
            do volume. E o cruzamento com o funil confirma: é também o canal
            com melhor custo por lead qualificado do período.
          </p>
        </div>
      </div>
    </Panel>
  );
}
