"use client";

import { Fragment } from "react";
import { Panel, useCountUp, useInViewOnce } from "@/components/ui/kit";
import { CLIENT, FUNNEL, TOTALS, type FunnelStage } from "@/lib/data";
import { fmtBRL, fmtInt, fmtPct } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   O FUNIL — protagonista da aba. 6 estágios em barras centradas,
   largura proporcional ao volume, animadas ao entrar na viewport.
   Neutros no topo (volume bruto) → vermelho na qualificação →
   glow no fechamento.
   ══════════════════════════════════════════════════════════════ */

const TOP = FUNNEL[0].value;
const MIN_WIDTH_PCT = 18;

/* Visual de cada estágio — 2 primeiros em branco/cinza translúcido
   escurecendo; qualificação em rampa de vermelho; último com glow */
const STAGE_LOOK: { bg: string; border: string; shadow?: string }[] = [
  {
    bg: "linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.07))",
    border: "1px solid rgba(255,255,255,0.14)",
  },
  {
    bg: "linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  {
    bg: "linear-gradient(90deg, #7a1010, #4a0c0c)",
    border: "1px solid rgba(255,23,23,0.28)",
  },
  {
    bg: "linear-gradient(90deg, #ab1313, #6b0e0e)",
    border: "1px solid rgba(255,23,23,0.36)",
  },
  {
    bg: "linear-gradient(90deg, #d91515, #8c1111)",
    border: "1px solid rgba(255,23,23,0.46)",
  },
  {
    bg: "linear-gradient(90deg, #ff1717, #c21414)",
    border: "1px solid rgba(255,92,71,0.6)",
    shadow: "0 0 24px rgba(255,23,23,0.35), 0 0 80px rgba(255,23,23,0.12)",
  },
];

function StageBar({
  stage,
  index,
  inView,
}: {
  stage: FunnelStage;
  index: number;
  inView: boolean;
}) {
  const animated = useCountUp(stage.value, inView, 1200);
  const widthPct = Math.max((stage.value / TOP) * 100, MIN_WIDTH_PCT);
  const pctOfTop = (stage.value / TOP) * 100;
  const look = STAGE_LOOK[index];
  const isLast = index === FUNNEL.length - 1;

  return (
    <div className="group relative flex flex-col items-center">
      {/* Receita ao lado do estágio final — verde só para dinheiro */}
      {isLast && (
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
          <span className="pill pill-money num whitespace-nowrap">
            {fmtBRL(TOTALS.receita)} gerados
          </span>
        </div>
      )}

      {/* Descrição do estágio — tooltip no hover (desktop) */}
      <div className="pointer-events-none absolute -top-1.5 left-1/2 z-10 max-w-[15rem] -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-[#0c0c0c]/95 px-3 py-1.5 opacity-0 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
        <span className="block text-center text-[0.66rem] font-light leading-snug text-ink-dim">
          {stage.desc}
        </span>
      </div>

      <div
        title={stage.desc}
        className="relative flex h-[52px] items-center justify-between gap-3 rounded-xl px-4 group-hover:brightness-110 md:h-[58px] md:px-6"
        style={{
          width: inView ? `${widthPct}%` : `${MIN_WIDTH_PCT}%`,
          minWidth: `${MIN_WIDTH_PCT}%`,
          background: look.bg,
          border: look.border,
          boxShadow: look.shadow,
          transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, filter 0.3s ease`,
        }}
      >
        <span className="truncate text-[0.58rem] font-medium uppercase tracking-[0.18em] text-white/85 md:text-[0.66rem]">
          {stage.label}
        </span>
        <span className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="display num text-[1.15rem] leading-none text-white md:text-[1.35rem]">
            {fmtInt(animated)}
          </span>
          <span className="num hidden text-[0.62rem] font-light text-white/55 sm:inline">
            {fmtPct(pctOfTop, pctOfTop < 10 ? 1 : 0)}
          </span>
        </span>
      </div>

      {/* Descrição sempre visível em telas pequenas (touch/sem hover) */}
      <p className="mt-1 block max-w-[92%] text-center text-[0.62rem] font-light leading-snug text-ink-dim md:hidden">
        {stage.desc}
      </p>
    </div>
  );
}

function StepConnector({ pct, isFilter }: { pct: number; isFilter: boolean }) {
  return (
    <div className="relative">
      <div className="relative flex h-9 items-center justify-center md:h-10">
        <span
          aria-hidden
          className="h-full w-px bg-gradient-to-b from-white/25 via-white/10 to-white/25"
        />
        <span className="num absolute left-1/2 top-1/2 ml-3 flex -translate-y-1/2 items-center gap-1 text-[0.68rem] font-medium text-ink-dim">
          <span aria-hidden className="text-vred">
            ↓
          </span>
          {fmtPct(pct)}
        </span>

        {/* Callout do maior degrau: o filtro da Vitória em ação */}
        {isFilter && (
          <div className="absolute right-0 top-1/2 hidden max-w-[32%] -translate-y-1/2 xl:block">
            <span className="inline-flex items-center rounded-full border border-vred/25 bg-vred/[0.07] px-3.5 py-1.5 text-[0.66rem] font-light leading-snug text-ink-dim">
              <span aria-hidden className="mr-1.5 font-medium text-vred">
                ←
              </span>
              <span>
                aqui a {CLIENT.agentName} filtra:{" "}
                <span className="num font-medium text-white">
                  {fmtInt(TOTALS.desqualificados)}
                </span>{" "}
                descartados com motivo registrado
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Versão do callout para telas menores */}
      {isFilter && (
        <p className="pb-2 text-center text-[0.62rem] font-light text-ink-mute xl:hidden">
          <span aria-hidden className="text-vred">
            ●
          </span>{" "}
          aqui a {CLIENT.agentName} filtra:{" "}
          <span className="num font-medium text-ink-dim">
            {fmtInt(TOTALS.desqualificados)}
          </span>{" "}
          descartados com motivo registrado
        </p>
      )}
    </div>
  );
}

export default function FunnelViz({ className = "" }: { className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const totalPct = (FUNNEL[FUNNEL.length - 1].value / TOP) * 100;

  return (
    <Panel beam className={`p-6 md:p-10 ${className}`}>
      <div className="mb-9 flex flex-wrap items-center justify-between gap-3">
        <p className="kicker">Jornada do lead — WhatsApp · 6 estágios</p>
        <p className="kicker">{CLIENT.agentFull}</p>
      </div>

      <div ref={ref}>
        {FUNNEL.map((stage, i) => (
          <Fragment key={stage.key}>
            {i > 0 && (
              <StepConnector
                pct={Math.round((stage.value / FUNNEL[i - 1].value) * 100)}
                isFilter={stage.key === "qualificados"}
              />
            )}
            <StageBar stage={stage} index={i} inView={inView} />
          </Fragment>
        ))}
      </div>

      <p className="mt-9 text-center text-[0.7rem] font-light leading-relaxed text-ink-mute">
        Conversão total do funil:{" "}
        <span className="num font-medium text-white">{fmtPct(totalPct, 1)}</span>{" "}
        — de {fmtInt(TOTALS.contatos)} contatos a {fmtInt(TOTALS.fechados)}{" "}
        pacientes, sem nenhuma triagem manual do time.
      </p>
    </Panel>
  );
}
