"use client";

import { LiveDot, Panel, RankRow } from "@/components/ui/kit";
import { STAGE_TIME, TOTALS } from "@/lib/data";
import { fmtDur } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   Tempo por etapa — a velocidade da Vitória, do "oi" ao handoff.
   Barras proporcionais ao tempo (max = Qualificação, 252s).
   ══════════════════════════════════════════════════════════════ */

const MAX_SEG = Math.max(...STAGE_TIME.map((s) => s.seg));

export default function StageTimePanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col gap-7 p-6 md:p-8 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker mb-2">Velocidade da Vitória</p>
          <h3 className="display text-xl text-white md:text-[1.4rem]">
            Tempo por <span className="text-vred">etapa</span>
          </h3>
        </div>
        <span className="pill pill-ghost num">
          <LiveDot />
          1ª resposta em {fmtDur(TOTALS.primeiraRespostaSeg)}
        </span>
      </div>

      <div className="space-y-5">
        {STAGE_TIME.map((s, i) => (
          <RankRow
            key={s.label}
            label={s.label}
            value={fmtDur(s.seg)}
            pct={(s.seg / MAX_SEG) * 100}
            delay={i * 90}
            sub={
              i === 0
                ? `imediata, 24/7 — antes: ${fmtDur(
                    TOTALS.primeiraRespostaAntesSeg
                  )} de espera média`
                : undefined
            }
          />
        ))}
      </div>

      <p className="mt-auto border-t border-white/[0.06] pt-4 text-[0.7rem] font-light leading-relaxed text-ink-mute">
        Do primeiro “oi” ao lead qualificado em{" "}
        <span className="num font-medium text-ink-dim">
          {fmtDur(TOTALS.tempoQualificacaoSeg)}
        </span>{" "}
        em média — a conversa acontece enquanto o lead ainda está quente.
      </p>
    </Panel>
  );
}
