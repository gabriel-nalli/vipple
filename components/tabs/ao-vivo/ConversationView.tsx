"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { LiveDot, Panel } from "@/components/ui/kit";
import type { LiveConversation } from "@/lib/data";

/* ══════════════════════════════════════════════════════════════
   CONVERSA DO LEAD SELECIONADO — transmite mensagem a mensagem.
   · A Via "digita" antes de responder.
   · Montado com key={lead} no pai → trocar de card reinicia a
     transmissão do zero, sem estado remanescente.
   · Estado inicial determinístico (1ª msg visível) — sem hydration.
   ══════════════════════════════════════════════════════════════ */

const TYPING_MS = 1300;
const READ_MS = 1200;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export default function ConversationView({ conv }: { conv: LiveConversation }) {
  const msgs = conv.messages;
  const [shown, setShown] = useState(1);
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const done = shown >= msgs.length;
  const ongoing = conv.status === "em_andamento";

  useEffect(() => {
    if (done) {
      // em atendimento: a Via segue "digitando" (o lead ainda responde)
      if (ongoing && msgs[msgs.length - 1]?.from === "lead") setTyping(true);
      return;
    }
    const next = msgs[shown];
    const viaTyping = next.from === "via";

    if (viaTyping && !typing) {
      timer.current = setTimeout(() => setTyping(true), READ_MS);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }
    timer.current = setTimeout(
      () => {
        setShown((n) => n + 1);
        setTyping(false);
      },
      viaTyping ? TYPING_MS : READ_MS
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [shown, typing, done, ongoing, msgs]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, typing]);

  const visible = msgs.slice(0, shown);

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

      {/* trilha da conversa */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-5"
        aria-live="polite"
        aria-label={`Conversa entre ${conv.lead} e a Via`}
      >
        {visible.map((m, i) =>
          m.from === "system" ? (
            <div key={i} className="flex animate-fade-up justify-center py-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-money/30 bg-money/[0.12] px-3.5 py-1.5 text-[0.68rem] font-medium text-money">
                <BadgeCheck size={13} aria-hidden />
                {m.text}
              </span>
            </div>
          ) : (
            <div
              key={i}
              className={`flex animate-fade-up ${
                m.from === "via" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[0.8rem] font-light leading-relaxed ${
                  m.from === "via"
                    ? "rounded-br-sm border border-vred/25 bg-vred/[0.13] text-white"
                    : "rounded-bl-sm bg-white/[0.06] text-ink"
                }`}
              >
                <span
                  className={`mb-0.5 block text-[0.54rem] font-medium uppercase tracking-[0.16em] ${
                    m.from === "via" ? "text-vred-soft" : "text-ink-mute"
                  }`}
                >
                  {m.from === "via" ? "Via · IA" : conv.lead.split(" ")[0]}
                </span>
                {m.text}
              </div>
            </div>
          )
        )}

        {typing && (
          <div className="flex animate-fade-up justify-end">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-br-sm border border-vred/25 bg-vred/[0.1] px-3.5 py-3">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-vred-soft"
                  style={{ animationDelay: `${d * 180}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* rodapé */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3 text-[0.66rem] font-light text-ink-mute">
        <span
          className={`h-1.5 w-1.5 rounded-full ${ongoing ? "bg-vred" : "bg-money"}`}
          aria-hidden
        />
        {ongoing
          ? "Via conduzindo a qualificação · WhatsApp conectado"
          : "Atendimento concluído · lead encaminhado ao vendedor"}
      </div>
    </Panel>
  );
}
