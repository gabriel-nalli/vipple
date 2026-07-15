"use client";

import { Lightbulb } from "lucide-react";
import { Panel, RankRow } from "@/components/ui/kit";
import { PAINS, CLIENT, TOTALS } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { PanelHead, Insight } from "./PanelHead";

const MAX_PCT = Math.max(...PAINS.map((p) => p.pct));

export default function PainsPanel({ className = "" }: { className?: string }) {
  return (
    <Panel beam className={`p-6 md:p-7 ${className}`}>
      <PanelHead kicker="O que trava a decisão">
        Dores &amp; <span className="text-vred">objeções</span> mais ouvidas
      </PanelHead>

      <div className="mt-6 space-y-5">
        {PAINS.map((p, i) => (
          <div key={p.label}>
            <RankRow
              label={p.label}
              value={fmtPct(p.pct)}
              pct={(p.pct / MAX_PCT) * 100}
              delay={i * 80}
            />
            <p className="mt-1.5 text-[0.7rem] font-light italic leading-relaxed text-ink-mute">
              {p.quote}
            </p>
          </div>
        ))}
      </div>

      <Insight className="mt-7" icon={<Lightbulb size={15} strokeWidth={1.8} />}>
        <span className="num font-medium text-white">{fmtPct(PAINS[0].pct)}</span>{" "}
        travam no preço → a {CLIENT.agentName} já responde com parcelamento e
        mantém{" "}
        <span className="num font-medium text-white">
          {TOTALS.retencaoPosObjecaoPct}%
        </span>{" "}
        desses leads na conversa.
      </Insight>
    </Panel>
  );
}
