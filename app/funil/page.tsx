"use client";

import { SectionHeader } from "@/components/ui/kit";
import { CLIENT, TOTALS } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import FunnelViz from "@/components/tabs/funil/FunnelViz";
import DisqualifyPanel from "@/components/tabs/funil/DisqualifyPanel";
import CriteriaChecklist from "@/components/tabs/funil/CriteriaChecklist";
import StageTimePanel from "@/components/tabs/funil/StageTimePanel";
import StepConversionChart from "@/components/tabs/funil/StepConversionChart";

/* ══════════════════════════════════════════════════════════════
   ABA FUNIL — onde os leads avançam e onde caem.
   Protagonista: o funil vertical de 6 estágios. Em volta,
   o porquê dos descartes, o rigor do checklist, o tempo por
   etapa e a taxa de passagem de cada transição.
   ══════════════════════════════════════════════════════════════ */

export default function FunilPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* 1 · Header + 2 · O Funil */}
      <section className="stagger space-y-8">
        <SectionHeader
          as="h1"
          className="reveal"
          kicker={`Funil de atendimento — ${CLIENT.period}`}
          title="De contato a"
          accent="cliente."
          right={
            <span className="pill pill-ghost num">
              {fmtInt(TOTALS.contatos)} contatos no período
            </span>
          }
        />
        <FunnelViz className="reveal" />
      </section>

      {/* 3 · Descartes × Checklist */}
      <section className="stagger grid grid-cols-12 gap-5">
        <DisqualifyPanel className="reveal col-span-12 lg:col-span-7" />
        <CriteriaChecklist className="reveal col-span-12 lg:col-span-5" />
      </section>

      {/* 4 · Tempo por etapa × Conversão etapa a etapa */}
      <section className="stagger grid grid-cols-12 gap-5">
        <StageTimePanel className="reveal col-span-12 lg:col-span-6" />
        <StepConversionChart className="reveal col-span-12 lg:col-span-6" />
      </section>
    </div>
  );
}
