"use client";

import { BadgeCheck } from "lucide-react";
import { LiveDot, Panel } from "@/components/ui/kit";
import type { LiveConversation } from "@/lib/data";

/* ══════════════════════════════════════════════════════════════
   CONVERSA DO LEAD SELECIONADO
   Mostra a conversa inteira de uma vez (mensagens do lead e da
   Vitória). Sem animação de digitação — clicou no card, aparece tudo.
   ══════════════════════════════════════════════════════════════ */

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export default function ConversationView({ conv }: { conv: LiveConversation }) {
  const ongoing = conv.status === "em_andamento";

  return (
    <Panel className="flex h-full min-h-[540px] flex-col overflow-hidden">
      {/* cabeçalho do lead */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vred/15 text-[0.7rem] font-semibold text-vred ring-1 ring-vred/25">
          {initials(conv.lead)}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[0.85rem] font-medium text-white">
            {conv.lead}
          </p>
          <p className="truncate text-[0.62rem] uppercase tracking-[0.18em] text-ink-mute">
            {conv.interesse} · {conv.origem}
          </p>
        </div>
        {ongoing ? (
          <span className="flex shrink-0 items-center gap-1.5 text-[0.56rem] font-medium uppercase tracking-[0.22em] text-vred">
            <LiveDot className="scale-75" />
            Ao vivo
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1.5 text-[0.56rem] font-medium uppercase tracking-[0.22em] text-money">
            <BadgeCheck size={12} aria-hidden />
            Qualificado
          </span>
        )}
      </div>

      {/* trilha da conversa — completa, agrupada por remetente */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5"
        aria-label={`Conversa entre ${conv.lead} e a Vitória`}
      >
        {conv.messages.map((m, i) => {
          const prev = i > 0 ? conv.messages[i - 1] : null;
          const grouped = !!prev && prev.from === m.from; // segue o mesmo remetente
          const gap = i === 0 ? "" : grouped ? "mt-1" : "mt-4";

          if (m.from === "system") {
            return (
              <div key={i} className={`flex justify-center py-1 ${i === 0 ? "" : "mt-4"}`}>
                <span className="inline-flex items-center gap-2 rounded-full border border-money/30 bg-money/[0.12] px-3.5 py-1.5 text-[0.68rem] font-medium text-money">
                  <BadgeCheck size={13} aria-hidden />
                  {m.text}
                </span>
              </div>
            );
          }

          const isVia = m.from === "via";
          return (
            <div
              key={i}
              className={`flex ${gap} ${isVia ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[0.8rem] font-light leading-relaxed ${
                  isVia
                    ? "rounded-br-sm border border-vred/25 bg-vred/[0.13] text-white"
                    : "rounded-bl-sm bg-white/[0.06] text-ink"
                } ${grouped ? (isVia ? "rounded-tr-sm" : "rounded-tl-sm") : ""}`}
              >
                {!grouped && (
                  <span
                    className={`mb-0.5 block text-[0.54rem] font-medium uppercase tracking-[0.16em] ${
                      isVia ? "text-vred-soft" : "text-ink-mute"
                    }`}
                  >
                    {isVia ? "Vitória · IA" : conv.lead.split(" ")[0]}
                  </span>
                )}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* rodapé */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3 text-[0.66rem] font-light text-ink-mute">
        <span
          className={`h-1.5 w-1.5 rounded-full ${ongoing ? "bg-vred" : "bg-money"}`}
          aria-hidden
        />
        {ongoing
          ? "Vitória conduzindo a qualificação · WhatsApp conectado"
          : "Atendimento concluído · lead encaminhado ao vendedor"}
      </div>
    </Panel>
  );
}
