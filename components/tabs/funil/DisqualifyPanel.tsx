"use client";

import { Panel, RankRow } from "@/components/ui/kit";
import { CLIENT, DISQUALIFY_REASONS, TOTALS } from "@/lib/data";
import { fmtInt, fmtPct } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   Por que a Via descartou 158 leads — o filtro, não a perda.
   3+ categorias → RankRow (barras horizontais rotuladas).
   ══════════════════════════════════════════════════════════════ */

const MAX_N = Math.max(...DISQUALIFY_REASONS.map((r) => r.n));

export default function DisqualifyPanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col gap-7 p-6 md:p-8 ${className}`}>
      <div>
        <p className="kicker mb-2">Filtro de qualificação</p>
        <h3 className="display text-xl text-white md:text-[1.4rem]">
          Por que a {CLIENT.agentName}{" "}
          <span className="text-vred">descartou</span>{" "}
          {fmtInt(TOTALS.desqualificados)} leads
        </h3>
      </div>

      <div className="space-y-5">
        {DISQUALIFY_REASONS.map((r, i) => (
          <RankRow
            key={r.label}
            label={r.label}
            value={`${fmtInt(r.n)} leads`}
            pct={(r.n / MAX_N) * 100}
            sub={`${fmtPct((r.n / TOTALS.desqualificados) * 100, 1)} dos descartes`}
            delay={i * 90}
          />
        ))}
      </div>

      <p className="mt-auto border-t border-white/[0.06] pt-4 text-[0.7rem] font-light leading-relaxed text-ink-mute">
        Descarte não é perda: é o filtro em ação. Cada lead descartado com
        motivo registrado economizou{" "}
        <span className="num font-medium text-ink-dim">~9 min</span> de triagem
        do time comercial — antes que qualquer vendedor precisasse responder.
      </p>
    </Panel>
  );
}
