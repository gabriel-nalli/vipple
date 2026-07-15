"use client";

import { useEffect, useState } from "react";
import { LiveDot, Panel } from "@/components/ui/kit";
import { CLIENT, DAILY, LIVE, TOTALS } from "@/lib/data";
import { fmtDur, fmtInt } from "@/lib/format";

/* ══════════════════════════════════════════════════════════════
   STRIP DE STATUS — painel de controle de missão.
   Oscilação das conversas ativas 100% determinística (padrão
   fixo de offsets, nunca Math.random) — só roda em useEffect.
   ══════════════════════════════════════════════════════════════ */

/* Offsets sobre LIVE.activeConversations (7) → oscila entre 6 e 9 */
const DRIFT = [0, 1, 2, 1, 1, 0, -1, 0, 1, 2, 1, 0, -1, -1, 0, 1];

export default function StatusStrip() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % DRIFT.length), 4000);
    return () => clearInterval(id);
  }, []);

  const active = LIVE.activeConversations + DRIFT[step];
  const hoje = DAILY[DAILY.length - 1];

  const counters: {
    label: string;
    value: string;
    hint: string;
    accent?: boolean;
    tickerKey: string | number;
  }[] = [
    {
      label: "Conversas ativas agora",
      value: fmtInt(active),
      hint: `${CLIENT.agentName} conduz todas simultaneamente`,
      accent: true,
      tickerKey: active,
    },
    {
      label: "Na fila para vendedor",
      value: fmtInt(LIVE.hotQueue.length),
      hint: "leads quentes aguardando handoff",
      tickerKey: "fila",
    },
    {
      label: "Contatos hoje",
      value: fmtInt(hoje.contatos),
      hint: `novas conversas em ${hoje.d}`,
      tickerKey: "hoje",
    },
    {
      label: "1ª resposta média",
      value: fmtDur(TOTALS.primeiraRespostaSeg),
      hint: `antes da ${CLIENT.agentName}: ${fmtDur(TOTALS.primeiraRespostaAntesSeg)}`,
      tickerKey: "resposta",
    },
  ];

  return (
    <Panel beam className="relative overflow-hidden">
      {/* respiração vermelha de fundo — bem sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-vred/[0.07] blur-3xl"
      />

      <div className="relative flex flex-col gap-8 p-6 md:p-8">
        {/* linha de status */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="flex items-center gap-3">
            <LiveDot className="scale-[1.5]" />
            <h1 className="kicker !text-[0.68rem] !tracking-[0.5em] !text-ink">
              Operação <span className="text-vred">ao vivo</span>
            </h1>
          </span>
          <span className="hidden h-4 w-px bg-white/10 sm:block" />
          <p className="hidden text-[0.7rem] font-light text-ink-mute sm:block">
            {CLIENT.agentFull} · WhatsApp conectado · monitorando em tempo real
          </p>
          <span className="pill pill-ghost ml-auto">cobertura 24/7</span>
        </div>

        {/* contadores de missão */}
        <div className="stagger grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {counters.map((c) => (
            <div key={c.label} className="reveal">
              <p className="kicker mb-3 !text-[0.56rem]">{c.label}</p>
              <p
                className={`display num text-[2.3rem] leading-none md:text-[2.8rem] ${
                  c.accent ? "text-vred" : "text-white"
                }`}
                style={
                  c.accent
                    ? { textShadow: "0 0 32px rgba(255,23,23,0.5)" }
                    : undefined
                }
              >
                {/* key troca → o número "pisca" com animate-ticker */}
                <span key={c.tickerKey} className="inline-block animate-ticker">
                  {c.value}
                </span>
              </p>
              <p className="mt-2 text-[0.66rem] font-light leading-relaxed text-ink-mute">
                {c.hint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
