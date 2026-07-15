"use client";

import { Target } from "lucide-react";
import { Panel, RankRow } from "@/components/ui/kit";
import { SERVICES } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { PanelHead, Insight } from "./PanelHead";

const MAX_PCT = Math.max(...SERVICES.map((s) => s.pct));
const TOP2_PCT = SERVICES[0].pct + SERVICES[1].pct; // 60

export default function ServicesPanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col p-6 md:p-7 ${className}`}>
      <PanelHead kicker="Demanda por procedimento">
        O que mais <span className="text-vred">pedem</span>
      </PanelHead>

      <div className="mt-6 space-y-5">
        {SERVICES.map((s, i) => (
          <RankRow
            key={s.label}
            label={s.label}
            value={fmtPct(s.pct)}
            pct={(s.pct / MAX_PCT) * 100}
            delay={i * 80}
          />
        ))}
      </div>

      <div className="mt-auto pt-7">
        <Insight icon={<Target size={15} strokeWidth={1.8} />}>
          Implante + Invisalign ={" "}
          <span className="num font-medium text-white">{fmtPct(TOP2_PCT)}</span>{" "}
          da demanda → priorize agenda e criativos aí.
        </Insight>
      </div>
    </Panel>
  );
}
