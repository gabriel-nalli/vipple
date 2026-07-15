"use client";

import { CheckCircle2 } from "lucide-react";
import { Panel, useInViewOnce } from "@/components/ui/kit";
import { CRITERIA, TOTALS } from "@/lib/data";
import { fmtInt, fmtPct } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   Checklist de qualificação — os 5 critérios que a Vitória valida
   antes de entregar um lead ao time. Mostra o rigor do agente.
   ══════════════════════════════════════════════════════════════ */

function CriterionRow({
  label,
  desc,
  pct,
  delay,
}: {
  label: string;
  desc: string;
  pct: number;
  delay: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="flex items-start gap-3">
      <CheckCircle2
        size={16}
        strokeWidth={2}
        aria-hidden
        className="mt-0.5 shrink-0 text-vred"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline justify-between gap-3">
          <span className="text-[0.8rem] font-normal text-ink">{label}</span>
          <span className="num text-[0.8rem] font-medium text-white">
            {fmtPct(pct)}
          </span>
        </div>
        <p className="mb-2 text-[0.65rem] font-light text-ink-mute">{desc}</p>
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-out"
            style={{
              width: inView ? `${pct}%` : "0%",
              background: "linear-gradient(90deg, #FF171788, #FF1717)",
              boxShadow: "0 0 12px #FF171755",
              transitionDelay: `${delay}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function CriteriaChecklist({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel className={`flex flex-col gap-7 p-6 md:p-8 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker mb-2">O rigor do agente</p>
          <h3 className="display text-xl text-white md:text-[1.4rem]">
            Checklist de <span className="text-vred">qualificação</span>
          </h3>
        </div>
        <span className="pill pill-ghost num">
          {fmtInt(TOTALS.qualificados)} aprovados
        </span>
      </div>

      <div className="space-y-5">
        {CRITERIA.map((c, i) => (
          <CriterionRow
            key={c.label}
            label={c.label}
            desc={c.desc}
            pct={c.pct}
            delay={i * 90}
          />
        ))}
      </div>

      <p className="mt-auto border-t border-white/[0.06] pt-4 text-[0.7rem] font-light leading-relaxed text-ink-mute">
        Percentual dos leads identificados que passam em cada critério. Só
        avança quem cumpre os 5:{" "}
        <span className="num font-medium text-ink-dim">
          {fmtInt(TOTALS.qualificados)}
        </span>{" "}
        de{" "}
        <span className="num font-medium text-ink-dim">
          {fmtInt(TOTALS.identificados)}
        </span>{" "}
        — rigor que protege a agenda do time.
      </p>
    </Panel>
  );
}
