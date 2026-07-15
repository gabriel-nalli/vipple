"use client";

import { HelpCircle, Sparkles } from "lucide-react";
import { Panel } from "@/components/ui/kit";
import { CLIENT, UNANSWERED } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import { PanelHead, Insight } from "./PanelHead";

const TOTAL_OCCURRENCES = UNANSWERED.reduce((s, u) => s + u.n, 0);

export default function UnansweredPanel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Panel beam className={`flex flex-col p-6 md:p-7 ${className}`}>
      <PanelHead
        kicker="Ouro para o negócio"
        right={
          <span className="pill pill-ghost num !text-[0.68rem]">
            {fmtInt(TOTAL_OCCURRENCES)} ocorrências
          </span>
        }
      >
        Perguntas que a {CLIENT.agentName} ainda{" "}
        <span className="text-vred">não sabia</span> responder
      </PanelHead>

      <ul className="mt-5 divide-y divide-white/[0.05]">
        {UNANSWERED.map((u) => (
          <li
            key={u.q}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <span className="flex items-start gap-3">
              <HelpCircle
                size={15}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0 text-ink-mute"
                aria-hidden
              />
              <span className="text-[0.82rem] font-light leading-relaxed text-ink">
                {u.q}
              </span>
            </span>
            <span className="num inline-flex shrink-0 items-center rounded-full border border-warn/30 bg-warn/10 px-2.5 py-1 text-[0.68rem] font-medium text-warn">
              {fmtInt(u.n)}×
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <Insight icon={<Sparkles size={15} strokeWidth={1.8} />}>
          Cada uma vira conhecimento novo: respostas adicionadas à base da{" "}
          {CLIENT.agentName} na próxima atualização — o agente melhora toda
          semana.
        </Insight>
      </div>
    </Panel>
  );
}
