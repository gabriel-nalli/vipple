"use client";

import { useState } from "react";
import { LiveDot, Panel, SectionHeader } from "@/components/ui/kit";
import { LIVE_CONVERSATIONS, type LiveConversation } from "@/lib/data";
import { fmtAgo } from "@/lib/format";
import ConversationView from "@/components/tabs/ao-vivo/ConversationView";

/* ══════════════════════════════════════════════════════════════
   CENTRAL DE ATENDIMENTOS AO VIVO (master-detail)
   Esquerda: cards dos leads em atendimento (clicáveis).
   Direita: a conversa do lead selecionado, transmitida ao vivo.
   ══════════════════════════════════════════════════════════════ */

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function preview(conv: LiveConversation): string {
  const last = [...conv.messages].reverse().find((m) => m.from !== "system");
  return last ? last.text : "";
}

const emAndamento = LIVE_CONVERSATIONS.filter(
  (c) => c.status === "em_andamento"
).length;

function LeadCard({
  conv,
  active,
  onSelect,
}: {
  conv: LiveConversation;
  active: boolean;
  onSelect: () => void;
}) {
  const ongoing = conv.status === "em_andamento";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-vred/50 bg-vred/[0.06] shadow-[0_0_36px_-16px_rgba(255,23,23,0.6)]"
          : "border-white/[0.07] bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vred/15 text-[0.72rem] font-semibold text-vred ring-1 ring-vred/25">
          {initials(conv.lead)}
          {ongoing && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0b0b] bg-vred" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[0.9rem] font-medium text-white">
              {conv.lead}
            </p>
            <span className="num shrink-0 text-[0.62rem] text-ink-mute">
              {fmtAgo(conv.startedMin)}
            </span>
          </div>
          <p className="truncate text-[0.72rem] font-light text-ink-dim">
            {conv.interesse} · {conv.origem}
          </p>
          <p className="mt-1.5 line-clamp-1 text-[0.72rem] font-light italic text-ink-mute">
            {preview(conv)}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            {ongoing ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-vred/25 bg-vred/10 px-2 py-0.5 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-vred-soft">
                <LiveDot className="scale-[0.6]" />
                Em atendimento
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-money/30 bg-money/10 px-2 py-0.5 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-money">
                Qualificado
              </span>
            )}
            <span className="num text-[0.6rem] text-ink-mute">
              score {conv.score}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function LiveAttendance() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="space-y-6">
      <SectionHeader
        kicker="Central de atendimentos"
        title="Acompanhe a Via"
        accent="ao vivo"
        right={
          <span className="pill pill-ghost">
            <LiveDot className="scale-75" />
            {emAndamento} em atendimento agora
          </span>
        }
      />

      <div className="grid grid-cols-12 gap-5">
        {/* lista de leads (cards clicáveis) */}
        <div className="col-span-12 lg:col-span-5">
          <p className="kicker mb-3 !text-[0.55rem]">
            Leads · clique para acompanhar
          </p>
          <div className="space-y-3">
            {LIVE_CONVERSATIONS.map((conv, i) => (
              <LeadCard
                key={conv.lead}
                conv={conv}
                active={i === selected}
                onSelect={() => setSelected(i)}
              />
            ))}
          </div>
        </div>

        {/* conversa do lead selecionado */}
        <div className="col-span-12 lg:col-span-7">
          <ConversationView
            key={LIVE_CONVERSATIONS[selected].lead}
            conv={LIVE_CONVERSATIONS[selected]}
          />
        </div>
      </div>
    </section>
  );
}
